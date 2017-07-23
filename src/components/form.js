import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formHOC from '../form'

/**
 * Form Component
 */
class Form extends Component {
  componentWillMount () {
    const { onSubmit } = this.props
    const { _form: { registerSubmit } } = this.context

    registerSubmit(onSubmit)
  }

  render () {
    const { children, ...rest } = this.props
    const { _form: { handleSubmit } } = this.context

    return (
      <form {...rest} onSubmit={handleSubmit}>
        {children}
      </form>
    )
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

Form.contextTypes = {
  _form: PropTypes.object.isRequired
}

export default formHOC(Form)
