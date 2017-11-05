'use strict';

const Appliance = require('../appliance');
const deepEqual = require('deep-equal');

/**
 * State capability for appliances. Exposes a property named `state` to clients.
 *
 * Use `updateState(key, value)` to change the state of the given key and emit
 * an event to clients that the state has changed.
 */
module.exports = Appliance.capability(Appliance => class ApplianceWithState extends Appliance {
	/**
	 * Get the API that appliances with state make available.
	 */
	static availableAPI(builder) {
		builder.event('state')
			.type('object')
			.description('The state of the appliance has changed')
			.done();

		builder.action('state')
			.description('Get the current state')
			.returns('object')
			.done();
	}

	/**
	 * Get that this provides the state capability.
	 */
	static get capability() {
		return 'state';
	}

	constructor(...args) {
		super(...args);

		this.state = {};
	}

	/**
	 * Update the state of this appliance by setting the value for a certain property.
	 *
	 * @param {string} key
	 * @param {*} value
	 */
	updateState(key, value) {
		if(deepEqual(this.state[key], value)) {
			// If the value has not changed, skip updating and emitting event
			return false;
		} else {
			// Value has changed, update and queue event emittal
			this.state[key] = value;
			this.emitEvent('state', this.state);

			return true;
		}
	}

	/**
	 * Update the state of this appliance by removing a certain property.
	 *
	 * @param {string} key
	 */
	removeState(key) {
		delete this.state[key];
	}

	/**
	 * Get the value of the given state property.
	 *
	 * @param {string} key
	 * @param {*} defaultValue
	 */
	getState(key, defaultValue=null) {
		const value = this.state[key];
		return typeof value === 'undefined' ? defaultValue : value;
	}
});
