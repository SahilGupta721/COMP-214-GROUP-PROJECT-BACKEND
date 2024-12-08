const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

router.get('/', function(req, res, next) {
    res.send('respond with a customers');
  });
// Route for customer registration
router.post('/register', customerController.registerCustomer);

// Route for updating customer details
router.put('/update', customerController.updateCustomer);

module.exports = router;
