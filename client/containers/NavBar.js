import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import react burger menu module
import { slide as Menu } from 'react-burger-menu';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLogOut() {
    axios.post('/logout')
      .then(() => {
        console.log('here');
        this.props.toggleLoggedInStatus();
        this.context.router.history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className='nav-container'>
        {/* For smaller screens */}
        <nav className='narrow-nav'>
          <Menu right width={200}>
            <li id="home" className="menu-item"><Link to='/'>Home</Link></li>
            <li id="signupPage" className="menu-item"><Link to='/signup'>Sign up</Link></li>
            {
              this.props.loggedIn
                ? <li onClick={this.handleLogOut} id="logout-link" className="menu-item">Log Out</li>
                : <li id="loginPage" className="menu-item"><Link to='/login'>Log In</Link></li>
            }
          </Menu>
        </nav>

        {/* For larger screend */}
        <nav className='wide-nav'>
          <li id="signupPage" className="menu-item"><Link to='/signup'>Sign up</Link></li>
          {
            this.props.loggedIn
              ? <li onClick={this.handleLogOut} id="logout-link" className="menu-item">Log Out</li>
              : <li id="loginPage" className="menu-item"><Link to='/login'>Log In</Link></li>
          }
          <li id="home" className="menu-item"><Link to='/'>Home</Link></li>
          <li id="github-page-link" className="menu-item"><a href='https://github.com/libeja/voting-app'>GitHub Project Page</a></li>
        </nav>
      </div>
    );
  }
}

NavBar.contextTypes = {
  router: PropTypes.object
};

export default NavBar;
