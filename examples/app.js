import React from 'react';
import { compose } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

/* Features */
import Frontend from 'features/frontend';
import Administration from 'features/administration';
import { Notification } from 'features/notification';
import { Dialog } from 'features/dialog';

/* HOC */
import GoogleAnalytics from 'hoc/google-analytics';

/**
 * Application
 */
const App = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route path="/administrace" component={Administration} />
        <Route path="/" component={Frontend} />
      </Switch>
    </BrowserRouter>
    <Notification />
    <Dialog />
  </div>
);

export default compose(GoogleAnalytics('UA-35958430-3'))(App);
