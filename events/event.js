'use strict';

module.exports = class Event {
	constructor(source, data) {
		this.source = source;
		this.value = data;
	}
};
