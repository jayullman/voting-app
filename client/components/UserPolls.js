// this page is specifically for a sharable link that will show
// the polls of a user to anyone with the shared link

import React from 'react';

import PollsContainer from '../containers/PollsContainer';

const UserPolls = props => (
  <div>
    <p>Polls submitted by {props.currentUserEmail}</p>
    <PollsContainer url={props.url} />
  </div>
);

export default UserPolls;
