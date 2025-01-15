const express = require('express');
const router = express.Router();
const boardService = require('../service/board_service.js');

// 전체조회
router.get('/boards', async (req, res)=>{
    let searchs = req.query;
    let boardList = await boardService.findAllBoard(searchs);
    res.send(boardList); 
});

// 단건조회
router.get('/boards/:no', async (req,res)=>{
  let boardNo = req.params.no;
  let info = await boardService.findBoardByNo(boardNo);
  res.send(info);
})
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + view 

// 등록
router.post('/boards', async(req, res)=>{
  let boardInfo = req.body;
  let result = await boardService.createNewBoard(boardInfo);
  res.send(result);
});

// 수정
router.put('/boards/:no', async(req, res)=>{
  let no = req.params.no;
  let info = req.body;
  let result = await boardService.updateBoardInfo(no, info);
  res.send(result);
});

// 게시글의 댓글 목록 조회
router.get('/boards/:bno/comments', async (req,res)=>{
  let boardNo = req.params.bno;
  let info = await boardService.findCommentsByNo(boardNo);
  res.send(info);
})
module.exports = router;