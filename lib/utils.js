'use strict';

module.exports = {
  take
};

/**
 *
 * @param object
 * @param key
 * @param defaults
 * @returns {*}
 */
function take(object, key, defaults) {
  return Object.prototype.hasOwnProperty.call(object, key) ? object[key] : defaults;
}
