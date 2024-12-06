const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

// Route for customer registration
router.post('/register', customerController.registerCustomer);

// Route for updating customer details
router.put('/update', customerController.updateCustomer);

module.exports = router;
