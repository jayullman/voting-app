import React from 'react';

import Form from './Form';

const SignupPage = () => (
  <div>
    <h1>
      Sign up
    </h1>
    <p>
      Signing up will allow you to create and manage your own polls
    </p>
    <Form
      url='/signup'
      buttonText='Sign Up'
    />
  </div>
);

export default SignupPage;
