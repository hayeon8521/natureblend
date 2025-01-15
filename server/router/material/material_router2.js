const express = require('express');
const router = express.Router();
const materialService2 = require('../../service/material/material_service2.js');

//자재 검사 대기
router.put('/material/configloding', async(req,res)=>{
    console.log(req.body);
    let {materialCode, clientName, POListCode, startDate, endDate, materialState} = req.body;
    let result = await materialService2.configLoding(materialCode, clientName, POListCode, startDate, endDate, materialState);
    res.send(result);
});


//자재검사중
router.post('/material/recordQCM2', async(req, res)=>{
    let {mName, startDate, endDate, qcState} = req.body;
    let result = await materialService2.findQCMRecord2(mName, startDate, endDate, qcState);
    console.log(result);
    res.send(result);
  });


//자재 입고해야할 목록(자재입고대기)
router.get('/material/miql2', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.materialInputQcList2();
    res.send(materialInputQcListinfo);
});


//생산 지시 목록
router.get('/material/processlist', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.processlist();
    res.send(materialInputQcListinfo);
});

// 착즙 공정
router.get('/material/process1list', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.process1list();
    res.send(materialInputQcListinfo);
});

// 착즙 공정 품질
router.get('/material/process1qclist', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.process1qclist();
    res.send(materialInputQcListinfo);
});

// 세척 공정
router.get('/material/process2list', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.process2list();
    res.send(materialInputQcListinfo);
});

// 세척 공정 품질
router.get('/material/process2qclist', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.process2qclist();
    res.send(materialInputQcListinfo);
});

// 포장 공정
router.get('/material/process3list', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.process3list();
    res.send(materialInputQcListinfo);
});

// 포장 공정 품질
router.get('/material/process3qclist', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.process3qclist();
    res.send(materialInputQcListinfo);
});

// 제품 입고 대기
router.get('/material/productInputWait', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.product_input_wait();
    res.send(materialInputQcListinfo);
});

// 제품 출고 대기
router.get('/material/produceoutwait', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.produce_out_wait();
    res.send(materialInputQcListinfo);
});

// 제품 재고
router.get('/material/productqtying', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.product_qtying();
    res.send(materialInputQcListinfo);
});

// 자재 재고
router.get('/material/materialQtying', async (req, res)=>{
    let materialInputQcListinfo = await materialService2.material_qtying();
    res.send(materialInputQcListinfo);
});

module.exports = router;