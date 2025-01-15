const express = require('express');
const router = express.Router()
const orderService = require('../../service/production/order_service');

router.get('/plans', async (req, res)=>{
    let waitingPlanList = await orderService.findWaitingPlanList();
    res.send(waitingPlanList);
});

router.get('/processflow/:productCode', async (req, res)=>{
    let productCode = req.params.productCode;
    let processFlow = await orderService.findProcessFlow(productCode);
    res.send(processFlow);
});

router.get('/bom/:productCode', async (req, res)=>{
    let productCode = req.params.productCode;
    let bom = await orderService.findBom(productCode);
    res.send(bom);
});

router.post('/stock', async (req, res)=>{
    let materialCodes = req.body;
    let materialStockList = await orderService.materialStock(materialCodes);
    res.send(materialStockList);
});

router.post('/', async (req, res)=>{
    let orderInfo = req.body;
    let result = await orderService.addProductionOrder(orderInfo);
    res.send(result);
});

router.post('/stockhold', async (req, res)=>{
    let holdStockInfo = req.body;
    let result = await orderService.addHoldingStock(holdStockInfo);
    res.send(result);
});

router.post('/process', async (req, res)=>{
    let processWorkInfo = req.body;
    let result = await orderService.addProcessWork(processWorkInfo);
    console.log('route result', result)
    res.send(result);
});

router.get('/', async (req, res)=>{
    let prodOrderList = await orderService.prodOrderList();
    res.send(prodOrderList);
});

router.post('/delete', async (req, res)=>{
    let prodOrderNums = req.body;
    res.send(await orderService.deleteProdOrder(prodOrderNums));
});

router.post('/delete/process', async (req, res)=>{
    let prodOrderNums = req.body;
    res.send(await orderService.deleteProcessWork(prodOrderNums));
});

router.post('/delete/invalid/material', async (req, res)=>{
    let prodOrderNums = req.body;
    res.send(await orderService.deleteInvalidMaterial(prodOrderNums));
});

module.exports = router