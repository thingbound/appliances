'use strict';

const { Class, Mixin, toExtendable, mix } = require('foibles');
const { EventEmitter } = require('./events');
const DefinitionBuilder = require('./utils/define-api');
const debug = require('debug');

const Metadata = require('./metadata');
const merge = require('./utils/merge');

/**
 * Go through the prototype chain of a class looking for a static
 * function/property with the given name.
 */
function traversePrototype(root, name, func) {
	let prototype = root.constructor;
	while(prototype != Appliance) {
		if(prototype.hasOwnProperty(name)) {
			// If this property belongs to this prototype get the value
			const value = prototype[name];
			if(typeof value !== 'undefined') {
				func(value);
			}
		}

		prototype = Object.getPrototypeOf(prototype);
	}
}

const debugProperty = Symbol('debug');

const eventQueue = Symbol('eventQueue');
const eventEmitter = Symbol('eventEmitter');

const Appliance = module.exports = toExtendable(class Appliance {
	constructor() {
		this.metadata = new Metadata();

		this[eventQueue] = [];
		this[eventEmitter] = new EventEmitter({
			context: this
		});

		traversePrototype(this, 'types', types => this.metadata.addTypes(...types));
		traversePrototype(this, 'type', type => this.metadata.addTypes(type));
		traversePrototype(this, 'capabilities', caps => this.metadata.addCapabilities(...caps));

		// Get our available API
		const builder = new DefinitionBuilder();
		traversePrototype(this, 'availableAPI', func => func(builder));
		Object.assign(this.metadata, builder.done());
	}

	/**
	 * Emit an event with the given name and data.
	 *
	 * @param {string} event
	 * @param {*} data
	 */
	emitEvent(event, data) {
		const queue = this[eventQueue];
		const shouldQueueEmit = queue.length === 0;

		// Check if there is already an even scheduled
		const idx = queue.findIndex(e => e[0] === event);
		if(idx >= 0) {
			// Remove the event - only a single event can is emitted per tick
			queue.splice(idx, 1);
		}

		// Add the event to the queue
		queue.push([ event, data ]);

		if(shouldQueueEmit) {
			// Schedule emittal of the events
			setImmediate(() => {
				const emitter = this[eventEmitter];
				for(const e of queue) {
					emitter.emit(e[0], e[1]);
				}

				this[eventQueue] = [];
			});
		}
	}

	on(event, listener) {
		return this[eventEmitter].on(event, listener);
	}

	off(event, listener) {
		return this[eventEmitter].off(event, listener);
	}

	onAny(listener) {
		return this[eventEmitter].onAny(listener);
	}

	offAny(listener) {
		return this[eventEmitter].offAny(listener);
	}

	debug() {
		if(! this[debugProperty]) {
			this[debugProperty] = debug('appliance:' + this.id);
		}

		this[debugProperty].apply(this[debugProperty], arguments);
	}

	/**
	 * Create a new type that can be mixed in with a Device.
	 *
	 * @param {function} func
	 */
	static type(func) {
		return Class(Appliance, func);
	}

	/**
	 * Create a new capability that can be mixed in with a Device.
	 *
	 * @param {function} func
	 */
	static capability(func) {
		return Mixin(func);
	}

	static mixin(obj, ...mixins) {
		const direct = Object.getPrototypeOf(obj);
		const parent = Object.getPrototypeOf(direct);

		const proto = {};
		for(let name of Object.getOwnPropertyNames(direct)) {
			proto[name] = direct[name];
		}
		const base = mix(parent.constructor, ...mixins);
		Object.setPrototypeOf(proto, base.prototype);

		Object.setPrototypeOf(obj, proto);

		const data = new base();
		merge(obj, data);
	}

	extendWith(...mixins) {
		Appliance.mixin(this, ...mixins);
	}
});
