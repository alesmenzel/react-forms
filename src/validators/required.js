import { getFunction } from '../utils'

/**
 * Validates required value
 *
 * @param {String|Function} msg Message
 */
export const isRequired = msg => {
  const getMessage = getFunction(msg)

  return (field) => {
    const { value } = field

    if (value === '') {
      return getMessage(field, {})
    }
  }
}
