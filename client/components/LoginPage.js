import React from 'react';

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
  </div>
);

export default LoginPage;
