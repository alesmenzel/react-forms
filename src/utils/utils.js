import Debug from 'debug';

const debug = Debug('react-forms:debug');

/**
 * Returns an array
 *
 * @param {String|Array} input
 * @return {Array}
 */
export const getArray = input => {
  if (!Array.isArray(input)) {
    return [input];
  }

  return input;
};

/**
 * Returns a function returning the input
 *
 * @param {*|Function} input Error Message
 * @return {Function}
 */
export const getFunction = input => {
  if (typeof input !== 'function') {
    return () => input;
  }

  return input;
};

/**
 * Check whether object is a promise like object
 *
 * @param {*} obj Variable to test
 * @returns boolean True if is promise like, otherwise false
 */
export const isPromiseLike = obj =>
  obj instanceof Promise ||
  (typeof obj === 'object' && typeof obj.then === 'function');

/**
 * Logs the action
 *
 * @param {Object} action Action
 */
export const log = (state, action) => {
  if (debug.enabled) {
    /* eslint-disable no-console */
    console.group(action.type);
    console.log('STATE', state);
    console.log('ACTION', action);
    console.groupEnd(action.type);
    /* eslint-enable no-console */
  }
};
