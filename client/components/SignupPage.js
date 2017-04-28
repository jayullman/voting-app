import React from 'react';
import { Link } from 'react-router-dom';

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
    <p>
      Already have an account? <Link to='/login'>log in here</Link>.
    </p>
  </div>
);

export default SignupPage;
