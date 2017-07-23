import React, { Component } from 'react'

/**
 * Handles focusing a component
 *
 * @param {Object} defaultState [Optional] Default focus state (i.e. {focused: true})
 */
const focus = (defaultState = {}) =>
  (WrappedComponent) => {
    class Focus extends Component {
      state = {
        focused: false,
        ...defaultState
      }

      onFocus = () => this.setState({ focused: true })
      onBlur = () => this.setState({ focused: false })

      render () {
        // Interface - available data and functions
        const exported = {
          ...this.state,
          onFocus: this.onFocus,
          onBlur: this.onBlur
        }

        return <WrappedComponent _focus={exported} {...this.props} />
      }
    }

    return Focus
  }

export default focus
