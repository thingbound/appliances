'use strict';

const { Class, Mixin, toExtendable, mix } = require('foibles');
const { EventEmitter, Event } = require('./events');
const DefinitionBuilder = require('./utils/define-api');
const debug = require('debug');

const Metadata = require('./metadata');
const merge = require('./utils/merge');

/**
 * Go through the prototype chain of a class looking for information that
 * is used to create metadata about an instance.
 */
function collectMetadata(instance) {
	const metadata = new Metadata(instance);
	const builder = new DefinitionBuilder();

	let prototype = instance.constructor;
	while(prototype != Appliance) {
		// static get types() { return [ 'typeA', 'typeB ] }
		const types = prototype.types;
		if(typeof types !== 'undefined') {
			if(! Array.isArray(types)) {
				metadata.addTypes(types);
			} else {
				metadata.addTypes(...types);
			}
		}

		// static get type() { return 'type' }
		const type = prototype.type;
		if(typeof type === 'string') {
			metadata.addTypes(type);
		}

		// static get capabilities() { return [ 'capA', 'capB ] }
		const capabilities = prototype.capabilities;
		if(typeof capabilities !== 'undefined') {
			if(! Array.isArray(capabilities)) {
				metadata.addCapabilities(capabilities);
			} else {
				metadata.addCapabilities(...capabilities);
			}
		}

		// static get capability() { return 'cap' }
		const capability = prototype.capability;
		if(typeof capability === 'string') {
			metadata.addCapabilities(capability);
		}

		const api = prototype.availableAPI;
		if(typeof api === 'function') {
			prototype.availableAPI(builder);
		} else if(Array.isArray(api)) {
			// If an array treat each entry as a name
			for(const action of api) {
				builder.action(action).done();
			}
		} else if(typeof api === 'undefined') {
			// No API defined, automatically define actions
			for(const action of Object.getOwnPropertyNames(prototype)) {
				if(typeof action === 'string' && action[0] != '_') {
					builder.action(action).done();
				}
			}
		}

		prototype = Object.getPrototypeOf(prototype);
	}

	Object.assign(metadata, builder.done());
	return metadata;
}

const debugProperty = Symbol('debug');

const eventQueue = Symbol('eventQueue');
const eventEmitter = Symbol('eventEmitter');

const Appliance = module.exports = toExtendable(class Appliance {
	constructor() {
		this.metadata = collectMetadata(this);

		this[eventQueue] = [];
		this[eventEmitter] = new EventEmitter({
			context: this
		});
	}

	init() {
		return Promise.resolve();
	}

	/**
	 * Emit an event with the given name and data.
	 *
	 * @param {string} event
	 * @param {*} data
	 */
	emitEvent(event, data, options) {
		const queue = this[eventQueue];

		// Metadata may emit events before the queue is availabe, skip them
		if(! queue) return;

		const shouldQueueEmit = queue.length === 0;

		if(! options || ! options.multiple) {
			// Check if there is already an even scheduled
			const idx = queue.findIndex(e => e[0] === event);
			if(idx >= 0) {
				// Remove the event - only a single event can is emitted per tick
				queue.splice(idx, 1);
			}
		}

		// Add the event to the queue
		queue.push([ event, data ]);

		if(shouldQueueEmit) {
			// Schedule emittal of the events
			setImmediate(() => {
				const emitter = this[eventEmitter];
				for(const e of queue) {
					emitter.emit(e[0], new Event(this, e[1]));
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
	 * Check if this appliance matches all of the given tags.
	 */
	matches(...tags) {
		return this.metadata.matches(...tags);
	}

	/**
	 * Destroy this appliance, freeing any resources that it is using.
	 */
	destroy() {
		return Promise.resolve();
	}

	/**
	 * Create a new type that can be mixed in with Appliance.
	 *
	 * @param {function} func
	 */
	static type(func) {
		return Class(Appliance, func);
	}

	/**
	 * Create a new capability that can be mixed in with a Appliance.
	 *
	 * @param {function} func
	 */
	static capability(func) {
		return Mixin(func);
	}

	/**
	 * Mixin the given mixins to the specified object.
	 *
	 * @param {*} obj
	 * @param {array} mixins
	 */
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

	/**
	 * Extend this appliance with the given mixin. Used to dynamically apply
	 * capabilities during instance construction.
	 *
	 * @param {array} mixins
	 */
	extendWith(...mixins) {
		Appliance.mixin(this, ...mixins);
	}
});
