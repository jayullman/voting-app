const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

module.exports = new LocalStrategy({
    usernameField: 'email'
  },
  function (email, password, done) {
    User.findOne({ email }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    });
  });
