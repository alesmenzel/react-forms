import React, { Component } from 'react'
import PropTypes from 'prop-types'
import focus from '../focus'

/**
 * Field Component
 */
class Field extends Component {
  componentWillMount () {
    const {name, label, value, parse, transform, format, validate} = this.props
    const {_form: {registerField}} = this.context

    // Register the field to form
    registerField(name, label, value, {parse, transform, format, validate})
  }

  render () {
    const {component, children, name, value, parse, transform, format, validate, _focus, ...rest} = this.props
    const {_form: {fields, handleChange, handleTouch, handleResetField}} = this.context
    const {focused, onFocus: handleFocus, onBlur: handleBlur} = _focus
    const field = fields[name]

    // Do not render fields that are not in state yet (= have no value)
    if (!field) {
      return null
    }

    const onChange = val => {
      handleChange(name, transform(val, fields))
    }

    const onFocus = () => {
      handleFocus()
    }

    const onBlur = () => {
      handleBlur()
      handleTouch(name)
    }

    const onReset = () => handleResetField(name)

    const passProps = {
      // User defined props
      ...rest,
      // Field handlers
      onChange,
      focused,
      onFocus,
      onBlur,
      onReset,
      // Field values
      name: field.name,
      label: field.label,
      initialValue: field.format(field.initialValue),
      value: field.format(field.value),
      pristine: field.pristine,
      dirty: field.dirty,
      touched: field.touched,
      untouched: field.untouched,
      valid: field.valid,
      invalid: field.invalid,
      errors: field.errors
    }

    if (component) {
      const Component = component
      return <Component {...passProps} />
    }

    return React.cloneElement(React.Children.only(children), passProps)
  }
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  label: PropTypes.string,
  parse: PropTypes.func,
  transform: PropTypes.func,
  format: PropTypes.func,
  validate: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.func
    ),
    PropTypes.func
  ])
}

Field.defaultProps = {
  validate: [],
  parse: val => val,
  transform: val => val,
  format: val => val
}

Field.contextTypes = {
  _form: PropTypes.object.isRequired
}

export default focus()(Field)
