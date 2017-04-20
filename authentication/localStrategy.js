const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/******* Final ********/
// module.exports = new LocalStrategy(
//   function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// );

// TEST USERS

const users = [
  {
    id: 1,
    email: 'j@gmail.com',
    password: 'yo123'
  }
]

/********  TEST  *********/
module.exports = new LocalStrategy({
    usernameField: 'email'
  },
  function (username, password, done) {
    const user = users.findIndex((user) => {
      if (user.email === 'jayullman@gmail.com') {
        return true;
      }
    });
    if (user < 0) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {

      return done(null, true);
      }
    });
