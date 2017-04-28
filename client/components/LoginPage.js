import React from 'react';
import { Link } from 'react-router-dom';

import Form from './Form';

const LoginPage = () => (
  <div>
    <h1>
      Log in
    </h1>
    <p>
      Log into your account to view and manage your polls
    </p>
    <Form
      url='/login'
      buttonText='Log In'
    />
    <p>
      Don't have an account? <Link to='/signup'>Sign up here</Link>.
    </p>
  </div>
);

export default LoginPage;
