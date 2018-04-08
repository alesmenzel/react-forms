import isemail from 'isemail';
import { getFunction } from '../utils';

/**
 * Validates email address
 *
 * @param {String|Function} msg Message
 */
export const isEmail = msg => {
  const getMessage = getFunction(msg);

  return field => {
    const { value } = field;

    if (!isemail.validate(value)) {
      return getMessage(field, { msg });
    }

    return undefined;
  };
};
