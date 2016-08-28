'use strict';

const ID$ = Symbol();
const TIMER$ = Symbol();
const ON_DESTROY$ = Symbol();
const RESOLVE$ = Symbol();
const REJECT$ = Symbol();

module.exports = class Callback {
  /**
   * 
   * @param namespace
   * @param id
   * @param timeout
   * @param onDestroy
   */
  constructor(id, timeout, onDestroy) {
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
    this.reject(new Error(`callback timeout: ${this[ID$]}`));
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
