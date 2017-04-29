// this page is specifically for a sharable link that will show
// the polls of a user to anyone with the shared link

import React, { Component } from 'react';
import axios from 'axios';

import PollsContainer from '../containers/PollsContainer';

class UserPolls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: this.props.currentUserEmail
    };

    this.getEmailWithId = this.getEmailWithId.bind(this);
  }
  
  getEmailWithId() {
    console.log(this.props.userRoute);
    axios(`/findemailbyid/${this.props.userRoute}`)
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          this.setState({ userEmail: 'unknown' });
        } else {
          this.setState({ userEmail: response.data.email });
        }
      });
  }

  render() {
    if (!this.state.userEmail) {
      this.getEmailWithId();
    }
    return (
      <div>
        <p>Polls submitted by {this.state.userEmail}</p>
        <PollsContainer url={this.props.url} />
      </div>
    );
  }
}
  
export default UserPolls;
