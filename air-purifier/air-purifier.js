const Appliance = require('../appliance');

/**
 * Air Purifier.
 */
module.exports = Appliance.type(BaseAppliance => class AirPurifier extends BaseAppliance {
	static get type() {
		return 'air-purifier';
	}
});
