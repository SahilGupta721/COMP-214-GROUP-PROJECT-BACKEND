// Register a new customer

const oracledb = require('oracledb');
const dbConfig = {
    user: 'COMP214_F24_er_10',
    password: 'password',
    connectString: '199.212.26.208:1521/SQLD' //your_host:your_port/your_service_name',
  };
exports.registerCustomer = async (req, res) => {
    const { customerNumber, firstname, lastname, address, city, state, zip, referred, region, email } = req.body;


    try {
        const connection = await oracledb.getConnection(dbConfig);
        // const result = await connection.execute('SELECT * FROM hr_employees');
        const result = await connection.execute(
            `INSERT INTO jl_customers 
             (CUSTOMER#, LASTNAME, FIRSTNAME, ADDRESS, CITY, STATE, ZIP, REFERRED, REGION, EMAIL) 
             VALUES 
             (:customerNumber, :lastname, :firstname, :address, :city, :state, :zip, :referred, :region, :email)`,
            {
                customerNumber: req.body.customerNumber, // Numeric value for CUSTOMER#
                lastname: req.body.lastname,             // String (up to 10 characters)
                firstname: req.body.firstname,           // String (up to 10 characters)
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


//register a customer

// CREATE OR REPLACE PROCEDURE sp_register_customer (
//     par_cust_id   IN JL_CUSTOMERS.CUST_ID%TYPE,
//     par_name      IN JL_CUSTOMERS.NAME%TYPE,
//     par_email     IN JL_CUSTOMERS.EMAIL%TYPE,
//     par_address   IN JL_CUSTOMERS.ADDRESS%TYPE
// ) AS
// BEGIN
//     INSERT INTO JL_CUSTOMERS (CUST_ID, NAME, EMAIL, ADDRESS)
//     VALUES (par_cust_id, par_name, par_email, par_address);
//     COMMIT;
// END;
// /

//update customer

// CREATE OR REPLACE PROCEDURE sp_update_customer (
//     par_cust_id   IN JL_CUSTOMERS.CUST_ID%TYPE,
//     par_email     IN JL_CUSTOMERS.EMAIL%TYPE,
//     par_address   IN JL_CUSTOMERS.ADDRESS%TYPE,
//     par_region    IN JL_CUSTOMERS.REGION%TYPE,
//     par_state     IN JL_CUSTOMERS.STATE%TYPE
// ) AS
// BEGIN
//     UPDATE JL_CUSTOMERS
//     SET EMAIL = par_email,
//         ADDRESS = par_address,
//         REGION = par_region,
//         STATE = par_state
//     WHERE CUST_ID = par_cust_id;
//     COMMIT;
// END;
// /
