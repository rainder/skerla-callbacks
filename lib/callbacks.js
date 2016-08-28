'use strict';

const Callback = require('./callback');

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
   * @param options {Number}
   * @returns {Promise}
   */
  create(id, timeout = 30000) {
    console.assert(!!id, 'ID must be provided');
    console.assert(typeof id === 'string', 'typeof ID must be string');
    console.assert(typeof timeout === 'number', 'typeof `timeout` must be number');
    console.assert(!this[CALLBACKS$].has(id), `ID ${id} is already defined`);

    const callback = new Callback(this.namespace, id, timeout, () => {
      this[CALLBACKS$].delete(id);
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
