'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { power } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'power-load';
	}

	static availableAPI(builder) {
		builder.event('powerLoad')
			.type('power')
			.description('The power load has changed')
			.done();

		builder.action('powerLoad')
			.description('Get the current power load')
			.getterForState('powerLoad')
			.returns('power', 'Current power load')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'powerLoad' ];
	}

	get powerLoad() {
		return this.value('powerLoad');
	}

	updatePowerLoad(value) {
		this.updateValue('powerLoad', power(value));
	}
});
