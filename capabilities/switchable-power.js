'use strict';

const Appliance = require('../appliance');
const Power = require('./power');
const { boolean } = require('../values');

/**
 * Switchable capability, for appliances where the power can be switched on
 * or off.
 */
module.exports = Appliance.capability(Appliance => class extends Appliance.with(Power) {
	/**
	* Define the API of appliances that can manage their power.
	*/
	static availableAPI(builder) {
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
	* Get that this provides the switchable capability.
	*/
	static get capability() {
		return 'switchable-power';
	}

	constructor(...args) {
		super(...args);
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

		return super.power();
	}

	/**
	 * Set the power of this appliance.
	 *
	 * @param {boolean} power
	 */
	setPower(power) {
		power = boolean(power);

		return Promise.resolve(this.changePower(power))
			.then(() => this.power());
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
