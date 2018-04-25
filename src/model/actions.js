import * as types from './action-types';

export const initialize = () => ({
  type: types.INITIALIZATION,
});

export const registerField = payload => ({
  type: types.REGISTER_FIELD,
  ...payload,
});

export const registerSubmit = () => ({
  type: types.REGISTER_SUBMIT,
});

export const setValidating = () => ({
  type: types.SET_VALIDATING,
});

export const addError = (key, error) => ({
  type: types.ADD_ERROR,
  key,
  error,
});

export const setErrors = errors => ({
  type: types.SET_ERRORS,
  errors,
});

export const resetField = key => ({
  type: types.RESET_FIELD,
  key,
});

export const resetFields = () => ({
  type: types.RESET_ALL_FIELDS,
});

export const touchField = key => ({
  type: types.TOUCH_FIELD,
  key,
});

export const touchFields = () => ({
  type: types.TOUCH_ALL_FIELDS,
});

export const changeField = (key, value) => ({
  type: types.CHANGE_FIELD_VALUE,
  key,
  value,
});

export const fieldValidationDone = key => ({
  type: types.FIELD_VALIDATION_DONE,
  key,
});
