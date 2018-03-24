import * as t from './action-types';

const initialState = {
  isSubmitting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case t.SUBMIT_REQUEST:
      return {
        ...state,
        isSubmitting: true,
      };
    case t.SUBMIT_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
      };
    case t.SUBMIT_FAILURE:
      return {
        ...state,
        isSubmitting: false,
      };
    default:
      return state;
  }
};
