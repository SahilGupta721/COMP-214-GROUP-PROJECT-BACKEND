const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController');

router.get('/', function(req, res, next) {
    res.send('respond with a authors');
  });
// Register an author
router.post('/register', authorController.registerAuthor);

// Assign an author to a book
router.post('/assign', authorController.assignAuthor);

module.exports = router;
