import React from 'react';

import PollsContainer from '../containers/PollsContainer';

const MyPolls = props => (
  <div>
    <p>Polls submitted by {props.currentUserEmail}</p>
    <PollsContainer url={props.url} />
  </div>
);

export default MyPolls;
