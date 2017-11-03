'use strict';

/**
 * Metadata for a device that provides a builder-like API for
 * easily updating the metadata.
 */
module.exports = class Metadata {
	constructor() {
		this.types = new Set();
		this.capabilities = new Set();
		this.availableAPI = new Set();
	}

	type(...types) {
		for(let type of types) {
			this.types.add(type);
		}
		return this;
	}

	capability(...caps) {
		for(let cap of caps) {
			this.capabilities.add(cap);
		}
		return this;
	}

	exposeAPI(...properties) {
		for(let p of properties) {
			this.availableAPI.add(p);
		}
		return this;
	}
};
