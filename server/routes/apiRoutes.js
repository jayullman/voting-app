const express = require('express');
const path = require('path');
const passport = require('passport');

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
  passport.authenticate('local', { failureRedirect: '/' }),
  function (req, res, info) {
    res.redirect('/');
  }
);

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
      res.json({ error: 'Email is in use' });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      // saves new user to the database
      newUser.save((err, user) => {
        if (err) throw err;

        // log new user in
        req.login(user, (err) => {
          if (err) return next(err);
          res.redirect('createPollPage.html');
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

// Go to the create new poll page if authenticated
router.get('/createpoll', checkAuthenticated, (req, res) => {
  res.redirect('createPollPage.html');
});

// create new poll if authenticated
router.post('/createpoll', checkAuthenticated, (req, res) => {
  // search db for user
  Poll.findOne({ title: req.body.title }, (err, poll) => {

    // email already exists in database
    if (poll) {
      res.json({ error: 'Poll already exists' });
    } else {

      // parse all the option objects from the body
      var optionsArray = [];

      for (let option in req.body) {
        if (option.indexOf('option') !== -1) {
          optionsArray.push(
            {
              name: req.body[option],
              votes: 0
            }
          );
        }
      }

      const newPoll = new Poll({
        title: req.body.title,
        options: optionsArray,
        voters: [],
        creator: req.session.passport.user
      });
      // saves new user to the database
      newPoll.save((err, poll) => {
        if (err) throw err;
        res.redirect('/');
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
  Poll.deleteOne({ _id: pollId }, (err) => {
    if (err) throw err;
  });
});

// votes on a poll
router.put('/polls/:pollId', (req, res) => {

  // temp value
  const userId = 5443;

  const pollId = req.params.pollId;
  console.log(pollId);
  // name of the option voted for
  const option = req.query.option;
  console.log(option);
  Poll.findById(pollId, (err, poll) => {

    // returns if poll is not found
    if (!poll) { return res.send('poll not found'); }

    const optArr = poll.options;
    const votersArr = poll.voters;

    // checks if user has already voted in poll
    if (votersArr.indexOf(userId) === -1) {
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

  const userId = 5443;
  
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

// route will handle if user enters url into address bar
router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;
