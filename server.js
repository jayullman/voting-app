const express = require('express');
const app = express();
const path = require('path');

// connect to mongoose database
const connectToDb = require('./controllers/connectToDb');
connectToDb();

const port = process.env.PORT || 3000;

// set up passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const session = require('express-session');
// app.use(session({
//   secret: 'secretword',
//   resave: false,
//   saveUninitialized: false
// }));
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, 1);
});

passport.deserializeUser(function (id, cb) {
  // db.users.findById(id, function (err, user) {
  //   if (err) { return cb(err); }
  //   cb(null, user);
  // });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server', 'static')));

const localStrategy = require('./authentication/localStrategy');
passport.use(localStrategy);

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('secret.html');
  }
);

const apiRoutes = require('./server/routes/apiRoutes');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  console.log('test');
  res.sendFile('index.html');
});


app.listen(port, () => {
  console.log(`App is listening on port: ${ port }`);
});