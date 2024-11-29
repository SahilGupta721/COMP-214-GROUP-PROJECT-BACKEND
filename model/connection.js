const oracledb = require('oracledb');
const dbConfig = require('../config/config');  // Make sure you have the correct database configuration

// Function to create a table in Oracle DB
const createTable = async (tableName) => {
  const createTableSQL = `
    CREATE TABLE ${tableName} (
      id NUMBER PRIMARY KEY,
      name VARCHAR2(100) NOT NULL
    )
  `;

  try {
    // Get connection from dbConfig
    const connection = await oracledb.getConnection(dbConfig);
    
    // Execute SQL to create the table
    await connection.execute(createTableSQL);
    
    // Commit the transaction to save changes
    await connection.commit();
    
    // Close the database connection
    await connection.close();
    
    return true;  // Return true if the table was created successfully
  } catch (err) {
    console.error('Error creating table:', err);
    throw new Error('Failed to create table');  // Throw error if something goes wrong
  }
};

// Export the function to use it in the controller
module.exports = { createTable };