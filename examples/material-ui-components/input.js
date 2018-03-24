import React from 'react';
import { Input as InputRT } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';

const Input = ({
  name,
  errors,
  validators,
  initialValue,
  onReset,
  focused,
  pristine,
  dirty,
  touched,
  untouched,
  valid,
  invalid,
  ...props
}) => (
  <div>
    <InputRT error={touched && invalid && errors[0]} {...props} />
    <Button label="Reset" onClick={onReset} />
  </div>
);

export default Input;
