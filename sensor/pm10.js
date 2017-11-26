'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { number } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'pm10';
	}

	static availableAPI(builder) {
		builder.event('pm10')
			.type('number')
			.description('PM10 density has changed')
			.done();

		builder.action('pm10')
			.description('Get the current PM10 density')
			.getterForState('pm10')
			.returns('number', 'Current PM10 density')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'pm10' ];
	}

	get pm10() {
		return this.value('pm10');
	}

	updatePM10(value) {
		this.updateValue('pm10', number(value));
	}
});
