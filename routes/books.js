const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');

// Route for registering a book
router.post('/register', bookController.registerBook);

// Route for updating a book
router.put('/update', bookController.updateBook);

// Route for listing all books
router.get('/list', bookController.listBooks);

module.exports = router;

// CREATE OR REPLACE PROCEDURE sp_Book_register (
//     par_isbn      IN JL_BOOKS.ISBN%TYPE,
//     par_title     IN JL_BOOKS.TITLE%TYPE,
//     par_pubdate   IN JL_BOOKS.PUBDATE%TYPE,
//     par_pubid     IN JL_BOOKS.PUBID%TYPE,
//     par_cost      IN JL_BOOKS.COST%TYPE,
//     par_retail    IN JL_BOOKS.RETAIL%TYPE,
//     par_discount  IN JL_BOOKS.DISCOUNT%TYPE,
//     par_category  IN JL_BOOKS.CATEGORY%TYPE
// ) AS
// BEGIN
//     INSERT INTO jl_books (ISBN, TITLE, PUBDATE, PUBID, COST, RETAIL, DISCOUNT, CATEGORY)
//     VALUES (par_isbn, par_title, par_pubdate, par_pubid, par_cost, par_retail, par_discount, par_category);

//     COMMIT;
// END;
// /
