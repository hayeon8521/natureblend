const express = require('express');
const router = express.Router();
const inactService = require('../../service/machine/inact_service.js');

// 비동기 설비 조회
router.get('/inActMachines', async (req, res)=>{
  let inActMachines = await inactService.findInActMachines();
  res.send(inActMachines);
});

// 비동기 내역 조회
router.get('/inActList', async (req, res)=>{
  let result = await inactService.findAllInAct();
  res.send(result);
});

// 비동기 등록
router.post('/inActInsert', async(req, res)=>{
  let inActInfo = req.body;
  let result = await inactService.createNewInAct(inActInfo);
  res.send(result);
});

// 마지막 비동기 갱신
router.put('/lastInAct/:mno', async(req, res) => {
  let mno = req.params.mno;
  let info = req.body;
  let result = await inactService.updateLastInAct(mno, info);
  res.send(result);
});

// 비동기 내역 검색
router.put('/search', async (req, res) => {
  let {process_code, startDate, endDate} = req.body;
  let result = await inactService.searchInActList(process_code, startDate, endDate);
  res.send(result);
});


module.exports = router;