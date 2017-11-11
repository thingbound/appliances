'use strict';

const Appliance = require('../appliance');
const State = require('./state');

/**
 * Capability for appliances that can be renamed.
 */
module.exports = Appliance.capability(Appliance => class ApplianceWithName extends Appliance.with(State) {
	/**
	* Define the API of appliances that can manage their power.
	*/
	static availableAPI(builder) {
		builder.action('setName')
			.description('Set the name of this appliance')
			.argument('string', 'The name of the appliance')
			.done();
	}

	/**
	* Get that this provides the mode capability.
	*/
	static get capability() {
		return 'nameable';
	}

	constructor(...args) {
		super(...args);
	}

	setName(name) {
		try {
			return Promise.resolve(this.changeName(name))
				.then(() => this.metadata.name);
		} catch(ex) {
			return Promise.reject(ex);
		}
	}

	changeName(name) {
		throw new Error('changeName has not been implemented');
	}
});
