import React from 'react';

const Form = ({ buttonText, url }) => (
  <form className='account-info-form' action={url} method="post">
    <div>
      <label>
        Email
        <input type="text" name="email" required />
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
