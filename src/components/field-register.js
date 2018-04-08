import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WithFocus from './with-focus';
import { getArray } from '../utils';

class FieldRegister extends Component {
  componentDidMount() {
    const {
      registerField,
      name,
      label,
      value,
      parse,
      transform,
      format,
      validate,
    } = this.props;

    const options = {
      parse,
      transform,
      format,
      validate: getArray(validate),
    };
    registerField(name, label, value, options);
  }

  render() {
    const {
      registerField,
      isRegistered,
      name,
      value,
      label,
      parse,
      transform,
      format,
      validate,
      field,
      fields,
      handleChange,
      handleTouch,
      handleResetField,
      component,
      ...rest
    } = this.props;

    if (!isRegistered) {
      return null;
    }

    const RenderComponent = component;

    const onChange = val => {
      handleChange(name, transform(val, fields));
    };

    const onReset = () => handleResetField(name);

    return (
      <WithFocus>
        {(focused, setFocused, setBlured) => {
          const onFocus = () => {
            setFocused();
            // handleFocus();
          };

          const onBlur = () => {
            setBlured();
            // handleBlur();
            handleTouch(name);
          };

          const passProps = {
            // User defined props
            ...rest,
            // Field
            name,
            value,
            // Handlers
            onChange,
            onReset,
            onFocus,
            onBlur,
            // Field values
            field,
          };

          return <RenderComponent {...passProps} />;
        }}
      </WithFocus>
    );
  }
}

FieldRegister.propTypes = {
  registerField: PropTypes.func.isRequired,
  isRegistered: PropTypes.bool.isRequired,
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
  field: PropTypes.object,
  fields: PropTypes.object,
  handleChange: PropTypes.func,
  handleTouch: PropTypes.func,
  handleResetField: PropTypes.func,
};

FieldRegister.defaultProps = {
  label: '',
  parse: val => val,
  transform: val => val,
  format: val => val,
  validate: [],
  field: {},
  fields: {},
  handleChange: () => {},
  handleTouch: () => {},
  handleResetField: () => {},
};

export default FieldRegister;
