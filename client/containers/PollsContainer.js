// this container will display all of the polls visible to all viewers
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class PollsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollsArray: [],
      emptyPolls: false
    };
  }

  componentDidMount() {
    axios(this.props.url)
      .then((response) => {
        if (response.data.length === 0) {
          this.setState({ emptyPolls: true });
        }
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
    return (
      <div className='polls-container'>
        {polls}
        {
          this.state.emptyPolls && 
            <div className='empty-polls-container'>
              No polls created yet!
            </div>
        }
      </div>
    );
  }
}

export default PollsContainer;
