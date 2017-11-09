'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

const AppDirectory = require('appdirectory');
const Storage = require('dwaal');

let storage;

function resolveStorage() {
	if(storage) return storage;

	const dirs = new AppDirectory('appliances');
	const p = path.join(dirs.userData(), 'storage');
	mkdirp.sync(p);

	storage = new Storage({
		path: p
	});
	return storage;
}

class SubStorage {
	constructor(storage, sub) {
		this._storage = storage;
		this._path = sub;
	}

	get(key) {
		return this._storage.get(this._path + '/' + key);
	}

	set(key, value) {
		return this._storage.set(this._path + '/' + key, value);
	}

	inspect() {
		return 'Storage[' + this._path + ']';
	}

	toString() {
		return this.inspect();
	}
}

module.exports.global = function() {
	return new SubStorage(resolveStorage(), 'global');
}

module.exports.instance = function(id) {
	return new SubStorage(resolveStorage(), 'instance/' + id);
};
