'use strict';

const { State, RestorableState, Storage, Children, Nameable, EasyNameable } = require('abstract-things');

module.exports = {
	Appliance: require('./appliance'),

	State,
	RestorableState,

	Storage,
	Children,

	Nameable,
	EasyNameable,

	Power: require('./capabilities/power'),
	SwitchablePower: require('./capabilities/switchable-power'),

	Mode: require('./capabilities/mode'),
	SwitchableMode: require('./capabilities/switchable-mode'),

	PowerChannels: require('./capabilities/power-channels'),
	SwitchablePowerChannels: require('./capabilities/switchable-power-channels'),

	BatteryLevel: require('./capabilities/battery-level')
};
