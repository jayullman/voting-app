import React from 'react';

const Form = ({ buttonText, url }) => (
  <form action={url} method="post">
    <div>
      <label>Email:</label>
      <input type="text" name="email" />
    </div>
    <div>
      <label>Password:</label>
      <input type="password" name="password" />
    </div>
    <div>
      <input type="submit" value={buttonText} />
    </div>
  </form>
);

export default Form;
