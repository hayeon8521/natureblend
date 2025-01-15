const express = require('express');
const router = express.Router();
const orderService = require('../../service/sales/order_service.js');

//판매 거래처 전체 조회
router.get('/orderList/clients',async(req,res)=>{
  let clientList = await orderService.getClientList();
  res.send(clientList);
})

// 검색 기준으로 주문리스트 조회
router.put('/orderList/search', async(req,res)=>{
  let {orderStatus, orderName, clientName, startDate, endDate} = req.body;
  let result = await orderService.getOrderList(orderStatus, orderName, clientName, startDate, endDate);
  res.send(result);
});

//영업사원 전체 조회
router.get('/orderlist/emps',async(req,res)=>{
  let empList = await orderService.getEmpList();
  res.send(empList);
})

//제품번호,코드 전체조회
router.get('/orderlist/products',async(req,res)=>{
  let prdList = await orderService.getProductList();
  res.send(prdList); 
})


//주문서,주문 등록
router.post('/orderForm/insert',async(req,res)=>{
  let orderInfo = req.body;
  let result = await orderService.addOrder(orderInfo);
  res.send(result);
})

//주문서, 주문 정보 조회
router.get('/orderInfo/:no', async(req,res)=>{
  let orderlistNum = req.params.no;
  let info = await orderService.getOrderInfo(orderlistNum);
  res.send(info);
})

//주문수정의 주문추가
router.post('/orderUpdate/insert',async(req,res)=>{
  let orderInfo = req.body;
  let result = await orderService.updateAddOrder(orderInfo);
  res.send(result);
})

//주문서,주문 수정 
router.put('/orderUpdate/update/:no',async(req,res)=>{
  let orderlistNum = req.params.no;
  let updateOrder = req.body; //JSON으로 보내는 데이터
  let result = await orderService.updateOrderInfo(orderlistNum,updateOrder);
  res.send(result);

})

//주문서,주문 삭제 
router.delete('/orderlist/delete/:no',async(req,res)=>{
  let orderlistNum = req.params.no;
  let info = await orderService.delOrderlist(orderlistNum);
  res.send(info);
})

//출고된주문검색 
router.get('/shippedOrderInfo/:no', async(req,res)=>{
  let orderlistNum = req.params.no;
  let info = await orderService.getShippedOrder(orderlistNum);
  res.send(info);
})

//주문삭제 
router.put('/order/delete',async(req,res)=>{
  let deleteOrder = req.body;
  console.log("라우터==",deleteOrder);
  let result = await orderService.deleteOrderInfo(deleteOrder);
  res.send(result);
})

module.exports = router;