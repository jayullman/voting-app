// this container will display all of the polls visible to all viewers
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class PollsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollsArray: []
    };
  }

  componentDidMount() {
    axios('/polls')
      .then((response) => {
        this.setState({ pollsArray: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    // Map poll objects into an array containing divs with the poll title
    const polls = this.state.pollsArray.map(poll => 
      <Link key={poll._id} to={`/pollpage/${poll._id}`}><div className='poll-card'>{poll.title}</div></Link>
    );
    console.log(this.state.pollsArray);
    return (
      <div className='pollsContainer'>
        {polls}
      </div>
    );
  }
}

export default PollsContainer;
