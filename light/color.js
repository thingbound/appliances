
const Appliance = require('../appliance');
const Light = require('./light');
const State = require('../capabilities/state');
const { duration, color } = require('../values');

module.exports = Appliance.capability(BaseDevice => class ColoredLight extends BaseDevice.with(State) {
	/**
	 * Expose the color methods.
	 */
	static availableAPI(builder) {
		builder.state('color')
			.type('color')
			.description('The color of the light')
			.done();

		builder.action('color')
			.description('Get or set the color of this light')
			.argument('color', true, 'Optional color to set')
			.returns('color', 'The color of the light')
			.getterForState('color')
			.done();

		builder.action('setColor')
			.description('Set the color of this light')
			.argument('color', false, 'The color to set')
			.returns('color', 'The color of the light')
			.done();

		builder.event('color')
			.type('color')
			.description('The color of the light has changed')
			.done();
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
