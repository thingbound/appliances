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

	BatteryLevel: require('./capabilities/battery-level')
};
