const express = require('express');
const router = express.Router()
const planService = require('../../service/production/plan_service');


router.get('/products', async (req, res)=>{
    let productList = await planService.findAllProducts();
    res.send(productList);
});

router.get('/orders', async (req, res)=>{
    let productCode = req.query.product_code;

    let orders = await planService.findOrders(productCode);
    res.send(orders);
});

router.get('/stock/:productCode', async (req, res)=>{
    let productCode = req.params.productCode;
    let stock = await planService.findProductStock(productCode);
    res.send(stock);
});

router.get('/employees', async (req, res)=>{
    res.send(await planService.getProductionEmpList());
});

router.post('/', async (req, res)=>{
    let planInfo = req.body;
    res.send(await planService.addPlan(planInfo));
});

router.get('/', async (req, res)=>{
    const query = req.query
    res.send(await planService.planList(query));
});

router.post('/delete', async (req, res)=>{
    let orderPlanNums = req.body;
    res.send(await planService.deletePlan(orderPlanNums));
});

router.put('/', async (req, res)=>{
    let planInfo = req.body;
    res.send(await planService.editPlan(planInfo));
});


module.exports = router