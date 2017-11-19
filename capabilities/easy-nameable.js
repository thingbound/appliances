'use strict';

const Appliance = require('../appliance');
const Nameable = require('./nameable');
const Storage = require('../storage');

/**
 * Capability for appliances that store their own name in the storage.
 */
module.exports = Appliance.capability(Appliance => class extends Appliance.with(Nameable, Storage) {
	constructor(...args) {
		super(...args);
	}

	init() {
		return super.init()
			.then(() => this.storage.get('name'))
			.then(name => this.metadata.name = name);
	}

	changeName(name) {
		return this.storage.set('name', name);
	}
});
