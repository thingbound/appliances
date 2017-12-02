'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { illuminance } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'illuminance';
	}

	static availableAPI(builder) {
		builder.event('illuminance')
			.type('illuminance')
			.description('Current illuminance has changed')
			.done();

		builder.action('illuminance')
			.description('Get the current illuminance')
			.getterForState('illuminance')
			.returns('illuminance', 'Current illuminance')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'illuminance' ];
	}

	get illuminance() {
		return this.value('illuminance');
	}

	updateIlluminance(value) {
		this.updateValue('illuminance', illuminance(value));
	}
});
