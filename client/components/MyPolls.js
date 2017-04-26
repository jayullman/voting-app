import React from 'react';

import PollsContainer from '../containers/PollsContainer';

const url = '/mypolls';

const MyPolls = () => (
  <div>
    <PollsContainer url={url} />
  </div>
);

export default MyPolls;
