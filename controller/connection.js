const { createTable } = require('../model/connection');  // Import the function from the model

// Controller function to handle the request for creating a table
const createTableController = async (req, res) => {
  const { tableName } = req.body;  // Get the table name from the request body

  // Validate if the tableName is provided
  if (!tableName) {
    return res.status(400).send({ message: 'Table name is required' });
  }

  try {
    // Call the model's createTable function to create the table in the database
    const result = await createTable(tableName);
    
    if (result) {
      // Respond with success message if the table was created successfully
      res.status(200).send({ message: `Table '${tableName}' created successfully.` });
    }
  } catch (err) {
    // Respond with error message if something goes wrong
    res.status(500).send({ message: err.message });
  }
};

// Export the controller function so it can be used in the routes
module.exports = { createTableController };