'use strict';

const Callback = require('./callback');
const utils = require('./utils');

const CALLBACKS$ = Symbol();

module.exports = class Callbacks {

  /**
   *
   * @param namespace {String}
   */
  constructor(namespace = 'default') {
    this.namespace = namespace;
    this[CALLBACKS$] = new Map();
  }

  /**
   *
   * @param namespace {String}
   * @returns {Callbacks}
   */
  static create(namespace) {
    return new Callbacks(namespace);
  }

  /**
   *
   * @returns {Number}
   */
  get size() {
    return this[CALLBACKS$].size;
  }

  /**
   *
   * @param id {String}
   * @param options {{timeout, error_constructor}}
   * @returns {Promise}
   */
  create(id, options = {}) {
    console.assert(!!id, 'ID must be provided');
    console.assert(typeof id === 'string', 'typeof ID must be string');
    console.assert(!this[CALLBACKS$].has(id), `ID ${id} is already defined`);

    const callback = new Callback(this.namespace, id, {
      timeout: utils.take(options, 'timeout', 30000),
      error_constructor: utils.take(options, 'error_constructor', Error),
      on_destroy: () => {
        this[CALLBACKS$].delete(id);
      }
    });

    this[CALLBACKS$].set(id, callback);

    return callback.promise;
  }

  /**
   *
   * @param id
   */
  getCallback(id) {
    return this[CALLBACKS$].get(id);
  }

  /**
   *
   * @returns {*}
   */
  getCallbacks() {
    return this[CALLBACKS$];
  }
}
