const express = require('express');
const router = express.Router();

// 전체조회
router.get('/natureBlend', async (req, res) => {
  let searchs = req.query;
  let result = JSON.stringify(searchs) + ' 전체조회함';

  res.send(result);
});

// 선택조회
router.get('/natureBlend/:keyword', async (req, res) => {
  let keyword = req.params.keyword;

  let result = keyword + '를 선택조회함';
  res.send(result);
});

// 등록
router.post('/natureBlend', async (req, res) => {
  let body = req.body;
  let result = JSON.stringify(body) + ' 등록 완료';

  res.send(result);
});

// 수정
router.put('/natureBlend/:no', async (req, res) => {
  let no = req.params.no;
  let result = no + '번 수정 완료';

  res.send(result);
});

// 삭제
router.delete('/natureBlend/:no', async (req, res) => {
  let no = req.params.no;
  let result = no + '번 삭제 완료';

  res.send(result);
});

module.exports = router;
