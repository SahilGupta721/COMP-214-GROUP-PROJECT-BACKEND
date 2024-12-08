const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController');

router.get('/', function(req, res, next) {
    res.send('respond with a authors');
  });
// Register an author
router.post('/register', authorController.registerAuthor);

// Assign an author to a book
router.post('/assign', authorController.assignAuthor);

module.exports = router;

// CREATE OR REPLACE PROCEDURE sp_assign_author (
//     par_isbn      IN JL_BOOKS.ISBN%TYPE,
//     par_author_id IN JL_AUTHOR.AUTHOR_ID%TYPE
// ) AS
// BEGIN
//     UPDATE JL_BOOKS
//     SET AUTHOR_ID = par_author_id
//     WHERE ISBN = par_isbn;
//     COMMIT;
// END;
// /

// CREATE OR REPLACE PROCEDURE sp_register_author (
//     par_author_id IN JL_AUTHOR.AUTHOR_ID%TYPE,
//     par_lname     IN JL_AUTHOR.LNAME%TYPE,
//     par_fname     IN JL_AUTHOR.FNAME%TYPE
// ) AS
// BEGIN
//     INSERT INTO JL_AUTHOR (AUTHOR_ID, LNAME, FNAME)
//     VALUES (par_author_id, par_lname, par_fname);
//     COMMIT;
// END;
// /
