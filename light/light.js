const Appliance = require('../appliance');
const { duration } = require('../values');

module.exports = Appliance.type(BaseAppliance => class Light extends BaseAppliance {
	/**
	 * Mark appliance as a `light`.
	 */
	static get type() {
		return 'light';
	}
});

/**
 * Default duration for transitions of things such as brightness and color.
 */
module.exports.DURATION = duration(400);
