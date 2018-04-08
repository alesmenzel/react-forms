import React from 'react';
import PropTypes from 'prop-types';
import FormContext from './context';
import FieldRegister from './field-register';

const Field = props => (
  <FormContext.Consumer>
    {({
      registerField,
      fields,
      handleChange,
      handleTouch,
      handleResetField,
    }) => {
      const passProps = {
        // User defined props
        ...props,
        // Fields
        field: fields.byId[props.name],
        fields,
        // Handlers
        registerField,
        isRegistered: !!fields.byId[props.name],
        handleChange,
        handleTouch,
        handleResetField,
      };

      return <FieldRegister {...passProps} />;
    }}
  </FormContext.Consumer>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  component: PropTypes.any.isRequired,
  label: PropTypes.string,
  parse: PropTypes.func,
  transform: PropTypes.func,
  format: PropTypes.func,
  validate: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.func),
    PropTypes.func,
  ]),
};

Field.defaultProps = {
  label: '',
  parse: val => val,
  transform: val => val,
  format: val => val,
  validate: [],
};

export default Field;
