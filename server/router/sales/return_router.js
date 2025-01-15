const express = require('express');
const router = express.Router();
const returnService = require('../../service/sales/return_service.js');

//반품이유,코드 전체 조회
router.get('/return',async(req,res)=>{
    let returnlist = await returnService.getReturnList();
    res.send(returnlist);
}) 

//반품등록
router.post('/return/insert',async(req,res)=>{
    let returnInfo = req.body;
    console.log("라우터",returnInfo)
    let result = await returnService.createReturn(returnInfo);
    res.send(result);
})

//반품조회
//반품리스트 조회
router.put('/return/search',async(req,res)=>{
    let {clientName, startDate, endDate} = req.body;
    let result = await returnService.getReturnSearch(clientName, startDate, endDate);
    res.send(result);
})

//반품수정 
router.put('/returnUpdate/update',async(req,res)=>{
    let updateReturnInfo = req.body;
    let result = await returnService.updateReturnInfo(updateReturnInfo);
    res.send(result);
})

//반품삭제 
router.put('/return/delete',async(req,res)=>{
    let deleteReturnInfo = req.body;
    let result = await returnService.deleteReturnInfo(deleteReturnInfo);
    res.send(result);
})















module.exports = router;