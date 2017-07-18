import { getFunction } from '../utils'

/**
 * Validates minimum length of a value
 *
 * @param {String|Function} msg Message
 * @param {Number} min Min length
 */
export const minimumLength = (msg, min) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value.length < min) {
      return getMessage(field, { msg, min })
    }
  }
}

/**
 * Validates maximum length of a value
 *
 * @param {String|Function} msg Message
 * @param {Number} max Max length
 */
export const maximumLength = (msg, max) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value.length > max) {
      return getMessage(field, { msg, max })
    }
  }
}

/**
 * Validates maximum and minimum length of a value
 *
 * @param {String|Function} msg Message
 * @param {Number} min Min length
 * @param {Number} max Max length
 */
export const length = (msg, min, max) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value.length < min || value.length > max) {
      return getMessage(field, { msg, min, max })
    }
  }
}

/**
 * Validates if given values are equal
 *
 * @param {String|Function} msg Message
 * @param {String} comparison Value to compare
 */
export const isEqual = (msg, comparison) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value !== comparison) {
      return getMessage(field, { msg, comparison })
    }
  }
}

/**
 * Validates if given values are NOT equal
 *
 * @param {String|Function} msg Message
 * @param {String} comparison Value to compare
 */
export const isNotEqual = (msg, comparison) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value === comparison) {
      return getMessage(field, { msg, comparison })
    }
  }
}

/**
 * Validates if value is in array of values
 *
 * @param {String|Function} msg Message
 * @param {Array} comparisons Values to compare
 */
export const isIn = (msg, comparisons) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (!comparisons.includes(value)) {
      return getMessage(field, { msg, comparisons })
    }
  }
}

/**
 * Validates if value is in array of values
 *
 * @param {String|Function} msg Message
 * @param {Array} comparisons Values to compare
 */
export const isNotIn = (msg, comparisons) => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (comparisons.includes(value)) {
      return getMessage(field, { msg, comparisons })
    }
  }
}

/**
 * Validates if value matches a pattern
 *
 * @param {String|Function} msg Message
 * @param {RegExp} pattern RegExp pattern (i.e. /[a-z]{9}/i)
 * @param {String} [flags] RegExp flags (i.e. 'i'), flags can be specified in the pattern
 */
export const pattern = (msg, pattern, flags) => {
  const getMessage = getFunction(msg)
  const regex = new RegExp(pattern, flags)

  return (field) => {
    const { value } = field

    if (!value.match(regex)) {
      return getMessage(field, { msg, pattern, flags })
    }
  }
}
