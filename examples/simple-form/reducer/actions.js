import * as t from './action-types'

/**
 * Submit request initiated
 *
 * @param {Object} payload
 */
export const request = payload => ({
  type: t.SUBMIT_REQUEST,
  payload
})

/**
 * Submit success
 *
 * @param {Object} payload Data from server (token, user info, etc.)
 */
export const success = payload => ({
  type: t.SUBMIT_SUCCESS,
  payload
})

/**
 * Submit failed
 *
 * @param {String} message Error message
 * @param {Object} validation Validation errors
 */
export const failure = (message, validation) => ({
  type: t.SUBMIT_FAILURE,
  message,
  validation
})
