'use strict';

const Appliance = require('../appliance');
const { RestorableState } = require('abstract-things');

module.exports = Appliance.capability(BaseAppliance => class extends BaseAppliance.with(RestorableState) {
	/**
	 * Set the state of this light. The default implementation simply
	 * delegates to `change`-methods in capabilities.
	 *
	 * For light implementations that support changing several properties
	 * at once it is recommended to override this method to do manual state
	 * switching.
	 *
	 * @param {object} state
	 */
	setLightState(state) {
		return Promise.resolve();
	}

	mapLightState(state) {
	}

	/**
	 * Restore the state of this light. Hooks into those lights that support
	 * action and delegates restore to `restoreLightState`.
	 *
	 * @param {object} state
	 */
	changeState(state) {
		return Promise.resolve(super.changeState(state))
			.then(() => {
				const stateCopy = Object.assign({}, state);
				this.mapLightState(stateCopy);
				return this.setLightState(stateCopy)
			});
	}
});
