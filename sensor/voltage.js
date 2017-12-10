'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { voltage } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'voltage';
	}

	static availableAPI(builder) {
		builder.event('voltage')
			.type('voltage')
			.description('Measured voltage changed')
			.done();

		builder.action('voltage')
			.description('Get the current measured voltage')
			.getterForState('voltage')
			.returns('voltage', 'Current measured voltage')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'voltage' ];
	}

	get voltage() {
		return this.value('voltage');
	}

	updateVoltage(value) {
		this.updateValue('voltage', voltage(value));
	}
});
