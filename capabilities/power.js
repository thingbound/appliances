'use strict';

const Appliance = require('../appliance');
const State = require('./state');
const { boolean } = require('../values');

/**
 * Power capability, for appliances that support switching and monitoring the
 * power status of themselves.
 */
module.exports = Appliance.capability(Appliance => class extends Appliance.with(State) {
	/**
	* Define the API of appliances that can manage their power.
	*/
	static availableAPI(builder) {
		builder.state('power')
			.type('boolean')
			.description('The power state of this appliance')
			.done();

		builder.event('power')
			.type('boolean')
			.description('The power state of the appliance has changed')
			.done();

		builder.action('power')
			.description('Get or set the power state of this appliance')
			.argument('boolean', true, 'Optional power state to change to')
			.returns('boolean', 'The power state of the appliance')
			.getterForState('power')
			.done();

		builder.action('setPower')
			.description('Set the power state of this appliance')
			.argument('boolean', false, 'The power state to change to')
			.returns('boolean', 'The power state of the appliance')
			.done();

		builder.action('togglePower')
			.description('Toggle thw power of the device, turning it on if off and vice versa')
			.returns('boolean', 'The power state of the appliance')
			.done();

		builder.action('turnOn')
			.description('Turn this appliance on')
			.returns('boolean', 'The power state of the appliance')
			.done();

		builder.action('turnOff')
			.description('Turn this appliance off')
			.returns('boolean', 'The power state of the appliance')
			.done();
	}

	/**
	* Get that this provides the power capability.
	*/
	static get capabilities() {
		return [ 'power' ];
	}

	constructor(...args) {
		super(...args);

		this.updateState('power', false);
	}

	/**
	* Get or switch the power of the appliance.
	*
	* @param {boolean} power
	*   optional power level to switch to
	* @returns
	*   boolean indicating the power level
	*/
	power(power=undefined) {
		if(typeof power !== 'undefined') {
			// Call changePower and then return the new power state
			return this.setPower(power);
		}

		return this.getState('power');
	}

	/**
	* Turn this appliance on.
	*/
	turnOn() {
		return this.power(true);
	}

	/**
	* Turn this appliance off.
	*/
	turnOff() {
		return this.power(false);
	}

	/**
	 * Toggler the power of the device.
	 */
	togglePower() {
		return this.setPower(! this.getState('power'));
	}

	/**
	* Set the power of this appliance.
	*
	* @param {boolean} power
	*/
	setPower(power) {
		if(typeof power === 'undefined') throw new Error('Power must be specified');
		power = boolean(power);

		return Promise.resolve(this.changePower(power))
			.then(() => this.getState('power'));
	}

	/**
	* Update the state of power to the appliance. Implementations should call
	* this whenever the power changes, either from an external event or when
	* changePower is called.
	*
	* @param {boolean} power
	*/
	updatePower(power) {
		if(this.updateState('power', power)) {
			this.emitEvent('power', power);
		}
	}

	/**
	* Change the current power state of the appliance. This method can return
	* a Promise if the power switching is asynchronous.
	*
	* @param {boolean} power
	*/
	changePower(power) {
		throw new Error('changePower has not been implemented');
	}
});
