
const Appliance = require('./appliance');
const State = require('./capabilities/state');
const Power = require('./capabilities/power');
const { duration, percentage, color } = require('./values');

const Light = exports.Light = Appliance.type(BaseDevice => class Light extends BaseDevice.with(Power) {
	/**
	 * Mark devices as a `light`.
	 */
	static get type() {
		return 'light';
	}
});

Light.DURATION = duration(400);

exports.Dimmable = Appliance.capability(BaseDevice => class DimmableLight extends BaseDevice.with(State) {
	/**
	 * Expose our brightness methods.
	 */
	static get availableAPI() {
		return [
			'brightness',
			'increaseBrightness',
			'decreaseBrightness',
			'setBrightness'
		];
	}

	/**
	 * Mark the device as dimmable.
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
	 * Change the brightness of this light. Should change the brightness of the device and
	 * call `updateBrightness` with the brightness that has actually been set.
	 *
	 * @param {number} brightness
	 * @param {Duration} duration
	 */
	changeBrightness(brightness, duration) {
		throw new Error('changeBrightness not implemented');
	}
});

exports.Color = Appliance.capability(BaseDevice => class ColoredLight extends BaseDevice.with(State) {
	/**
	 * Expose our brightness methods.
	 */
	static get availableAPI() {
		return [
			'color',
			'setColor'
		];
	}

	/**
	 * Mark the device as dimmable.
	 */
	static get capabilities() {
		return [ 'color' ];
	}

	/**
	 * Get or change the brightness of this light.
	 */
	color(color, duration=Light.DURATION) {
		if(color) {
			return this.setColor(color, duration);
		}

		return this.getState('color');
	}

	setColor(color0, duration0=Light.DURATION) {
		if(typeof color0 === 'undefined') throw new Error('Color must be specified');
		color0 = color(color0);
		duration0 = duration(duration0);

		return Promise.resolve(this.changeColor(color0, duration0))
			.then(() => this.getState('color'));
	}

	updateColor(color) {
		if(this.updateState('color', color)) {
			this.emitEvent('color', color);
		}
	}

	changeColor(color, duration) {
		throw new Error('changeColor not implemented');
	}
});
