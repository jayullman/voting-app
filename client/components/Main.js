import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import PollPage from './PollPage';

const Main = (outerProps) => {
  // create function that returns component in order to pass props to router
  const myPollPage = props => (
    <PollPage
      loggedIn={outerProps.loggedIn}
      {...props}
    />
  );

  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/pollpage/:pollid' render={myPollPage} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/login' component={LoginPage} />
      </Switch>
    </div>
  );
};

export default Main;
