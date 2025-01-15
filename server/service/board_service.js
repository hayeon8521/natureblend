const mysql = require('../database/mapper.js');

// 전체조회
const findAllBoard = async (keywords)=>{
  let sql = Object.keys(keywords).length == 0 ? 'boardList': 'boardListWithKeywoard';
  let list = await mysql.query(sql,keywords);
  return list;
}

// 단건조회
const findBoardByNo = async (no)=>{
  let list = await mysql.query('boardInfo', no);
  let info = list[0];
  return info;
}

// 등록
const createNewBoard = async (boardInfo)=>{
  let result = await mysql.query('boardInsert', boardInfo);
  if( result.insertId > 0){
    return { board_no : result.insertId }; 
  }else{
    return {};
  }
}

// 수정
const updateBoardInfo = async (no, updateInfo)=>{
  let datas = [updateInfo, no];
  let result = await mysql.query('boardUpdate',datas);
  let sendData = {};
  if(result.changedRows == 1){
    sendData.target = { 'board_no' : no };
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

// 게시글의 댓글 목록 조회
const findCommentsByNo = async (no)=>{
  let list = await mysql.query('commentListByBno', no);
  return list;
}

module.exports = {
  findAllBoard,
  findBoardByNo,
  createNewBoard,
  updateBoardInfo,
  findCommentsByNo
}