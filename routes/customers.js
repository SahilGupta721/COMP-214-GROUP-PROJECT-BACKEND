const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

router.get('/', function(req, res, next) {
    res.send('respond with a customers');
  });
// Route for customer registration
router.post('/register', customerController.registerCustomer);
router.get('/list', customerController.listAllCustomers);

// Route for updating customer details
router.put('/update/:cust_id', customerController.updateCustomer);


module.exports = router;
