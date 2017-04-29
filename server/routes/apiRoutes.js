const express = require('express');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

const router = express.Router();

// import checkAuthenticated helper function
const checkAuthenticated = require('../../helpers/checkAuthenticated');

const User = require('../../models/userModel');
const Poll = require('../../models/pollModel');

router.get('/secret', function(req, res) {
  if (req.isAuthenticated()) {
    console.log('Authenticated');
  } else {
    console.log('Not authenticated');
  }
  res.sendFile(path.join(__dirname, '../static', 'secret.html'));
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: 'error-page.html' }),
  function (req, res, info) {
    res.redirect('/');
  }
);

router.get('/whoami', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(
      { 
        email: req.user.email,
        id: req.user._id
      });
  }
});

router.get('/findemailbyid/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (!user) {
      res.json({ error: 'No user by that ID exists' });
    } else {
      res.json({ email: user.email });
    }
  });
});

router.post('/amiloggedin', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ status: true} );
  } else {
    res.json({ status: false });
  }
});

router.post('/logout', function (req, res) {
  req.logout();
  res.sendStatus(200);
});

// signup route
// check db for existing user
router.post('/signup', function (req, res) {
  // search db for user
  User.findOne({ email: req.body.email }, (err, user) => {

    // email already exists in database
    if (user) {
      res.redirect('/email-in-use.html');
    } else {
      // use bcrypt to encrypt user's password in the database
      const hash = bcrypt.hashSync(req.body.password)

      const newUser = new User({
        email: req.body.email,
        password: hash
      });
      console.log(newUser);

      // saves new user to the database
      newUser.save((err, user) => {
        if (err) throw err;

        // log new user in
        req.login(user, (err) => {
          if (err) return next(err);
          res.redirect('/');
        });
      })
    }
  })
});

// get list of all polls available to all viewers
router.get('/polls', (req, res) => {
  Poll.find({}, (err, polls) => {
    if (err) throw err;
    res.json(polls);
  });
});

// // Go to the create new poll page if authenticated
// router.get('/createpoll', checkAuthenticated, (req, res) => {
//   res.redirect('createPollPage.html');
// });

// create new poll if authenticated
router.post('/createpoll', checkAuthenticated, (req, res) => {
  console.log(req.body);
  // search db for user
  Poll.findOne({ title: req.body.title }, (err, poll) => {
    console.log(poll);
    // email already exists in database
    if (poll) {
      res.json({ error: 'Poll already exists' });
    } else {

      // parse all the option objects from the body
      const optionsArray = [];
      req.body.options.forEach((option) => {
        if (option) {
          optionsArray.push(
            {
              name: option,
              votes: 0
            }
          );
        }
      });

      // for (let option in req.body) {
      //   if (option.indexOf('option') !== -1) {
      //     optionsArray.push(
      //       {
      //         name: req.body[option],
      //         votes: 0
      //       }
      //     );
      //   }
      // }

      const newPoll = new Poll({
        title: req.body.title,
        options: optionsArray,
        voters: [],
        creator: req.session.passport.user
      });
      // saves new user to the database
      newPoll.save((err, poll) => {
        if (err) throw err;
        res.json(poll);
      })
    }
  })
});

// get list of all of the logged in user's polls
router.get('/mypolls', checkAuthenticated, (req, res) => {
  const userId = req.session.passport.user;
  Poll.find({ creator: userId }, (err, polls) => {
    res.json(polls);
  });
});

router.get('/getpolls/:user', (req, res) => {
  const userId = req.params.user;
  Poll.find({ creator: userId }, (err, polls) => {
    res.json(polls);
  });
});

// get information on a specific poll
router.get('/polls/:pollId', (req, res) => {
  const pollId = req.params.pollId;  
  Poll.findById(pollId, (err, poll) => {
    res.json(poll);
  });
});

// TODO: add back checkAuthenticated middleware
router.delete('/polls/:pollId', (req, res) => {
  const pollId = req.params.pollId;
  Poll.deleteOne({ _id: pollId }, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// votes on a poll
router.put('/polls/:pollId', (req, res) => {

  let userId = null;
  if (req.isAuthenticated()) {
    userId = req.user.id;
  } 

  const pollId = req.params.pollId;
  // name of the option voted for
  const option = req.query.option;
  Poll.findById(pollId, (err, poll) => {

    // returns if poll is not found
    if (!poll) { return res.send('poll not found'); }

    const optArr = poll.options;
    const votersArr = poll.voters;

    // get user's IP address 
    const voterIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // checks if user has already voted in poll
    if (votersArr.indexOf(userId) !== -1 || votersArr.indexOf(voterIP) !== -1) {
      return res.json({ error: 'This user or IP address has already voted on this poll!' });
    } else {
      votersArr.push(userId);
    }
    
    // find index of option
    const term = option;
    const index = optArr.reduce((p, option, i) => {
      if (option.name === term) {
        return i;
      } else {
        return p;
      }
    }, -1);

    const queryString = 'options.' + index + '.votes';

    // incremenents poll and adds user
    Poll.findByIdAndUpdate(
      pollId,
      { $inc: { [queryString]: 1 }, $set: { voters: votersArr } },
      (err) => {
        if (err) throw err;
      }
    );
    res.send('ok');
  });
});

// add option to poll if authenticated and vote on it
router.put('/polls/newoption/:pollId', (req, res) => {
  if (!req.isAuthenticated()) {
   return res.sendStatus(401);
  }

  let userId = null;
  if (req.isAuthenticated()) {
    userId = req.user.id;
  } 
  
  const pollId = req.params.pollId;

  // name of the option being added
  const option = req.query.option;

  console.log(pollId);
  console.log(option);

  // find poll to get array of existing options
  Poll.findById(pollId, (err, poll) => {

    // returns if poll is not found
    if (!poll) { return res.send('poll not found'); }

    const optArr = poll.options;

    // checks if user has already voted in poll
    if (optArr.indexOf(option) === -1) {
      const optionObject = {
        name: option,
        votes: 1
      };
      optArr.push(optionObject);
    }
    console.log(optArr);

    const votersArr = poll.voters;    

    // checks if user has already voted in poll
    if (votersArr.indexOf(userId) === -1) {
      votersArr.push(userId);
    } else {
      return res.json({ error: 'This user or IP address has already voted on this poll!' });
    }
    
    Poll.findByIdAndUpdate(
      pollId,
      { $set: { options: optArr, voters: votersArr } }, 
      (err, poll) => {
        if (err) throw err;
        console.log(poll);
      }
    );
    res.send('ok');    
  });
});

// router.get('/test', (req, res) => {
//   res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" /><script src="https://use.fontawesome.com/cd50ad1c20.js"></script><title>Voting App</title><link rel="stylesheet" href="styles.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>')
// });

// this route will handle sharing user polls
// the route creates a template and injects a variable containing the route to the
// users polls
router.get('/userpolls/:user', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <script src="https://use.fontawesome.com/cd50ad1c20.js"></script>
  <title>Voting App</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root"></div>
  <script>
    var userRoute = '${req.params.user}';
  </script>
  <script src="/app.js"></script>
</body>
</html>`)
});

// route will handle if user enters url into address bar
router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;
