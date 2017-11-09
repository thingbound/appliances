'use strict';

const Appliance = require('../appliance');
const api = require('./api');
const storage = Symbol('storage');

module.exports = Appliance.type(Parent => class ApplianceWithStorage extends Parent {
	static get storage() {
		return api.global();
	}

	get storage() {
		if(! this[storage]) {
			this[storage] = api.instance(this.id);
		}

		return this[storage];
	}
});
