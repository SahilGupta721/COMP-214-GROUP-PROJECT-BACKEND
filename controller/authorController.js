const oracledb = require('oracledb');
const dbConfig = { user: 'username', password: 'password', connectString: 'db_connection_string' };

// Register an author
exports.registerAuthor = async (req, res) => {
    const { author_id, lname, fname } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `BEGIN
                sp_register_author(:author_id, :lname, :fname);
            END;`,
            { author_id, lname, fname }
        );
        await connection.commit();
        res.status(200).json({ message: 'Author registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering author.' });
    }
};

// Assign an author to a book
exports.assignAuthor = async (req, res) => {
    const { isbn, author_id } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `BEGIN
                sp_assign_author(:isbn, :author_id);
            END;`,
            { isbn, author_id }
        );
        await connection.commit();
        res.status(200).json({ message: 'Author assigned to book successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error assigning author to book.' });
    }
};
