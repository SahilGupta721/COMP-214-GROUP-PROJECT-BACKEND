const oracledb = require('oracledb');

// Database configuration
const dbConfig = {
    user: 'COMP214_F24_er_10',
    password: 'password',
    connectString: '199.212.26.208:1521/SQLD'
};

// Register a new book
exports.registerBook = async (req, res) => {
    const { isbn, title, pubdate, pubid, cost, retail, discount, category } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `BEGIN
                sp_Book_register(:isbn, :title, TO_DATE(:pubdate, 'YYYY-MM-DD'), :pubid, :cost, :retail, :discount, :category);
            END;`,
            { isbn, title, pubdate, pubid, cost, retail, discount, category }
        );

        await connection.commit();
        res.status(200).json({ message: 'Book registered successfully!', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering book.', details: err.message });
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
