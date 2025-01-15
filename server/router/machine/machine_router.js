const express = require('express');
const router = express.Router();
const machineService = require('../../service/machine/machine_service.js');

//이미지
const {upload, deleteImage} = require('./img_router.js');
const path = require('path');

router.post('/uploadImg', upload, async (req, res) => {
  const previousImgPath = req.body.previousImgPath; // 기존 이미지 경로

  // 기존 이미지 삭제
  if (previousImgPath) {
    const fullPath = path.join(__dirname, '../../', previousImgPath);
    deleteImage(fullPath);
  }

  if(req.file) {
    const imagePath = `/images/${req.file.filename}`;
    res.send({filePath : imagePath});
  } else {
    res.status(400).send({error: '이미지 업로드 실패'});
  }
});

// 전체조회
router.get('/machineList', async (req, res) => {
  let machineList = await machineService.findAllMachines();
  res.send(machineList);
});

// 설비 상세 정보
router.get('/machineInfo/:mno', async (req,res)=>{
  let machineNo = req.params.mno;
  let info = await machineService.findMachineInfo(machineNo);
  res.send(info);
});
// 설비 생산 정보
router.get('/machinePrdInfo/:mno', async (req,res)=>{
  let machineNo = req.params.mno;
  let info = await machineService.findMachinePrdInfo(machineNo);
  res.send(info);
});
// 설비 부품 정보
router.get('/machinePartList/:mno', async (req, res) => {
  let machineNo = req.params.mno;
  let partList = await machineService.findMachinePartList(machineNo);
  res.send(partList);
});

// 설비 등록
router.post('/machineInsert', async(req, res) => {
  let machineInfo = req.body;
  let result = await machineService.createNewMachine(machineInfo);
  res.send(result);
});

// 설비 수정
router.put('/machineUpdate/:mno', async(req, res) => {
  let mno = req.params.mno;
  let info = req.body;
  let result = await machineService.updateMachineInfo(mno, info);
  res.send(result);
});

// 설비 삭제
router.delete('/machineDelete/:mno', async (req, res) => {
  let mno = req.params.mno;
  let result = await machineService.delMachineInfo(mno);
  res.send(result);
});

// 설비 분류 검색
router.get('/machineType', async (req, res) => {
  let machineTypeList = await machineService.findMachineType();
  res.send(machineTypeList);
});

// 설비 검색 리스트
router.put('/search', async (req, res) => {
  let {machine_state, process_code, selectSearchType, searchData} = req.body;
  let result = await machineService.searchMachineList(machine_state, process_code, selectSearchType, searchData);
  res.send(result);
});

// 거래처
router.get('/clientList',async(req,res)=>{
  let clientList = await machineService.getClientList();
  res.send(clientList);
})

module.exports = router;