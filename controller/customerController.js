// Register a new customer

const oracledb = require('oracledb');
const dbConfig = {
    user: 'COMP214_F24_er_10',
    password: 'password',
    connectString: '199.212.26.208:1521/SQLD' //your_host:your_port/your_service_name',
  };
exports.registerCustomer = async (req, res) => {
    const { customerNumber, lastname, firstname, address, city, state, zip, referred, region, email } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        // const result = await connection.execute('SELECT * FROM hr_employees');
        const result = await connection.execute(
            `BEGIN
                sp_register_customer(:customerNumber, :lastname, :firstname,  :address, :city, :state, :zip, :referred, :region, :email);
            END;`,
            {
                customerNumber: req.body.customerNumber, // Numeric value for CUSTOMER#
                                                           
                lastname: req.body.lastname,  
                firstname: req.body.firstname,            // String (up to 10 characters)
                address: req.body.address,               // String (up to 20 characters)
                city: req.body.city,                     // String (up to 12 characters)
                state: req.body.state,                   // String (2 characters)
                zip: req.body.zip,                       // String (5 characters)
                referred: req.body.referred,             // Numeric value for REFERRED
                region: req.body.region,                 // 2-character string for REGION
                email: req.body.email                    // String (up to 30 characters)
            }
        );
            
        await connection.commit();
        res.status(200).json({ message: 'Customer registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering customer.' });
    }
};




exports.updateCustomer = async (req, res) => {
    const { cust_id } = req.params;
    const { address, region, state, email } = req.body;
    const customerId = Number(cust_id);  // Ensure cust_id is a number

    // Check if customerId is a valid number
    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID.' });
    }

    let connection;
    try {
        // Debugging: Log the customerId to ensure it's correct
        console.log("Attempting to update customer with ID:", customerId);

        connection = await oracledb.getConnection(dbConfig); // Initialize connection

        // Start building the SQL query
        let sql = 'UPDATE JL_CUSTOMERS SET ';
        let binds = {};
        let updates = [];

        // Dynamically add fields to be updated (only those that are provided)
        if (address) {
            updates.push('ADDRESS = :address');
            binds.address = address;
        }
        if (region) {
            updates.push('REGION = :region');
            binds.region = region;
        }
        if (state) {
            updates.push('STATE = :state');
            binds.state = state;
        }
        if (email) {
            updates.push('EMAIL = :email');
            binds.email = email;
        }

        // If no updates were provided, return a response indicating nothing was updated
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields provided to update.' });
        }

        // Join the updates array into a string and append it to the SQL query
        sql += updates.join(', ') + ' WHERE "CUSTOMER#" = :cust_id';
        binds.cust_id = customerId;

        console.log("Executing SQL:", sql);
        console.log("With binds:", binds);

        // Execute the SQL query
        const result = await connection.execute(sql, binds, { autoCommit: true });

        // Check if any rows were affected
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'No customer found with the specified ID.' });
        }

        // Send success response
        res.status(200).json({ message: 'Customer updated successfully!' });
    } catch (err) {
        // Log the error for debugging
        console.error('Error updating customer:', err);

        // Send detailed error message
        res.status(500).json({ error: 'Error updating customer.', details: err.message });
    } finally {
        // Ensure the connection is always closed
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};


// List all customer details
exports.listAllCustomers = async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Bind the ref cursor to the procedure
        const result = await connection.execute(
            `BEGIN
                sp_list_all_customers(:p_cursor);
            END;`,
            {
                p_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } // OUT parameter for ref cursor
            }
        );

        // Retrieve rows from the ref cursor
        const rows = await result.outBinds.p_cursor.getRows();

        // If no customers are found, return a message
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No customers found.' });
        }


        // Map the rows into a customer array
        const customers = rows.map(row => ({
            customerNumber: row[0],
            lastname: row[1],
            firstname: row[2],
            address: row[3],
            city: row[4],
            state: row[5],
            zip: row[6],
            referred: row[7],
            region: row[8],
            email: row[9]
        }));

        // Send the customer data back in the response
        res.status(200).json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching customer details.' });
    }
};



