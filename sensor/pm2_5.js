'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { number } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'pm2.5';
	}

	static availableAPI(builder) {
		builder.event('pm2.5')
			.type('number')
			.description('PM2.5 density has changed')
			.done();

		builder.action('pm2_5')
			.description('Get the current PM2.5 density')
			.getterForState('pm2.5')
			.returns('number', 'Current PM2.5 density')
			.done();

		builder.action('pm2.5')
			.description('Get the current PM2.5 density')
			.getterForState('pm2.5')
			.returns('number', 'Current PM2.5 density')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'pm2.5' ];
	}

	get pm2_5() {
		return this.value('pm2.5');
	}

	get ['pm2.5']() {
		return this.value('pm2.5');
	}

	updatePM2_5(value) {
		this.updateValue('pm2.5', number(value));
	}
});
