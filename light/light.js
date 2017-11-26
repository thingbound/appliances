'use strict';

const Appliance = require('../appliance');
const { duration } = require('abstract-things/values');

module.exports = Appliance.type(BaseAppliance => class Light extends BaseAppliance {
	/**
	 * Mark appliance as a `light`.
	 */
	static get type() {
		return 'light';
	}

	static get availableAPI() {
		return [];
	}
});

/**
 * Default duration for transitions of things such as brightness and color.
 */
module.exports.DURATION = duration(400);
