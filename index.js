'use strict';

module.exports = class Callbacks {

  /**
   *
   * @param namespace {String}
   */
  constructor(namespace = 'default') {
    this._namespace = namespace;
    this._callbacks = new Map();
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
   * @param id
   * @param options
   * @returns {Promise}
   */
  create(id, options = {}) {
    options.timeout = options.timeout || 30000;

    console.assert(!!id, 'ID must be provided');
    console.assert(typeof id === 'string', 'typeof ID must be string');
    console.assert(typeof options.timeout === 'number', 'typeof `options.timeout` must be number');
    console.assert(!this._callbacks.has(id), `ID ${id} is already defined`);

    /**
     * cleanup function
     */
    const destroy = () => {
      this._callbacks.delete(id);
      timer._called || clearTimeout(timer);
    };

    /**
     * timeout function
     */
    const timeout = () => {
      dfd.reject(new Error(`callback timeout: ${this._namespace}::${id}`));
    };

    const timer = setTimeout(timeout, options.timeout);
    const dfd = defer(destroy);

    this._callbacks.set(id, dfd);

    return dfd.promise;
  }

  /**
   *
   * @param id
   */
  getDefer(id) {
    return this._callbacks.get(id);
  }
};

/**
 *
 * @param destroy {Function}
 * @returns {{destroy: Function, promise: Promise, resolve: Function, reject: Function}}
 */
function defer(destroy) {
  const dfd = {
    destroy,
    promise: null,
    resolve: null,
    reject: null
  };

  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = (data) => {
      destroy();
      resolve(data);
    };

    dfd.reject = (err) => {
      destroy();
      reject(err);
    };
  });

  return dfd;
}
