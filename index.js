'use strict';

module.exports = {
	Appliance: require('./appliance'),

	State: require('./capabilities/state'),

	Power: require('./capabilities/power'),
	Mode: require('./capabilities/mode'),

	Storage: require('./storage'),
	Children: require('./children')
};
