import React, { Component } from 'react';
import axios from 'axios';

import NavBar from './NavBar';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      pollsArray: []
    };

    this.toggleLoggedInStatus = this.toggleLoggedInStatus.bind(this);
  }

  toggleLoggedInStatus() {
    // check logged in status on load and set status in state
    axios.post('/amiloggedin')
      .then((response) => {
        if (response.data.status === true) {
          this.setState({ loggedIn: true });
        } else {
          this.setState({ loggedIn: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.toggleLoggedInStatus(); 
  }

  render() {
    return (
      <div>
        <NavBar
          toggleLoggedInStatus={this.toggleLoggedInStatus}
          loggedIn={this.state.loggedIn}
        />
        <Header />
        <Main loggedIn={this.state.loggedIn} />
        <Footer />
        {
          this.state.loggedIn
            ? <p>Logged in</p>
            : <p>Logged out</p>
        }
      </div>
    );
  }
}

export default App;
