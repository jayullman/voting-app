import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import PollPage from './PollPage';

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/pollpage/:pollid' component={PollPage} />
      <Route path='/signup' component={SignupPage} />
      <Route path='/login' component={LoginPage} />
    </Switch>
  </div>
);

export default Main;
