import React from 'react';
import { Button } from 'react-toolbox/lib/button';

const Submit = ({
  name,
  getValue,
  validation,
  focused,
  isPristine,
  isDirty,
  touched,
  untouched,
  valid,
  invalid,
  ...props
}) => <Button type="submit" {...props} />;

export default Submit;
