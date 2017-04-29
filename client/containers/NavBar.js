import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import react burger menu module
import { slide as Menu } from 'react-burger-menu';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false
    };

    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleSlideNavClick = this.handleSlideNavClick.bind(this);
  }

  handleLogOut() {
    this.handleSlideNavClick();
    axios.post('/logout')
      .then(() => {
        this.props.toggleLoggedInStatus();
        this.context.router.history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSlideNavClick() {
    this.setState({ isMenuOpen: false });
  }

  render() {
    const loggedIn = this.props.loggedIn;

    return (
      <div className='nav-container'>
        {/* For smaller screens */}
        <nav className='narrow-nav'>
          <Menu right width={200} isOpen={ this.state.isMenuOpen }>
            <li id="home" className="menu-item"><Link to='/'>Home</Link></li>
            {loggedIn && <li id="newpoll" className="menu-item"><Link onClick={this.handleSlideNavClick} to='/createpoll'>Create Poll</Link></li> }
            {loggedIn && <li id="mypolls" className="menu-item"><Link onClick={this.handleSlideNavClick} to={`/userpolls/${this.props.currentUserId}`}>My Polls</Link></li> }
            {!loggedIn && <li id="signupPage" className="menu-item"><Link onClick={this.handleSlideNavClick} to='/signup'>Sign up</Link></li> } 
            {
              loggedIn
                ? <li onClick={this.handleLogOut} className="menu-item"><span className='logout-link'>Log Out</span></li>
                : <li id="loginPage" className="menu-item"><Link onClick={this.handleSlideNavClick} to='/login'>Log In</Link></li>
            }
            <li id="github-page-link-narrow" className="menu-item"><a target="_blank" href='https://github.com/libeja/voting-app'>Source Code</a></li>
          </Menu>
        </nav>

        {/* For larger screend */}
        <nav className='wide-nav'>
          { !loggedIn && <li id="signupPage" className="menu-item"><Link to='/signup'>Sign up</Link></li> }
          {
            this.props.loggedIn
              ? <li onClick={this.handleLogOut} className="menu-item"><span className='logout-link'>Log Out</span></li>
              : <li id="loginPage" className="menu-item"><Link to='/login'>Log In</Link></li>
          }
          { loggedIn && <li id="mypolls" className="menu-item"><Link to={`/userpolls/${this.props.currentUserId}`}>My Polls</Link></li> }
          { loggedIn && <li id="newpoll" className="menu-item"><Link to='/createpoll'>Create Poll</Link></li> }          
          <li id="home" className="menu-item"><Link to='/'>Home</Link></li>
          <li id="github-page-link-wide" className="menu-item"><a target="_blank" href='https://github.com/libeja/voting-app'>GitHub Project Page</a></li>
        </nav>
      </div>
    );
  }
}

NavBar.contextTypes = {
  router: PropTypes.object
};

export default NavBar;
