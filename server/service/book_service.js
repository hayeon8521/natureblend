const mysql = require('../database/mapper.js');

// 전체조회
const findAllBook = async ()=>{
  let list = await mysql.query('bookList');
  return list;
}

// 단건조회
const findBookByNo = async (no)=>{
  let list = await mysql.query('bookInfo', no);
  let info = list[0];
  return info;
}

// 등록
const createNewBook = async (boardInfo)=>{
  let result = await mysql.query('bookInsert', boardInfo);
  if( result.insertId > 0){
    return { book_no : result.insertId }; 
  }else{
    return {};
  }
}

module.exports = {
  findAllBook,
  findBookByNo,
  createNewBook
}