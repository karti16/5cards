const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Hello, world!');
});

router.post('/', (req, res) => {
  return res.send('Hello, world!');
});

module.exports = router;
