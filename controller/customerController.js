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
                                                            // String (up to 10 characters)
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

// Update customer details
exports.updateCustomer = async (req, res) => {
    const { cust_id, email, address, region, state } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `BEGIN
                sp_update_customer(:cust_id, :email, :address, :region, :state);
            END;`,
            { cust_id, email, address, region, state }
        );
        await connection.commit();
        res.status(200).json({ message: 'Customer details updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating customer.' });
    }
};

