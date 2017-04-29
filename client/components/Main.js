import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import PollPage from './PollPage';
import NewPollPage from './NewPollPage';
import MyPolls from './MyPolls';
import UserPolls from './UserPolls';

const Main = (outerProps) => {
  // create function that returns component in order to pass props to router
  const PollPageWrapper = props =>
    <PollPage
      loggedIn={outerProps.loggedIn}
      {...props}
    />;

  const HomeWrapper = props =>
    <Home
      loggedIn={outerProps.loggedIn}
      {...props}
    />;

  const MyPollsWrapper = props =>
    <MyPolls
      currentUser={outerProps.currentUserEmail}
      url='/mypolls'
      {...props}
    />;

  const UserPollsWrapper = props =>
    <UserPolls
      currentUserEmail={outerProps.currentUserEmail}
      url={`/getpolls/${window.userRoute}`}
      {...props}
    />;

  return (
    <div className='main-container'>
      <Switch>
        <Route exact path='/' render={HomeWrapper} />
        <Route exact path='/mypolls' render={MyPollsWrapper} />
        <Route exact path='/userpolls/:userid' render={UserPollsWrapper} />
        <Route exact path='/pollpage/:pollid' render={PollPageWrapper} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/login' component={LoginPage} />
        <Route path='/createpoll' component={NewPollPage} />
      </Switch>
    </div>
  );
};

export default Main;
