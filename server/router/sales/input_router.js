const express = require('express');
const router = express.Router();
const inputService = require('../../service/sales/input_service.js');


//창고조회
router.get('/input/warehouse',async(req,res)=>{
    let warehouseList = await inputService.getWarehouse();
    res.send(warehouseList);
})

//품질검사조회 
router.put('/input/qtsearch',async(req,res)=>{
    let {productCode, startDate,endDate } = req.body;
    
    let result = await inputService.getQtList(productCode,startDate,endDate);
    console.log("결과:",result)
    res.send(result);
  
})

//입고등록 
router.post('/input/insert',async(req,res)=>{
    let inputInfo = req.body;
    let result = await inputService.addInput(inputInfo);
    res.send(result);
})

//검색기준으로 입고리스트 조회
router.put('/input/inputlist',async(req,res)=>{
    let {productCode, startDate,endDate } = req.body;
    let result = await inputService.inputLists(productCode, startDate,endDate);
    console.log("결과:",result);
    res.send(result);
})

//수정을 원하는 입고건이 출고가 된 경우가 있는지 확인  (사용안함)
// router.put('/inputUpdate/check',async(req,res)=>{
//     let deleteInfo = req.body;
//     let result = await inputService.checkLotOutput(deleteInfo);
//     res.send(result);
// })

// 입고된 건 수정작업
router.put('/inputUpdate/update',async(req,res)=>{
    let updateInputInfo = req.body;
    let result = await inputService.updateInputInfo(updateInputInfo);
    res.send(result);
})

//입고된 건 삭제 작업
router.put('/input/delete',async(req,res)=>{
    let deleteInfo = req.body;
    console.log("라우터:",deleteInfo);
    let result = await inputService.deleteInputInfo(deleteInfo);
    res.send(result);
})


//제품번호에 대한 재고량 조회
router.put('/inventory/product/', async(req,res)=>{
    let {productCode} = req.body;
    console.log("라우터:",req.body);
    let result = await inputService.getInventoryProduct(productCode);
    res.send(result);
})

// 제품상태,유통기한으로  lot 재고량 조회
router.put('/inventory/lot',async(req,res)=>{
    let{productStatus,startDate,endDate} = req.body;
    let result = await inputService.getInventoryLot(productStatus,startDate,endDate);
    res.send(result);
})


//유통기한 지난거 lot 폐기 
router.put('/inventory/dispose',async(req,res)=>{
    let disposeLot = req.body;
    let result = await inputService.disposeLot(disposeLot);
    res.send(result);
})

//제품번호로 제품의 lot조회
router.get('/inventory/productLot/:no',async(req,res)=>{
    let productNum = req.params.no;
    let info = await inputService.getProductLotInfo(productNum);
    res.send(info);
})

module.exports = router;

