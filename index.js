'use strict';

module.exports = {
	Appliance: require('./appliance'),

	State: require('./capabilities/state'),

	Power: require('./capabilities/power'),
	SwitchablePower: require('./capabilities/switchable-power'),

	Mode: require('./capabilities/mode'),
	SwitchableMode: require('./capabilities/switchable-mode'),

	Nameable: require('./capabilities/nameable'),

	Storage: require('./storage'),
	Children: require('./children')
};
