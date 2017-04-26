import React from 'react';

import PollsContainer from '../containers/PollsContainer';

const url = '/polls';

const Home = () => (
  <div>
    <PollsContainer url={url} />
  </div>
);

export default Home;
