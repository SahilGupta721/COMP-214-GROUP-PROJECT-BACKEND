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
    let connection;
    try {
        // Establish connection to Oracle DB
        connection = await oracledb.getConnection(dbConfig);

        // Prepare the OUT parameter to receive the result set
        const result = await connection.execute(
            `BEGIN get_books(:p_books); END;`,
            {
                p_books: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        // Extract the cursor from the result
        const cursor = result.outBinds.p_books;
        const books = [];

        // Loop through the cursor and map the results to the books array
        let row;
        while ((row = await cursor.getRow())) {
            books.push({
                isbn: row[0],        // ISBN is the first column
                title: row[1],       // Title is the second column
                pubDate: row[2],     // PubDate is the third column
                pubId: row[3],       // PubId is the fourth column
                cost: row[4],        // Cost is the fifth column
                retail: row[5],      // Retail is the sixth column
                discount: row[6],    // Discount is the seventh column
                category: row[7]     // Category is the eighth column
            });
        }

        // Close the cursor
        await cursor.close();

        // Send the books as a JSON response
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Error fetching books.', details: err.message });
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