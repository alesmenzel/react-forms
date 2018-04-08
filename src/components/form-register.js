import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormRegister extends Component {
  componentDidMount() {
    this.props.registerSubmit(this.props.onSubmit);
  }

  render() {
    const {
      children,
      isRegistered,
      handleSubmit,
      registerSubmit,
      ...rest
    } = this.props;

    if (!isRegistered) {
      return null;
    }

    const passProps = {
      onSubmit: handleSubmit,
      ...rest,
    };

    return <form {...passProps}>{children}</form>;
  }
}

FormRegister.propTypes = {
  registerSubmit: PropTypes.func.isRequired,
  isRegistered: PropTypes.bool.isRequired,
  children: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

FormRegister.defaultProps = {
  children: null,
};

export default FormRegister;
