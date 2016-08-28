'use strict';

const ID$ = Symbol();
const NAMESPACE$ = Symbol();
const TIMER$ = Symbol();
const ON_DESTROY$ = Symbol();
const RESOLVE$ = Symbol();
const REJECT$ = Symbol();

module.exports = class Callback {
  /**
   * 
   * @param namespace {String}
   * @param id {String}
   * @param timeout {Number}
   * @param onDestroy {Function}
   */
  constructor(namespace, id, timeout, onDestroy) {
    this[NAMESPACE$] = namespace;
    this[ID$] = id;
    this[TIMER$] = setTimeout(() => this._timeout(), timeout);
    this[ON_DESTROY$] = onDestroy;

    this.promise = new Promise((resolve, reject) => {
      this[RESOLVE$] = resolve;
      this[REJECT$] = reject;
    });
  }

  /**
   *
   * @private
   */
  _timeout() {
    const err = new Error(`callback timeout: ${this[NAMESPACE$]}::${this[ID$]}`);
    err.namespace = this[NAMESPACE$];
    err.id = this[ID$];

    this.reject(err);
  }

  /**
   *
   * @param data
   * @returns {*}
   */
  resolve(data) {
    this.destroy();
    return this[RESOLVE$](data);
  }

  /**
   *
   * @param err
   * @returns {*}
   */
  reject(err) {
    this.destroy();
    return this[REJECT$](err);
  }

  /**
   *
   */
  destroy() {
    this[TIMER$]._called || clearTimeout(this[TIMER$]);
    this[ON_DESTROY$]();
  }
}
