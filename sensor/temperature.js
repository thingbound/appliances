const Appliance = require('../appliance');
const Sensor = require('./sensor');
const { temperature } = require('../values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(Sensor) {
	static get capability() {
		return 'sensor:temperature';
	}

	static availableAPI(builder) {
		builder.event('temperature')
			.type('temperature')
			.description('Current temperature has changed')
			.done();

		builder.action('temperature')
			.description('Get the current temperature')
			.getterForState('temperature')
			.returns('temperature', 'Current temperature')
			.done();
	}

	get temperature() {
		return this.value('temperature');
	}

	updateTemperature(temp) {
		this.updateValue('temperature', temperature(temp));
	}
});
