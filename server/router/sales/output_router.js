const express = require('express');
const router = express.Router();
const outputService = require('../../service/sales/output_service.js');

// 검색 기준으로 주문리스트 조회
router.put('/output/search', async(req,res)=>{
  let {orderName, clientName, startDate, endDate} = req.body;
  //console.log(req.body);
  let result = await outputService.getOutputOrderList(orderName, clientName, startDate, endDate);
  res.send(result);
});

//미출고주문조회 
router.get('/output/disoutput/:no',async(req,res)=>{
  let orderlistNum = req.params.no;
  let info = await outputService.getDisoutputOrder(orderlistNum);
  res.send(info);
})

//제품별 lot 조회
router.get('/output/product/:no',async(req,res)=>{
  let productCode = req.params.no;
  let info = await outputService.getLotBaseProduct(productCode);
  res.send(info);
})

//출고등록 
router.post('/output/insert',async(req,res)=>{
  //console.log(req.body);
  let outputInfo = req.body;
  let result = await outputService.addOutput(outputInfo);
  res.send(result);
})

//검색 기준으로 출고리스트 조회
router.put('/outputList/search',async(req,res)=>{
  let {clientName,productCode,orderName,startDate,endDate} = req.body;
  let result = await outputService.getOutputList(clientName,productCode,orderName,startDate,endDate);
  res.send(result);
})







module.exports = router;