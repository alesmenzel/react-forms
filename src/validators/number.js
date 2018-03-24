import { getFunction } from '../utils';

/**
 * Validates minimal value of an number
 *
 * @param {String|Function} msg Message
 * @param {Number} min Minimal value
 */
export const minimum = (msg, min) => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (typeof value !== 'number' || isNaN(value) || value < min) {
      return getMessage(field, { msg, min });
    }
  };
};

/**
 * Validates maximal value of an number
 *
 * @param {String|Function} msg Message
 * @param {Number} max Maximal value
 */
export const maximum = (msg, max) => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (typeof value !== 'number' || isNaN(value) || value > max) {
      return getMessage(field, { msg, max });
    }
  };
};

/**
 * Validates maximal and minimal value of a number
 *
 * @param {String|Function} msg Message
 * @param {Number} min Minimal value
 * @param {Number} max Maximal value
 */
export const range = (msg, min, max) => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (
      typeof value !== 'number' ||
      isNaN(value) ||
      value < min ||
      value > max
    ) {
      return getMessage(field, { msg, min, max });
    }
  };
};

/**
 * Validates if the value is a finite number
 *
 * @param {String|Function} msg Message
 */
export const isNumber = msg => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (!Number.isFinite(value)) {
      return getMessage(field, { msg });
    }
  };
};

/**
 * Validates if the number is and integer
 *
 * @param {String|Function} msg Message
 */
export const isInteger = msg => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (!Number.isInteger(value)) {
      return getMessage(field, { msg });
    }
  };
};

/**
 * Validates if the number is a float
 *
 * @param {String|Function} msg Message
 */
export const isFloat = msg => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (
      typeof value !== 'number' ||
      isNaN(value) ||
      !isFinite(value) ||
      value % 1 === 0
    ) {
      return getMessage(field, { msg });
    }
  };
};
