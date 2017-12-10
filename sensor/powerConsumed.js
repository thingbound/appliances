'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { energy } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'power-consumed';
	}

	static availableAPI(builder) {
		builder.event('powerConsumed')
			.type('energy')
			.description('The amount of power consumed')
			.done();

		builder.action('powerConsumed')
			.description('Get the amount of power consumed')
			.getterForState('powerConsumed')
			.returns('energy', 'Amount of power consumed')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'powerConsumed' ];
	}

	get powerConsumed() {
		return this.value('powerConsumed');
	}

	updatePowerConsumed(value) {
		this.updateValue('powerConsumed', energy(value));
	}
});
