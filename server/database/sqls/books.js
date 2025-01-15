const bookList = 
`SELECT no, 
        name, 
        writer, 
        publisher, 
        publication_date, 
        info
FROM t_book_board
ORDER BY no`;

const bookInfo = 
`SELECT no, 
        name, 
        writer, 
        publisher, 
        publication_date, 
        info
FROM t_book_board
WHERE no = ?`;

const bookInsert = 
`INSERT INTO t_book_board
SET ?`;


module.exports = {
    bookList,
    bookInfo,
    bookInsert
}