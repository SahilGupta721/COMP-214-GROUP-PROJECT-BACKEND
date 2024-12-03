var express = require('express');
var router = express.Router();
const displayController = require('../controller/display-query'); // Import your display-query.js


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('This COMP-214 project');
});

// Route to fetch data from hr_employees
router.get('/employees', displayController.display);

module.exports = router;
