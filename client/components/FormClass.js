import React, { Component } from 'react';

import axios from 'axios';

// TODO: turn Form into a class to use ajax request instead of form request

class Form extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const { url } = this.props;
    e.preventDefault();
    axios.post(url, {
      email: this.emailInput.value,
      password: this.passwordInput.value
    }).then((response) => {
      console.log(response);
    });
  }

  render() {
    const { buttonText } = this.props;
    return (
      <form className='account-info-form'>
        <div>
          <label>
            Email
        <input
              ref={(email) => { this.emailInput = email; }}
              type="email"
              name="email"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password
        <input
              ref={(password) => { this.passwordInput = password; }}
              type="password"
              name="password"
              required
            />
          </label>
        </div>
        <div>
          <button
            onClick={this.handleSubmit}
            className='button'
          >
            {buttonText}
          </button>
        </div>
      </form>
    );
  }

}

export default Form;
