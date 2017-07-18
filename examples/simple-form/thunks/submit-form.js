import axios from 'axios'
import _ from 'lodash'

import { request, success, failure } from '../reducer'

/**
 * Performs form submit
 *
 * @param {Object} payload Form data
 */
export const submitForm = payload =>
	(dispatch, getState) => {
  const { isSubmitting } = getState().sample

		// Do not allow multiple submissions at once
  if (isSubmitting) {
    return Promise.resolve()
  }

		// Initiate auth request
  dispatch(request(payload))
  return axios.post('/form/sample', payload)
		.then(({data}) => {
			// Dispatch success
  dispatch(success(data))
}, ({response}) => {
  const errorMessage = _.get(response, 'data.message', 'Neplatné přihlašovací údaje.')
  const validationErrors = _.get(response, 'data.validation', {})

			// Dispatch Error
  dispatch(failure(errorMessage, validationErrors))
})
}
