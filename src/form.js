import Debug from 'debug'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cancelable, { getArray } from './utils'
const debug = Debug('react-forms:form')

/**
 * Form Higher Order Component for keeping form state
 *
 * @param {Component} WrappedComponent React component
 */
const form = (WrappedComponent) => {
  class Form extends Component {
    state = {
      fields: {
        /*
         username:
         - name: 'username' // Input name (same as key)
         - label: 'Username' // Input display name
         - value: 'abc', // Field`s value
         - initialValue: 'abc', // Field initial (default) value
         - pristine: false, // User has NOT interacted with the field
         - dirty: true, // User interacted with the field
         - touched: true // Field lost focus
         - untouched: false // Field did NOT lose focus
         - valid: true // Whether the value meets validation requirements
         - invalid: false // Value does NOT meet validation requirements
         - errors: ['Field is required', 'Must have at least 5 characters'] // Validation messages
         - parse: (val) => ... // Parses input (i.e. Date to string)
         - transform: (val) => ... // Transforms input (i.e. to uppercase)
         - format: (val) => ... // Formats value (i.e. date string to Date)
         - validate: [(val) => ..., (val) => ...] // Array of validating rules
         */
      },
      allFields: [],
      pristine: true,
      dirty: false,
      touched: false,
      untouched: true,
      valid: true,
      invalid: false,
      errors: []
    }

    cancel = () => {}
    submit = () => {}

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

    async componentDidUpdate (prevProps, prevState) {
      debug('Update', this.state, prevState)
      let res
      this.cancel()

      // Validate all fields
      const [hasChanged, validation] = this.validateAllFields(this.state, prevState)
      const { promise: validateAllFieldsPromise, cancel } = cancelable(validation)
      this.cancel = cancel

      // Get the validation results
      try {
        res = await validateAllFieldsPromise
      } catch (err) {
        if (err && err.isCanceled) {
          // Canceled by another update
          return
        }

        throw err
      }

      // Set State
      if (hasChanged) {
        debug('Vadation changed')
        this.setState((prevState) => {
          return {
            fields: prevState.allFields.reduce((acc, fieldName, index) => {
              const field = prevState.fields[fieldName]
              const errors = res[index]
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
          }
        })
      }
    }

    componentWillUnmount () {
      debug('Unmount')
      this.cancel()
    }

    /**
     * Validates a single field
     *
     * @param {Object} field Current value of the field
     * @param {Object} prevField Previous value of the field
     * @return {Array} Return value is composed of [hasChanged, fieldValidationPromise]
     */
    validateField = (field, prevField) => {
      debug(`Validating field ${field.name}: Start`)
      // Run validations only for fields that changed
      // Input added with a default value
      if (!prevField ||
        // If a field was touched
        (field.touched && prevField.untouched) ||
        // Field changed its value
        field.value !== prevField.value) {
        debug(`Field ${field.name} has changed`)

        const promises = field.validate.map((validator) => {
          return validator(field)
        })

        debug(`Validating field ${field.name}: Finished`)
        return [true, Promise.all(promises)]
      } else {
        debug(`Validating field ${field.name}: Finished`)
        return [false, Promise.all([])]
      }
    }

    /**
     * Validates all fields
     *
     * @param {Object} state Current state
     * @param {Object} prevState Previous state
     * @return {Array} Return value is composed of [hasChanged, validationPromise]
     */
    validateAllFields = (state, prevState) => {
      const { fields, allFields } = state
      debug(`Validating all fields: Start`)

      let hasChanged = false
      const fieldValidations = allFields.map((fieldName) => {
        const field = fields[fieldName]
        const prevField = prevState.fields[fieldName]

        const [changed, validationPromise] = this.validateField(field, prevField)
        if (changed) {
          hasChanged = true
        }

        return validationPromise
      })

      debug(`Validating all fields: Finished`)
      return [hasChanged, Promise.all(fieldValidations)]
    }

    /**
     * Handles client input
     * Sets field value and marks the field dirty
     *
     * @param {String} key Input name (key)
     * @param {*} value Input value
     */
    handleChange = (key, value) =>
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [key]: {
            ...prevState.fields[key],
            value,
            pristine: false,
            dirty: true
          }
        },
        pristine: false,
        dirty: true
      }))

    /**
     * Registers a single input
     *
     * @param {String} key Input name
     * @param {String} label Input display name
     * @param {*} value Initial value to display
     * @param {Object} options Transformations and validators
     */
    registerField = (key, label, value, options) => {
      const { parse, transform, format, validate } = options
      debug(`Registering field ${key}:${value}`)

      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [key]: {
            name: key,
            label: label || key,
            value: transform(parse(value)),
            initialValue: transform(parse(value)),
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false,
            errors: [],
            parse,
            transform,
            format,
            validate: getArray(validate)
          }
        },
        allFields: [...prevState.allFields, key]
      }))
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
     * Handles submitting a form
     * Sets all fields to touched
     */
    handleSubmit = (e) => {
      e.preventDefault()

      this.setAllTouched()
      .then(() => {
        // Submit only if all fields are valid
        if (this.state.invalid) {
          return
        }

        const { fields, allFields } = this.state

        this.submit(allFields.reduce((acc, fieldName) => {
          acc[fieldName] = fields[fieldName].value
          return acc
        }, {}), this.handleError, this.handleErrors)
      })
    }

    /**
     * Sets all inputs as touched
     */
    setAllTouched = () =>
      new Promise((resolve) => {
        this.setState(prevState => ({
          fields: prevState.allFields.reduce((acc, fieldName) => {
            acc[fieldName] = {
              ...prevState.fields[fieldName],
              touched: true,
              untouched: false
            }
            return acc
          }, {}),
          touched: true,
          untouched: false
        }), resolve)
      })

    /**
     *
     *
     * @param {Object} errors Field errors
     * @example {
       *   username: ['Required', 'Min length 8 characters'],
       *   email: ['Required', 'Not a valid email address']
       * }
     * @param {Array} global [Optional] Global form errors
     * @example ['The form is not valid']
     */
    handleErrors = (errors, global = []) => {
      console.log('NIY')
      // const valid = !Object.keys(errors).length
      // const invalid = !valid
      //
      // this.setState(prevState => ({
      //   fields: prevState.allFields.reduce((acc, fieldName) => {
      //     const err = getError(errors[fieldName] || [])
      //     const valid = !err.length
      //     const invalid = !valid
      //
      //     acc[fieldName] = {
      //       ...prevState.fields[fieldName],
      //       valid,
      //       invalid,
      //       errors: err
      //     }
      //     return acc
      //   }, {}),
      //   valid,
      //   invalid,
      //   errors: getError(global)
      // }))
    }

    handleError = () => {
      console.log('NIY')
    }

    /**
     * Handles input touch
     *
     * @param {String} key Input name
     */
    handleTouch = (key) => {
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [key]: {
            ...prevState.fields[key],
            touched: true,
            untouched: false,
            pristine: false,
            dirty: true
          }
        },
        touched: true,
        untouched: false,
        pristine: false,
        dirty: true
      }))
    }

    /**
     * Resets the field to the initial state
     */
    handleResetField = (key) =>
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [key]: {
            ...prevState.fields[key],
            value: prevState.fields[key].initialValue,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false
          }
        }
      }))

    /**
     * Resets the form to the initial state
     */
    handleResetForm = () =>
      this.setState(prevState => ({
        fields: prevState.allFields.reduce((acc, fieldName) => {
          const field = prevState.fields[fieldName]

          acc[fieldName] = {
            ...field,
            value: field.initialValue,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false
          }
          return acc
        }, {})
      }))

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
