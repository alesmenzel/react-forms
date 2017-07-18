/**
 * Returns an array
 *
 * @param {String|Array} input
 * @return {Array}
 */
export const getArray = (input) => {
  if (!Array.isArray(input)) {
    return [input]
  }

  return input
}

/**
 * Returns a function returning the input
 *
 * @param {*|Function} input Error Message
 * @return {Function}
 */
export const getFunction = (input) => {
  if (typeof input !== 'function') {
    return () => input
  }

  return input
}
