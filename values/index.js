'use strict';

const amounts = require('amounts');
const color = require('./color');

const IDENTITY = function(input) { return input; };
const ALWAYS_FALSE = function() { return false; };
const TYPE_TAG = '_:value-type';

const change = require('./change');

function createPublicApi(def) {
	return function(value, required, msg) {
		if(typeof required != 'boolean') {
			msg = required;
			required = false;
		}

		if(required && (typeof value === 'undefined' || value == null)) {
			throw new Error(msg || 'Value required');
		}

		return def.create(value);
	};
}

class ValueRegistry {
	constructor() {
		this.defs = {};
	}

	register(type, def) {
		if(! def) {
			throw 'A definition with create (and optionally toJSON) needed for type ' + type;
		}

		if(typeof def === 'function') {
			def = {
				create: def,
				toJSON: def.toJSON,
				is: def.is
			};
		}

		if(! def.create) {
			throw 'create function required for type ' + type;
		}

		if(! def.toJSON) {
			def.toJSON = IDENTITY;
		}

		if(def.comparable) {
			this.register(type + ':change', change(def));
		}

		if(! def.is) {
			def.is = ALWAYS_FALSE;
		}

		this.defs[type] = def;
		this[type] = createPublicApi(def);
	}

	get(type) {
		return this.defs[type];
	}

	_toJSON(converter, value) {
		if(value === null || typeof value === 'undefined') {
			return null;
		}
		return converter.toJSON(converter.create(value));
	}

	fromJSON(type, value) {
		const def = this.defs[type] || this.defs.mixed;
		return def.create(value);
	}

	toJSON(type, value) {
		const def = this.defs[type] || this.defs.mixed;
		return def.toJSON(value);
	}

	createToJSON(types) {
		let mixed = this.get('mixed');
		if(Array.isArray(types)) {
			const converters = types.map(t => {
				if(t.type) t = t.type;
				return this.defs[t];
			});

			return (data) => {
				return Array.prototype.map.call(data, (value, idx) => {
					const converter = converters[idx] || mixed;
					return this._toJSON(converter, value);
				});
			};
		} else {
			if(types.type) types = types.type;
			const converter = this.defs[types] || mixed;
			return (value) => this._toJSON(converter, value);
		}
	}

	createConversion(types) {
		let mixed = this.get('mixed');
		if(Array.isArray(types)) {
			const converters = types.map(t => {
				if(t.type) t = t.type;
				return this.defs[t];
			});

			return function(data) {
				return Array.prototype.map.call(data, (value, idx) => {
					const converter = converters[idx] || mixed;
					return converter.create(value);
				});
			};
		} else {
			if(types.type) types = types.type;
			const converter = this.defs[types] || mixed;
			return function(data) {
				return converter.create(data);
			};
		}
	}
}

const values = module.exports = new ValueRegistry();

/*
 * Mixed type for dynamic serialization to and from JSON. This type uses a
 * tag to track the type used.
 */
values.register('mixed', {
	create: function(value) {
		let type;
		if(value && value[TYPE_TAG]) {
			type = values.get(value[TYPE_TAG]);
		}

		if(! type && Array.isArray(value)) {
			type = values.get('array');
		} else if(! type && typeof value === 'object') {
			let found = false;
			for(let key in values.defs) {
				const def = values.defs[key];
				if(def.is(value)) {
					type = def;
					found = true;
					break;
				}
			}

			if(! found) {
				type = values.get('object');
			}
		}

		if(type) {
			return type.create(value);
		}

		return value;
	},

	toJSON: function(value) {
		for(let key in values.defs) {
			const def = values.defs[key];
			if(def.is && def.is(value)) {
				// Found the correct type
				const json = def.toJSON(value);
				if(typeof json === 'object') {
					json[TYPE_TAG] = key;
				}
				return json;
			}
		}

		if(Array.isArray(value)) {
			return values.get('array').toJSON(value);
		} else if(typeof value === 'object') {
			return values.get('object').toJSON(value);
		}
		return value;
	}
});
values.register('object', {
	create: function(value) {
		if(! value) return null;

		const result = {};
		Object.keys(value).forEach(key => {
			result[key] = values.fromJSON('mixed', value[key]);
		});
		return result;
	},

	toJSON: function(value) {
		if(! value) return null;

		const result = {};
		Object.keys(value).forEach(key => {
			result[key] = values.toJSON('mixed', value[key]);
		});
		return result;
	}
});

values.register('array', {
	create: function(value) {
		if(! value) return null;

		if(! Array.isArray(value)) {
			value = [ value ];
		}

		return value.map(v => values.fromJSON('mixed', v));
	},

	toJSON: function(value) {
		if(! value) return null;

		return value.map(v => values.toJSON('mixed', v));
	}
});

values.register('buffer', {
	create: function(value) {
		if(value instanceof Buffer) {
			return value;
		}

		if(Array.isArray(value)) {
			// Assume this is an array with octets
			return Buffer.from(value);
		} else if(typeof value === 'object') {
			value = value.encoded;
		}

		if(typeof value === 'string') {
			// Assume this is Base-64 encoded string
			return Buffer.from(value, 'base64');
		} else {
			throw new Error('Can not create buffer from value');
		}
	},

	is: function(value) {
		return value instanceof Buffer;
	},

	toJSON(value) {
		return {
			encoded: value.toString('base64')
		}
	}
});

values.register('boolean', {
	create: function(value) {
		if(typeof value === 'boolean') return value;

		value = String(value).toLowerCase();
		switch(value) {
			case 'true':
			case 'yes':
			case 'on':
			case '1':
				return true;
			case 'false':
			case 'no':
			case 'off':
			case '0':
				return false;
			default:
				throw new Error('Can not translate `' + value + '` into a boolean');
		}
	},

	is: function(value) {
		return typeof value === 'boolean';
	}
});

values.register('number', {
	create: function(value) {
		if(typeof value === 'number') return value;

		return parseFloat(value);
	},

	is: function(value) {
		return typeof value === 'number';
	}
});

values.register('string', {
	create: function(value) {
		return String(value);
	},

	is: function(value) {
		return typeof value === 'string';
	}
});

values.register('percentage', {
	create: function(value) {
		if(typeof value === 'number') return value;

		value = parseFloat(value);

		return value < 0 ? 0 : (value > 100 ? 100 : value);
	},

	comparable: true
});

values.register('color', color);

const quantities = [
	'angle',
	'duration',
	'energy',
	'illuminance',
	'length',
	'mass',
	'power',
	'pressure',
	'speed',
	'temperature',
	'volume'
];

for(const quantity of quantities) {
	values.register(quantity, amounts[quantity]);
}
