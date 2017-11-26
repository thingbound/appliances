'use strict';

const Appliance = require('../appliance');
const { State } = require('abstract-things');
const { percentage } = require('abstract-things/values');

module.exports = Appliance.capability(Appliance => class extends Appliance.with(State) {

	static availableAPI(builder) {
		builder.state('batteryLevel')
			.type('percentage')
			.description('Current battery level of the appliance')
			.done();

		builder.event('batteryLevel')
			.type('percentage')
			.description('Battery level of the appliance has changed')
			.done();

		builder.action('batteryLevel')
			.description('Get the battery level of the appliance')
			.returns('percentage', 'Current battery level')
			.done();
	}

	static get capability() {
		return 'battery-level';
	}

	constructor(...args) {
		super(...args);

		this.updateState('batteryLevel', -1);
	}

	batteryLevel() {
		return this.getState('batteryLevel');
	}

	updateBatteryLevel(level) {
		level = percentage(level);
		if(this.updateState('batteryLevel', level)) {
			this.emitEvent('batteryLevel', level);
		}
	}
});
