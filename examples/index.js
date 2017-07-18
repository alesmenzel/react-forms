import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import jwt from 'jsonwebtoken'

import configureStore from 'helper/store'
import setAuthorizationToken from 'helper/auth-token'
import { authSuccess } from 'features/auth'

/* Application */
import App from './app'

/* Redux store */
const store = configureStore()

/* Authentication JWT token */
const token = localStorage.jwtToken
if (token) {
  setAuthorizationToken(token)
  store.dispatch(authSuccess(jwt.decode(token)))
}

const render = () =>
	ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
		document.getElementById('root')
	)

/* Render the application */
render()

/* Enable Hot Module Replacement */
if (module.hot) {
  module.hot.accept('./app', render)
}
