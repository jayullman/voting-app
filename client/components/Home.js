import React from 'react';
import { Link } from 'react-router-dom';

import PollsContainer from '../containers/PollsContainer';

const url = '/polls';

const Home = () => (
  <div>
    <h1>Polls submitted by all users</h1>
    <p>
      Below is a list of polls submitted by all users. You may vote on any poll. In order to
      submit your own poll, you must first <Link to='/login'>log&nbsp;in</Link>. If you do not have an
      account, <Link to='/signup'>sign&nbsp;up&nbsp;here</Link>.
    </p>
    <PollsContainer url={url} />
  </div>
);

export default Home;
