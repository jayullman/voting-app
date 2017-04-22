const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PollSchema = new mongoose.Schema({
  title: String,
  options: [{
    name: String,
    votes: Number
  }],
  voters: Array,
  creator: String
});

const Poll = mongoose.model('poll', PollSchema);

module.exports = Poll;