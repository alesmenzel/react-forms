import { combineReducers } from 'redux';

import { reducer as auth } from 'features/auth';
import { reducer as dialog } from 'features/dialog';
import { reducer as notification } from 'features/notification';

const rootReducer = combineReducers({
  auth,
  dialog,
  notification,
});

export default rootReducer;
