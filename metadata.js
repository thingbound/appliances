'use strict';

/**
 * Metadata for a appliance that provides a builder-like API for
 * easily updating the metadata.
 */
module.exports = class Metadata {
	constructor() {
		this.types = new Set();
		this.capabilities = new Set();
	}

	addTypes(...types) {
		for(let type of types) {
			this.types.add(type);
		}
		return this;
	}

	addCapabilities(...caps) {
		for(let cap of caps) {
			this.capabilities.add(cap);
		}
		return this;
	}

	/**
	 * Get if the appliance is of the given type.
	 *
	 * @param {string} type
	 */
	hasType(type) {
		return this.types.has(type);
	}

	/**
	 * Get if the appliance has the given capability.
	 *
	 * @param {string} cap
	 */
	hasCapability(cap) {
		return this.capabilities.has(cap);
	}
};
