'use strict';

const Appliance = require('../appliance');
const SwitchablePower = require('../capabilities/switchable-power');
const LightState = require('./light-state');
const { boolean } = require('abstract-things/values');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(SwitchablePower, LightState) {

	changePowerState(state) {
		// Do nothing, setLightState handles power changes instead
	}

	setLightState(state) {
		return super.setLightState(state)
			.then(() => {
				if(typeof state.power !== 'undefined') {
					return this.changePower(state.power);
				}
			});
	}

	mapLightState(state) {
		super.mapLightState(state);

		if(typeof state.power !== 'undefined') {
			state.power = boolean(state.power);
		}
	}
});
