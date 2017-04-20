const express = require('express');
const path = require('path');

const router = express.Router();

router.post('/secret', function(req, res) {
  res.sendFile(path.join(__dirname, '../static', 'secret.html'));
});

module.exports = router;

