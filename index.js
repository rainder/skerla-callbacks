'use strict';

const q = require('q');
const _ = require('lodash');
const debug = require('debug');
const objectId = require('objectid');

const storage = new Map();

module.exports = class Callbacks {
  constructor(namespace) {
    namespace = String(namespace);
    this.debug = debug(`skerla-callbacks:${namespace}`);

    if (!storage.has(namespace)) {
      storage.set(namespace, new Map());
    }

    this.scope = storage.get(namespace);
  }

  /**
   *
   * @param namespace
   * @returns {Callbacks}
   */
  static init(namespace) {
    return new Callbacks(namespace);
  }

  /**
   *
   * @param options
   * @returns {d.promise|*|promise}
   */
  create(options) {
    options = _.defaults({}, options || {}, {
      id: undefined,
      timeout: 30000,
      data: null,
      name: 'not-specified'
    });

    const self = this;
    const dfd = q.defer();
    const id = options.id || objectId().toString();
    const err = new Error(`Callback timeout: ${options.name}`);
    const timeoutTimer = setTimeout(timeout, options.timeout);

    this.debug('creating', id);

    if (this.scope.has(id)) {
      throw new Error(`callback ${id} is already defined`);
    }

    this.scope.set(id, {
      data: options.data,
      success, fail
    });

    dfd.promise.id = id;
    dfd.promise.clear = clear;

    return dfd.promise;

    /**
     *
     * @returns {*}
     */
    function success() {
      clear();
      return dfd.resolve.apply(dfd, arguments);
    }

    /**
     *
     * @returns {*}
     */
    function fail() {
      clear();
      return dfd.reject.apply(dfd, arguments);
    }

    /**
     *
     */
    function clear() {
      self.scope.delete(id);
      clearTimeout(timeoutTimer);
    }

    /**
     *
     */
    function timeout() {
      fail(err);
      self.debug('timeout', id);
    }
  }

  /**
   *
   * @param id
   * @param data
   * @returns {boolean}
   */
  success(id, data) {
    const value = this.scope.get(id);
    if (!value) {
      this.debug('not found', id);
      return false;
    }
    this.debug('executing', id);

    value.success(data);
    return true;
  }

  /**
   *
   * @param id
   * @param data
   * @returns {boolean}
   */
  fail(id, err) {
    const value = this.scope.get(id);
    if (!value) {
      this.debug('not found', id);
      return false;
    }
    this.debug('executing failure', id);

    value.fail(err);
    return true;
  };
};