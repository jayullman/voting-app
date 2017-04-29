import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import NavBar from './NavBar';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

// feature detection for touch events to allow
// for css styling for touch screens
/* 
example:
.no-touchevents .box { color: red; }
.touchevents .box { color: green; }
*/
import '../../helpers/modernizr-touch';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      // email of user currently logged in
      currentUserEmail: '',
      currentUserId: '',
      pollsArray: []
    };

    this.toggleLoggedInStatus = this.toggleLoggedInStatus.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  toggleLoggedInStatus() {
    // check logged in status on load and set status in state
    axios.post('/amiloggedin')
      .then((response) => {
        if (response.data.status === true) {
          this.setState({ loggedIn: true });
          this.getCurrentUser();
        } else {
          this.setState({ loggedIn: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCurrentUser() {
    axios('/whoami')
      .then((response) => {
        console.log(response.data);
        this.setState(
          { 
            currentUserEmail: response.data.email,
            currentUserId: response.data.id 
          });
      });
  }

  componentDidMount() {
    // check if app should route to user polls
    if (window.userRoute) {
      this.context.router.history.push('/signup');
    }

    this.toggleLoggedInStatus(); 
  }

  render() {
    return (
      <div>
        <NavBar
          toggleLoggedInStatus={this.toggleLoggedInStatus}
          loggedIn={this.state.loggedIn}
          currentUserId={this.state.currentUserId}
        />
        <Header />
        <Main 
          loggedIn={this.state.loggedIn} 
          currentUserEmail={this.state.currentUserEmail}
          currentUserId={this.state.currentUserId}
        />
        <Footer />
      </div>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object
};

export default App;
