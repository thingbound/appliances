'use strict';

const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { number } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'carbonDioxide';
	}

	static availableAPI(builder) {
		builder.event('carbonDioxide')
			.type('number')
			.description('Carbon dioxide level has changed')
			.done();

		builder.action('carbonDioxide')
			.description('Get the current carbon dioxide level')
			.getterForState('carbonDioxide')
			.returns('number', 'Current carbon dixoide level')
			.done();

		builder.action('co2')
			.description('Get the current carbon dioxide level')
			.getterForState('carbonDioxide')
			.returns('number', 'Current carbon dixoide level')
			.done();

		builder.action('co²')
			.description('Get the current carbon dioxide level')
			.getterForState('carbonDioxide')
			.returns('number', 'Current carbon dixoide level')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'carbonDioxide' ];
	}

	get carbonDioxide() {
		return this.value('carbonDioxide');
	}

	get co2() {
		return this.value('carbonDioxide');
	}

	get ['co²']() {
		return this.value('carbonDioxide');
	}

	updateCarbonDioxide(value) {
		this.updateValue('carbonDioxide', number(value));
	}
});
