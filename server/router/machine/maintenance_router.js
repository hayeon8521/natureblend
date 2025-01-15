// 정비 라우터
const express = require('express');
const router = express.Router();
const maintenanceService = require('../../service/machine/maintenance_service.js');



// 요청 내역 조회
router.get('/requestList', async (req, res) => {
  let maintenanceList = await maintenanceService.findAllRequests();
  res.send(maintenanceList);
});

// 완료 내역 조회
router.get('/completeList', async (req, res) => {
  let maintenanceList = await maintenanceService.findAllCompletes();
  res.send(maintenanceList);
});

// 상세조회
router.get('/maintenanceInfo/:mno', async (req,res)=>{
  let maintenanceNo = req.params.mno;
  let info = await maintenanceService.getMaintenanceInfo(maintenanceNo);
  res.send(info);
});

// 정비 요청 등록
router.post('/request', async(req, res) => {
  let requestInfo = req.body;
  let result = await maintenanceService.createNewRequest(requestInfo);
  res.send(result);
});

// 수정
router.put('/maintenanceUpdate/:mno', async(req, res) => {
  let mno = req.params.mno;
  let info = req.body;
  let result = await maintenanceService.updateMaintenanceInfo(mno, info);
  res.send(result);
});



module.exports = router;
