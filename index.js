'use strict';

module.exports = require('./lib/callbacks');

const Callbacks = module.exports;

const c = new Callbacks();
c.create('123', 100);
