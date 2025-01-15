const express = require('express');
const router = express.Router();
const bookService = require('../service/book_service.js');

// 전체조회
router.get('/books', async (req, res)=>{
  let bookList = await bookService.findAllBook();
  res.send(bookList);
});

// 단건조회
router.get('/books/:no', async (req,res)=>{
  let bookNo = req.params.no;
  let info = await bookService.findBookByNo(bookNo);
  res.send(info);
})

// 등록
router.post('/books', async(req, res)=>{
  let bookInfo = req.body;
  let result = await bookService.createNewBook(bookInfo);
  res.send(result);
});


module.exports = router;