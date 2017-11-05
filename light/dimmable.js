'use strict';

const Appliance = require('../appliance');
const Light = require('./light');
const State = require('../capabilities/state');
const { duration, percentage } = require('../values');

module.exports = Appliance.capability(BaseAppliance => class DimmableLight extends BaseAppliance.with(State) {
	/**
	 * Expose the brightness API.
	 */
	static availableAPI(builder) {
		builder.state('brightness')
			.type('percentage')
			.description('The brightness of this light')
			.done();

		builder.action('brightness')
			.description('Get or set the brightness of this light')
			.argument('change:brightness', true, 'The change in brightness or absolute brightness')
			.returns('percentage', 'The brightness of the light')
			.getterForState('brightness')
			.done();

		builder.action('setBrightness')
			.description('Set the brightness of this light')
			.argument('percentage', false, 'The brightness to set')
			.returns('percentage', 'The brightness of the light')
			.done();

		builder.action('increaseBrightness')
			.description('Increase the brightness of this light')
			.argument('percentage', false, 'The amount to increase the brightness')
			.returns('percentage', 'The brightness of the light')
			.done();

		builder.action('decreaseBrightness')
			.description('Decrease the brightness of this light')
			.argument('percentage', false, 'The amount to decrease the brightness')
			.returns('percentage', 'The brightness of the light')
			.done();

		builder.event('brightness')
			.type('percentage')
			.description('The brightness of the light has changed')
			.done();
	}

	/**
	 * Mark the light as dimmable.
	 */
	static get capabilities() {
		return [ 'dimmable' ];
	}

	/**
	 * Get or change the brightness of this light.
	 */
	brightness(brightness, duration=Light.DURATION) {
		let currentBrightness = this.getState('brightness', 0);

		if(brightness) {
			let toSet;
			if(brightness.isIncrease) {
				toSet = currentBrightness + brightness.value;
			} else if(brightness.isDecrease) {
				toSet = currentBrightness - brightness.value;
			} else {
				toSet = brightness.value;
			}
			return this.setBrightness(toSet, duration);
		}

		return currentBrightness;
	}

	increaseBrightness(amount, duration=Light.DURATION) {
		return this.setBrightness(Math.min(100, this.state.brightness + amount), duration);
	}

	decreaseBrightness(amount, duration=Light.DURATION) {
		return this.setBrightness(Math.max(0, this.state.brightness - amount), duration);
	}

	setBrightness(brightness, duration0=Light.DURATION) {
		if(typeof brightness === 'undefined') throw new Error('Brightness must be specified');
		brightness = percentage(brightness);
		duration0 = duration(duration0);

		return Promise.resolve(this.changeBrightness(brightness, duration0))
			.then(() => this.getState('brightness', 0));
	}

	/**
	 * Update the current brightness value, such as from a call to `changeBrightness` or
	 * if the value has been changed externally.
	 *
	 * @param {*} brightness
	 */
	updateBrightness(brightness) {
		if(this.updateState('brightness', brightness)) {
			this.emitEvent('brightness', brightness);
		}
	}

	/**
	 * Change the brightness of this light. Should change the brightness of the light and
	 * call `updateBrightness` with the brightness that has actually been set.
	 *
	 * @param {number} brightness
	 * @param {Duration} duration
	 */
	changeBrightness(brightness, duration) {
		throw new Error('changeBrightness not implemented');
	}
});
