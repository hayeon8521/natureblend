
const commentListByBno =
`SELECT no
      , writer
      , content
      , created_date 
FROM t_comment_board 
WHERE bno = ?`;

module.exports = {
  commentListByBno
}