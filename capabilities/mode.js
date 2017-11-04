'use strict';

const Appliance = require('../appliance');
const State = require('./state');

/**
 * Mode capability, for appliances that support different modes.
 */
module.exports = Appliance.capability(Appliance => class extends Appliance.with(State) {
	/**
	* Define the API of appliances that can manage their power.
	*/
	static availableAPI(builder) {
		builder.state('mode')
			.type('string')
			.description('The current mode of this appliance')
			.done();

		builder.state('modes')
			.type('array')
			.description('The available modes of this appliance')
			.done();

		builder.event('mode')
			.type('string')
			.description('The mode of the appliance has changed')
			.done();

		builder.event('modes')
			.type('array')
			.description('The availables modes of the appliance have changed')
			.done();

		builder.action('mode')
			.description('Get or set the mode of this appliance')
			.argument('string', true, 'Optional mode to change to')
			.returns('mode', 'The mode of the appliance')
			.getterForState('mode')
			.done();

		builder.action('setMode')
			.description('Set the mode of this appliance')
			.argument('string', true, 'Mode to change to')
			.returns('mode', 'The mode of the appliance')
			.done();

		builder.action('modes')
			.description('Get the available modes')
			.returns('array', 'The modes that are supported')
			.getterForState('modes')
			.done();
	}

	/**
	* Get that this provides the mode capability.
	*/
	static get capabilities() {
		return [ 'mode' ];
	}

	constructor(...args) {
		super(...args);

		this.updateState('mode', null);
		this.updateState('modes', []);
	}

	/**
	* Get or switch the mode of the appliance.
	*
	* @param {string} mode
	*   optional mode to switch to
	* @returns
	*   string indicating the mode
	*/
	mode(mode=undefined) {
		if(typeof mode !== 'undefined') {
			return this.setMode(mode);
		}

		return this.getState('mode');
	}

	/**
	* Set the mode of this appliance.
	*
	* @param {string} mode
	*/
	setMode(mode) {
		if(typeof mode === 'undefined') throw new Error('Mode must be specified');
		mode = String(mode);

		return Promise.resolve(this.changeMode(mode))
			.then(() => this.getState('mode'));
	}

	/**
	* Update the mode of the appliance. Will emit events.
	*
	* @param {string} mode
	*/
	updateMode(mode) {
		if(this.updateState('mode', mode)) {
			this.emitEvent('mode', mode);
		}
	}

	/**
	* Change the current mode of the device.
	*
	* @param {mode} mode
	*/
	changeMode(mode) {
		throw new Error('changeMode has not been implemented');
	}

	/**
	 * Get the available modes of the device.
	 */
	modes() {
		return this.getState('modes');
	}

	/**
	 * Get the available modes of the device.
	 */
	updateModes(modes) {
		if(this.updateState('modes', modes)) {
			this.emitEvent('modes', modes);
		}
	}
});
