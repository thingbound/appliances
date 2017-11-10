'use strict';

const Appliance = require('./appliance');
const childrenSymbol = Symbol('children');

/**
 * Mixin that add support for child appliances. Child appliances are used
 * primarily for appliances that bridge other networks, such as Zigbee, Z-wave
 * and Bluetooth networks.
 */
module.exports = Appliance.capability(Parent => class ApplianceWithChildren extends Parent {

	constructor(...args) {
		super(...args);

		this[childrenSymbol] = new Map();
	}

	/**
	 * Add a child to this appliance. The child should be an instance of
	 * `Appliance` with a valid identifier.
	 *
	 * This will emit the event `appliance:available` if this is a new
	 * child.
	 *
	 * @param {Appliance} appliance
	 */
	addChild(appliance) {
		if(typeof appliance !== 'object') throw new Error('Appliance needs to be specified');

		if(! appliance.id) {
			throw new Error('Child needs to have an `id`');
		}

		const children = this[childrenSymbol];
		const child = children.get(appliance.id);
		if(child) {
			// Child is already present, might be that it is being replaced
			if(child !== appliance) {
				// This is not the same instance, emit events
				children.set(appliance.id, appliance);
				this.emitEvent('appliance:unavailable', child, { multiple: true });
				this.emitEvent('appliance:available', appliance, { multiple: true });
			}
		} else {
			children.set(appliance.id, appliance);
			this.emitEvent('appliance:available', appliance, { multiple: true });
		}
	}

	/**
	 * Remove a child. Can be used both with an instance of `Appliance` and
	 * with an identifier.
	 *
	 * Will emit `appliance:unavailable` if a child is removed.
	 *
	 * @param {Appliance|string} applianceOrId
	 */
	removeChild(applianceOrId) {
		if(typeof applianceOrId === 'undefined') throw new Error('Appliance or identifier needs to be specified');
		const id = typeof applianceOrId === 'string' ? applianceOrId : applianceOrId.id;

		const children = this[childrenSymbol];
		const child = children.get(id);

		if(child) {
			children.delete(id);
			this.emitEvent('appliance:unavailable', child, { multiple: true });
		}
	}

	/**
	 * Get if the given child is registered.
	 *
	 * @param {Appliance|string} applianceOrId
	 */
	hasChild(applianceOrId) {
		if(typeof applianceOrId === 'undefined') throw new Error('Appliance or identifier needs to be specified');
		const id = typeof applianceOrId === 'string' ? applianceOrId : applianceOrId.id;

		return this[childrenSymbol].has(id);
	}

	/**
	 * Get all of the children that are registered.
	 */
	get children() {
		return this[childrenSymbol].values();
	}

	/**
	 * Synchronize the children based on the given definitions. This will remove
	 * any child that is not in the list of definitions and create new ones
	 * for new definitions.
	 *
	 * @param {Iterable} defs
	 * @param {Function} func
	 */
	syncChildren(defs, func) {
		if(! defs || ! defs[Symbol.iterator]) throw new Error('Definitions that are iterable are needed to synchronize');
		if(typeof func !== 'function') throw new Error('A function that can create appliances from a definition is required');

		const children = this[childrenSymbol];
		const allIds = new Set();
		for(const def of defs) {
			if(! def.id) {
				throw new Error('`id` is needed on definitions');
			}

			allIds.add(def.id);

			if(! children.has(def.id)) {
				// This child does not exist, create and register it
				const child = func(null, def);
				if(child) {
					if(child.id != def.id) {
						throw new Error('Appliance created has id ' + child.id + ' which differs from defintion id of ' + def.id);
					}
					this.addChild(child);
				}
			} else {
				const child = func(children.get(def.id), def);
				if(! child) {
					this.removeChild(child.id);
				}
			}
		}

		// Remove all the ids that are no longer present
		for(const id of this[childrenSymbol].keys()) {
			if(! allIds.has(id)) {
				this.removeChild(id);
			}
		}
	}
});
