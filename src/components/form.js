import React from 'react';
import PropTypes from 'prop-types';
import Provider from './provider';
import FormContext from './context';
import FormRegister from './form-register';

const Form = props => (
  <Provider>
    <FormContext.Consumer>
      {({ handleSubmit, registerSubmit, isRegistered }) => {
        const passProps = {
          // User defined props
          ...props,
          // Handlers
          registerSubmit,
          isRegistered,
          handleSubmit,
        };

        return <FormRegister {...passProps} />;
      }}
    </FormContext.Consumer>
  </Provider>
);

Form.propTypes = {
  children: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
};

Form.defaultProps = {
  children: null,
};

export default Form;
