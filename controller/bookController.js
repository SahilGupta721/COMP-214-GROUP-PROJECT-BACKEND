const oracledb = require('oracledb');

// Database configuration
const dbConfig = {
    user: 'COMP214_F24_er_10',
    password: 'password',
    connectString: '199.212.26.208:1521/SQLD' // Ensure this is correct
};

// Register a new book
exports.registerBook = async (req, res) => {
    const bookDetails = req.body; // Extract book details from request body
    let connection;

    try {
        // Establish connection to Oracle database
        connection = await oracledb.getConnection(dbConfig);

        // Call the procedure using a PL/SQL block
        const plsql = `
            BEGIN
                sp_Book_register(
                    :isbn,
                    :title,
                    :pubdate,
                    :pubid,
                    :cost,
                    :retail,
                    :discount,
                    :category
                );
            END;`;

        // Bind parameters
        const binds = {
            isbn: bookDetails.isbn,                   // ISBN as a string
            title: bookDetails.title,                 // Title of the book
            pubdate: new Date(bookDetails.pubdate),   // Publication date as a JS Date
            pubid: parseInt(bookDetails.pubid),       // Publisher ID as a number
            cost: parseFloat(bookDetails.cost),       // Cost as a number
            retail: parseFloat(bookDetails.retail),   // Retail price as a number
            discount: parseFloat(bookDetails.discount), // Discount as a number
            category: bookDetails.category            // Category as a string
        };

        // Execute the procedure
        await connection.execute(plsql, binds, { autoCommit: true });

        res.status(200).json({ message: 'Book registered successfully!' });
    } catch (err) {
        console.error('Error executing procedure:', err);
        res.status(500).json({ error: 'Failed to register book.', details: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close(); // Always close the connection
            } catch (closeErr) {
                console.error('Error closing connection:', closeErr);
            }
        }
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    const { isbn, category, cost, retail } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `UPDATE JL_BOOKS 
             SET CATEGORY = :category, COST = :cost, RETAIL = :retail 
             WHERE ISBN = :isbn`,
            { category, cost, retail, isbn }
        );

        await connection.commit();
        res.status(200).json({ message: 'Book updated successfully!', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating book.', details: err.message });
    }
};

// List all books
exports.listBooks = async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT * FROM JL_BOOKS`
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error listing books.', details: err.message });
    }
};
