const express = require('express');
const router = express.Router();
const partService = require('../../service/machine/part_service.js');

// 사용 가능한 부품 조회
router.get('/partList', async (req, res)=>{
  let partList = await partService.findAllParts();
  res.send(partList);
});

// 부품 상세 정보
router.get('/partInfo/:pno', async (req,res)=>{
  let partNo = req.params.pno;
  let info = await partService.findPartInfo(partNo);
  res.send(info);
});

// 부품 등록
router.post('/partInsert', async(req, res)=>{
  let partInfo = req.body;
  let result = await partService.createNewPart(partInfo);
  res.send(result);
});

// 부품 수정
router.put('/partUpdate/:pno', async(req, res) => {
  let pno = req.params.pno;
  let info = req.body;
  let result = await partService.updatePartInfo(pno, info);
  res.send(result);
});

// 부품 삭제
router.delete('/partDelete/:pno', async (req, res) => {
  let pno = req.params.pno;
  let result = await partService.delPartInfo(pno);
  res.send(result);
});

// 교체 가능한 부품 목록
router.get('/changePartList/:mType', async (req, res)=>{
  let mType = req.params.mType;
  let partList = await partService.findChangeParts(mType);
  res.send(partList);
});

module.exports = router;