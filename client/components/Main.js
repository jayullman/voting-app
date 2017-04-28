import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import PollPage from './PollPage';
import NewPollPage from './NewPollPage';
import MyPolls from './MyPolls';

const Main = (outerProps) => {
  // create function that returns component in order to pass props to router
  const PollPageWrapper = props => (
    <PollPage
      loggedIn={outerProps.loggedIn}
      {...props}
    />
  );

  return (
    <div className='main-container'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/mypolls' component={MyPolls} />
        <Route exact path='/pollpage/:pollid' render={PollPageWrapper} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/login' component={LoginPage} />
        <Route path='/createpoll' component={NewPollPage} />
      </Switch>
    </div>
  );
};

export default Main;
