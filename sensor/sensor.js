'use strict';

const Appliance = require('../appliance');

module.exports = Appliance.type(BaseAppliance => class Sensor extends BaseAppliance {
	/**
	 * Mark appliance as a `sensor`.
	 */
	static get type() {
		return 'sensor';
	}

	static availableAPI(builder) {
	}

	value(sensorType) {
		return this.getState(sensorType);
	}

	updateValue(sensorType, value) {
		if(this.updateState(sensorType, value)) {
			this.emitEvent(sensorType, value);
		}
	}
});
