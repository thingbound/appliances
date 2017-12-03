'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { pressure } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'atmospheric-pressure';
	}

	static availableAPI(builder) {
		builder.event('atmosphericPressure')
			.type('pressure')
			.description('Current atmospheric pressure has changed')
			.done();

		builder.action('atmosphericPressure')
			.description('Get the current atmospheric pressure')
			.getterForState('pressure')
			.returns('pressure', 'Current atmospheric pressure')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'atmosphericPressure' ];
	}

	get atmosphericPressure() {
		return this.value('atmosphericPressure');
	}

	updateAtmosphericPressure(value) {
		this.updateValue('atmosphericPressure', pressure(value));
	}
});
