import * as types from './action-types';

/**
 * Adds a field
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const addField = (state, action) => {
  const { byId, allIds } = state.fields;
  const { key, label, value, parse, transform, format, validate } = action;

  return {
    ...state,
    fields: {
      allIds: [...allIds, key],
      byId: {
        ...byId,
        [key]: {
          value: transform(parse(value)),
          initialValue: transform(parse(value)),
          meta: {
            key,
            label,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false,
            validating: false,
          },
          functions: {
            parse,
            transform,
            format,
            validate,
          },
          errors: [],
        },
      },
    },
  };
};

/**
 * Registers submit
 *
 * @param {Object} state  Current state
 */
const registerSubmit = state => ({
  ...state,
  isRegistered: true,
});

/**
 * Changes a field´s value
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const changeFieldValue = (state, action) => {
  const { fields } = state;
  const { byId } = fields;
  const field = byId[action.key];

  return {
    ...state,
    fields: {
      ...fields,
      byId: {
        ...byId,
        [action.key]: {
          ...field,
          value: action.value,
          meta: {
            ...field.meta,
            pristine: false,
            dirty: true,
            touched: true,
            untouched: false,
          },
        },
      },
    },
  };
};

/**
 * Marks a field as touched
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const touchField = (state, action) => {
  const { fields } = state;
  const { byId } = fields;
  const field = byId[action.key];

  return {
    ...state,
    fields: {
      ...fields,
      byId: {
        ...byId,
        [action.key]: {
          ...field,
          meta: {
            ...field.meta,
            pristine: false,
            dirty: true,
            touched: true,
            untouched: false,
          },
        },
      },
    },
  };
};

/**
 * Sets all inputs as touched
 *
 * @param {Object} state Current state
 */
const touchAllFields = state => {
  const { fields } = state;
  const { byId, allIds } = fields;

  return {
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id];

        acc[id] = {
          ...field,
          meta: {
            ...field.meta,
            pristine: false,
            dirty: true,
            touched: true,
            untouched: false,
          },
        };
        return acc;
      }, {}),
    },
  };
};

/**
 * Sets all inputs as validating
 *
 * @param {Object} state Current state
 */
const setValidating = state => {
  const { fields } = state;
  const { byId, allIds } = fields;

  return {
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id];

        acc[id] = {
          ...field,
          meta: {
            ...field.meta,
            validating: true,
          },
          errors: [],
        };
        return acc;
      }, {}),
    },
  };
};

/**
 * Sets form errors
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const setErrors = (state, action) => {
  const { fields } = state;
  const { byId, allIds } = fields;
  const { errors } = action;

  return {
    ...state,
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id];

        acc[id] = {
          ...field,
          meta: {
            ...field.meta,
            valid: !errors[id].length,
            invalid: !!errors[id].length,
            validating: true,
          },
          errors: errors[id],
        };
        return acc;
      }, {}),
    },
  };
};

/**
 * Appends error to a field
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const addError = (state, action) => {
  const { fields } = state;
  const { byId } = fields;
  const { key, error } = action;
  const field = byId[key];

  return {
    ...state,
    fields: {
      ...fields,
      byId: {
        ...byId,
        [key]: {
          ...field,
          meta: {
            ...field.meta,
            valid: false,
            invalid: true,
          },
          errors: [...field.errors, error],
        },
      },
    },
  };
};

/**
 * Resets a given field to its initial value and marks it as pristine/untouched/valid
 *
 * @param {Object} state Current state
 * @param {Object} action Payload
 */
const resetField = (state, action) => {
  const { fields } = state;
  const { byId } = fields;
  const { key } = action;
  const field = byId[key];

  return {
    fields: {
      ...fields,
      byId: {
        ...byId,
        [key]: {
          ...field,
          value: field.initialValue,
          meta: {
            ...field.meta,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false,
          },
        },
        errors: [],
      },
    },
  };
};

/**
 * Resets all fields to its initial values and marks them as pristine/untouched/valid
 *
 * @param {Object} state Current state
 */
const resetAllFields = state => {
  const { fields } = state;
  const { byId, allIds } = fields;

  return {
    fields: {
      ...fields,
      byId: allIds.reduce((acc, id) => {
        const field = byId[id];

        acc[id] = {
          ...field,
          value: field.initialValue,
          meta: {
            ...field.meta,
            pristine: true,
            dirty: false,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false,
          },
          errors: [],
        };
        return acc;
      }, {}),
    },
  };
};

const validationFieldDone = (state, action) => {
  const { fields } = state;
  const { byId } = fields;
  const { key } = action;
  const field = byId[key];

  return {
    fields: {
      ...fields,
      byId: {
        ...byId,
        [key]: {
          ...field,
          meta: {
            ...field.meta,
            validating: false,
          },
        },
      },
    },
  };
};

const initialState = {
  fields: {
    byId: {},
    allIds: [],
  },
  isRegistered: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIALIZE:
      return state;
    case types.REGISTER_FIELD:
      return addField(state, action);
    case types.REGISTER_SUBMIT:
      return registerSubmit(state, action);
    case types.CHANGE_FIELD_VALUE:
      return changeFieldValue(state, action);
    case types.TOUCH_FIELD:
      return touchField(state, action);
    case types.TOUCH_ALL_FIELDS:
      return touchAllFields(state);
    case types.RESET_FIELD:
      return resetField(state, action);
    case types.RESET_ALL_FIELDS:
      return resetAllFields(state);
    case types.SET_VALIDATING:
      return setValidating(state, action);
    case types.SET_ERRORS:
      return setErrors(state, action);
    case types.ADD_ERROR:
      return addError(state, action);
    case types.FIELD_VALIDATION_DONE:
      return validationFieldDone(state, action);
    default:
      return state;
  }
};

export default reducer;
