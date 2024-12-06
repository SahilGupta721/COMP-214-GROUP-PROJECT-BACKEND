// Register a new customer
exports.registerCustomer = async (req, res) => {
    const { cust_id, name, email, address } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `BEGIN
                sp_register_customer(:cust_id, :name, :email, :address);
            END;`,
            { cust_id, name, email, address }
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
