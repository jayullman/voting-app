import React from 'react';

// TODO: turn Form into a class to use ajax request instead of form request

const Form = ({ buttonText, url }) => (
  <form className='account-info-form' action={url} method="post">
    <div>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
    </div>
    <div>
      <label>
        Password
        <input type="password" name="password" required />
      </label>
    </div>
    <div>
      <input className='button' type="submit" value={buttonText} />
    </div>
  </form>
);

export default Form;
