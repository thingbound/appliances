const Appliance = require('../appliance');
const { duration } = require('../values');

module.exports = Appliance.type(BaseDevice => class Light extends BaseDevice {
	/**
	 * Mark devices as a `light`.
	 */
	static get type() {
		return 'light';
	}
});

module.exports.DURATION = duration(400);
