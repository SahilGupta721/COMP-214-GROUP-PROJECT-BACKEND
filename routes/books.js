const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');

router.get('/', function(req, res, next) {
    res.send('respond with a books');
  });
// Route for registering a book
router.post('/register', bookController.registerBook);

// Route for updating a book
router.put('/update', bookController.updateBook);

// Route for listing all books
router.get('/list', bookController.listBooks);

module.exports = router;

