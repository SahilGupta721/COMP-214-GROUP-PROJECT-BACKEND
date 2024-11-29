const express = require('express');
const router = express.Router();
const { createTableController } = require('../controller/connection');  // Import the controller

// Define the route to create a table

router.get('/', (req, res) => {
    res.send('Welcome to the server!');
  });
  
  router.post('/create-table', createTableController);  

module.exports = router;
