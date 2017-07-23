import Debug from 'debug'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cancelable from './utils'

const debug = Debug('react-forms:form')

/**
 * Adds a field
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const addField = (state, action) => {
  const { byId, allIds } = state.fields
  const { key, label, value, parse, transform, format, validate } = action

  return {
    ...state,
    fields: {
      allIds: [...allIds, key],
      byId: {
        ...byId,
        [key]: {
          value: transform(parse(value)),
          initialValue: transform(parse(value)),
          meta: {
            key: key,
            label: label,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false
          },
          functions: {
            parse,
            transform,
            format,
            validate
          },
          errors: []
        }
      }
    }
  }
}

/**
 * Changes a field´s value
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const changeFieldValue = (state, action) => {
  const { fields } = state
  const { byId } = fields
  const field = byId[action.key]

  return {
    ...state,
    fields: {
      ...fields,
      byId: {
        ...byId,
        [action.key]: {
          ...field,
          value: action.value,
          meta: {
            ...field.meta,
            pristine: false,
            dirty: true,
            touched: true,
            untouched: false
          }
        }
      }
    }
  }
}

/**
 * Marks a field as touched
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const touchField = (state, action) => {
  const { fields } = state
  const { byId } = fields
  const field = byId[action.key]

  return {
    ...state,
    fields: {
      ...fields,
      byId: {
        ...byId,
        [action.key]: {
          ...field,
          meta: {
            ...field.meta,
            pristine: false,
            dirty: true,
            touched: true,
            untouched: false
          }
        }
      }
    }
  }
}

/**
 * Sets all inputs as touched
 *
 * @param {Object} state Current state
 */
const touchAllFields = (state) => {
  const { fields } = state
  const { byId, allIds } = fields

  return {
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id]

        acc[id] = {
          ...field,
          meta: {
            ...field.meta,
            pristine: false,
            dirty: true,
            touched: true,
            untouched: false
          }
        }
        return acc
      }, {})
    }
  }
}

/**
 * Sets form errors
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const setErrors = (state, action) => {
  const { fields } = state
  const { byId, allIds } = fields
  const { errors } = action

  return {
    ...state,
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id]

        acc[id] = {
          ...field,
          meta: {
            ...field.meta,
            valid: !errors[id].length,
            invalid: !!errors[id].length
          },
          errors: errors[id]
        }
        return acc
      }, {})
    }
  }
}

/**
 * Appends error to a field
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const addError = (state, action) => {
  const { fields } = state
  const { byId } = fields
  const { key, error } = action
  const field = byId[key]

  return {
    ...state,
    fields: {
      ...fields,
      byId: {
        ...byId,
        [key]: {
          ...field,
          meta: {
            ...field.meta,
            valid: false,
            invalid: true
          },
          errors: [...field.errors, error]
        }
      }
    }
  }
}

/**
 * Resets a given field to its initial value and marks it as pristine/untouched/valid
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const resetField = (state, action) => {
  const { fields } = state
  const { byId } = fields
  const { key } = action
  const field = byId[key]

  return {
    fields: {
      ...fields,
      byId: {
        ...byId,
        [key]: {
          ...field,
          value: field.initialValue,
          meta: {
            ...field.meta,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false
          }
        },
        errors: []
      }
    }
  }
}

/**
 * Resets all fields to its initial values and marks them as pristine/untouched/valid
 *
 * @param {Object} state Current state
 */
const resetAllFields = (state) => {
  const { fields } = state
  const { byId, allIds } = fields

  return {
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id]

        acc[id] = {
          ...field,
          value: field.initialValue,
          meta: {
            ...field.meta,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false
          },
          errors: []
        }
        return acc
      }, {})
    }
  }
}

const initialState = {
  fields: {
    byId: {},
    allIds: []
  }
}

const reducer = (state = initialState, action) => {
  debug(action.type, ', ACTION: ', action, ', STATE: ', state)

  switch (action.type) {
    case 'REGISTER_FIELD':
      return addField(state, action)
    case 'CHANGE_FIELD_VALUE':
      return changeFieldValue(state, action)
    case 'TOUCH_FIELD':
      return touchField(state, action)
    case 'TOUCH_ALL_FIELDS':
      return touchAllFields(state)
    case 'RESET_FIELD':
      return resetField(state, action)
    case 'RESET_ALL_FIELDS':
      return resetAllFields(state)
    case 'SET_ERRORS':
      return setErrors(state, action)
    case 'ADD_ERROR':
      return addError(state, action)
    default:
      return state
  }
}

/**
 * Form Higher Order Component for keeping form state
 *
 * @param {Component} WrappedComponent React component
 */
const form = (WrappedComponent) => {
  class Form extends Component {
    state = reducer(undefined, { type: 'INITIALIZATION' })

    cancelFunctions = []
    submit = () => {}
    updateId = 0

    dispatch (action) {
      this.setState(prevState => reducer(prevState, action))
    }

    componentWillUnmount () {
      this._cancelValidations()
    }

    /**
     * Registers a single input
     *
     * @param {String} key Input name
     * @param {String} label Input display name
     * @param {*} value Initial value to display
     * @param {Object} functions Transformations and validators
     */
    registerField = (key, label, value, functions) => {
      this.dispatch({ type: 'REGISTER_FIELD', key, label, value, ...functions })
      this._validate()
    }

    /**
     * Registers the submit function
     *
     * @param {Function} onSubmit Submit function
     */
    registerSubmit = (onSubmit) => {
      this.submit = onSubmit
    }

    /**
     * Handles client input
     *
     * @param {String} key Input name
     * @param {*} value New input value
     */
    handleChange = (key, value) => {
      this.dispatch({ type: 'CHANGE_FIELD_VALUE', key, value })
      this._validate()
    }

    /**
     * Marks a field as touched
     *
     * @param {String} key Input name
     */
    handleTouch = (key) => {
      // Short circuit if the field is already touched
      if (this.state.fields.byId[key].meta.touched) {
        return
      }

      this.dispatch({ type: 'TOUCH_FIELD', key })
      this._validate()
    }

    /**
     * Marks all fields as touched
     */
    handleTouchAll = () => {
      this.dispatch({ type: 'TOUCH_ALL_FIELDS' })
    }

    /**
     * Adds a field error to the end of the array
     *
     * @param {String} key Input name
     * @param {String} error Error message
     */
    _addError = (key, error) => {
      this.dispatch({ type: 'ADD_ERROR', key, error })
    }

    /**
     * Cancels all asynchronous validation and clears cancel functions
     */
    _cancelValidations = () => {
      this.cancelFunctions.forEach((cancel) => {
        cancel()
      })
      this.cancelFunctions = []
    }

    /**
     * Validates the field values
     */
    _validate = () => {
      // keep update id to be able to cancel multiple validation calls
      const updateId = this.updateId < 1000 ? this.updateId + 1 : 0
      this.updateId = updateId

      // wait for react to update state
      setImmediate(() => {
        // Short circuit if the validate function is called again
        if (updateId !== this.updateId) {
          debug('Validation skipped')
          return
        }

        debug('Validation')

        const { fields } = this.state
        const { byId, allIds } = fields

        // cancel all running asynchronous validations
        this._cancelValidations()

        // errors contains all the synchronous errors
        const errors = allIds.reduce((acc, id) => {
          const field = byId[id]

          acc[id] = field.functions.validate.reduce((acc, validator) => {
            const res = validator(field, fields)

            // Check whether the result value is a Promise (or Promise like)
            if (res instanceof Promise || (typeof res === 'object' && typeof res.then === 'function')) {
              // asynchronous errors are dispatched separately when they finish
              const { promise, cancel } = cancelable(res)

              this.cancelFunctions.push(cancel)

              promise.then((error) => {
                this._addError(id, error)
              })
              .catch((err) => {
                if (err.isCanceled) {
                  return
                }

                throw err
              })
            } else {
              if (res !== undefined) {
                acc.push(res)
              }
            }

            return acc
          }, [])

          return acc
        }, {})

        this.dispatch({ type: 'SET_ERRORS', errors })
      })
    }

    /**
     * Resets the field to the initial state
     *
     * @param {String} key Field identifier
     */
    handleResetField = (key) => {
      this.dispatch({ type: 'RESET_FIELD', key })
    }

    /**
     * Resets the form to the initial state
     */
    handleResetForm = () => {
      this.dispatch({ type: 'RESET_ALL_FIELDS' })
    }

    /**
     * Handles submitting a form
     * Sets all fields to touched
     *
     * @param {Object} e Event
     */
    handleSubmit = async (e) => {
      e.preventDefault()

      this.handleTouchAll()
      this._validate()

      // Submit only if all fields are valid
      if (this.state.invalid) {
        return
      }

      const { fields, allFields } = this.state

      const fieldValues = allFields.reduce((acc, fieldName) => {
        acc[fieldName] = fields[fieldName].value
        return acc
      }, {})

      try {
        await this.submit(fieldValues, this.getState)
      } catch (err) {
        if (err instanceof Error) {
          throw err
        }

        this.setState((prevState) => {
          return {
            fields: prevState.allFields.reduce((acc, fieldName) => {
              const field = prevState.fields[fieldName]
              const errors = (err && err.fields && err.fields[fieldName]) || prevState.fields[fieldName].errors
              const valid = !errors.length
              const invalid = !valid

              acc[fieldName] = {
                ...field,
                errors,
                valid,
                invalid
              }
              return acc
            }, {})
            // TODO form errors, valid, invalid
          }
        })
      }
    }

    /**
     * Context interface
     */
    getChildContext () {
      return {
        _form: {
          // State
          ...this.state,
          // Handlers
          handleChange: this.handleChange,
          handleResetField: this.handleResetField,
          handleResetForm: this.handleResetForm,
          handleTouch: this.handleTouch,
          handleSubmit: this.handleSubmit,
          // Registrars
          registerField: this.registerField,
          registerSubmit: this.registerSubmit
        }
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  Form.childContextTypes = {
    _form: PropTypes.object
  }

  return Form
}

export default form
