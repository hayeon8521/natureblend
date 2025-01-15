const express = require('express');
const router = express.Router();
const materialService = require('../../service/material/material_service.js');


// 미지시생산계획 material_order_head (allmaterial)
router.get('/material/orderplan', async (req, res)=>{
  let materialList = await materialService.allmaterial();
  res.send(materialList);
});

// 자재리스트 조회 ( 개별 자재 주문 할때 사용)
router.get('/material/material_list', async (req, res)=>{
  let materialList1 = await materialService.material_list();
  res.send(materialList1);
});

 // 발주 필요 자재 조회 need_order_material (needOrderMaterial)
 //PLAN2412141
 router.get('/material/needOrderMaterial/:plan_code', async (req, res)=>{
  let planCode = req.params.plan_code;
  let needMaterial = await materialService.needOrderMaterial(planCode);
  res.send(needMaterial);
});

//거래처 전체 조회 full_client (fullClient)
router.get('/material/fullClient/', async (req, res)=>{
  let clientKeyWord = req.params.clientKeyWord;
  let fullClientList = await materialService.fullClient(clientKeyWord);
  res.send(fullClientList);
});

//거래처 키워드 검색
router.get('/material/fullClientKeyWord/:clientKeyWord', async (req, res)=>{
  let clientKeyWord = req.params.clientKeyWord;
  let fullClientListInfo = await materialService.fullClientInfo(clientKeyWord);
  res.send(fullClientListInfo);
});


//발주서 등록 프로시저 발동
router.post('/material/inputPoLIst', async (req, res)=>{
  let materialObj = req.body;
  //console.log(materialObj);
  let inputPoLIstinfo = await materialService.inputOrder(materialObj);
  console.log(inputPoLIstinfo);
  res.send(inputPoLIstinfo);
});


//★발주서 등록 프로시저2 ( 리뉴얼 )
router.post('/material/inputPoLIst2/:inputkey', async (req, res)=>{
  let materialKey = req.params.inputkey;
  //console.log(materialKey);
  //let materialObj = req.body;
  //console.log(materialObj);
  let {client_num, emp_num, material_code, go_qty, limit_date, go_price, go_total_price} = req.body;
  let inputPoLIstinfo = await materialService.inputOrder2(materialKey, client_num, emp_num, material_code, go_qty, limit_date, go_price, go_total_price);
  //console.log(inputPoLIstinfo);
  res.send(inputPoLIstinfo);
});




//자재 입고 처리하는 페이지 리스트 material_input_qc_list (materialInputQcList)
router.get('/material/miql', async (req, res)=>{
  let materialInputQcListinfo = await materialService.materialInputQcList();
  res.send(materialInputQcListinfo);
});

//가능 창고 리스트 조회
router.get('/material/warehouse', async (req, res)=>{
  let warehouseList = await materialService.allwarehouseList();
  res.send(warehouseList);
});

//로트번호 간빠이 해오기
router.get('/material/lotNum', async (req, res)=>{
  let lotNumResult = await materialService.lotNumInfo();
  res.send(lotNumResult);
});

//자재 입고 처리 하기
router.post('/material/inputMaterial', async (req, res)=>{
  let materialObj = req.body;
  console.log(materialObj);
  let inputLotInfo = await materialService.inputLotInfoGo(materialObj);
  console.log(inputLotInfo);
  res.send(inputLotInfo);
});


//자재 발주 리스트 조회 ( 현재 사용 안함 삭제해도됨 )
// material_order_list 쿼리 문 // materialOrderList 함수명
router.get('/material/polistorder', async (req, res)=>{
  let poOrderList = await materialService.materialOrderList();
  res.send(poOrderList);
});

//자재 발주 리스트 조회2
router.put('/material/polistorder2', async(req,res)=>{
  console.log(req.body);
  let {materialCode, clientName, POListCode, startDate, endDate, materialState} = req.body;
  let result = await materialService.materialOrderList2(materialCode, clientName, POListCode, startDate, endDate, materialState);
  res.send(result);
});

// 발주서 전체취소 또는 개별 취소
router.post('/material/poListDelete', async(req,res)=>{
  //console.log(req.body);
  let {deleteNum, body_num, order_code} = req.body;
  let result = await materialService.poListDelete(deleteNum, body_num, order_code);
  res.send(result);
});


// 입고완료 내역 조회
router.put('/material/materialInputList', async(req,res)=>{
  //console.log(req.body);
  let {materialCode, clientName, POListCode, startDate, endDate} = req.body;
  let result = await materialService.materialInputList(materialCode, clientName, POListCode, startDate, endDate);
  res.send(result);
});


// 입고번호로 로트번호 조회해서 보여주기 ( 입고 조회 메뉴 )
//lotinfo
router.get('/material/lotinfo/:inputNum', async (req, res)=>{
  let inputNum = req.params.inputNum;
  let lotQtyInfo = await materialService.lotQtyInfomation(inputNum);
  res.send(lotQtyInfo);
});


//로트 재고 조회 페이지에서 사용하는 전체조회 또는 조건조회
router.put('/material/lotqtylist', async (req, res)=>{
  let {qty_state, materialCode, clientName, POListCode, startDate, endDate, materialNomal, materialLotState, limitOut} = req.body;
  let warehouseList = await materialService.lotQtyList(qty_state, materialCode, clientName, POListCode, startDate, endDate, materialNomal, materialLotState, limitOut);
  res.send(warehouseList);
});


// 발주번호 같은 자재 리스트 긁어오기
router.get('/material/matBodyList/:orderCode', async (req, res)=>{
  let orderCode = req.params.orderCode;
  let orderCodeInfo = await materialService.materialBodyList(orderCode);
  res.send(orderCodeInfo);
});


// 검수확인증 모달리스트
router.post('/material/inspectionInfo', async(req,res)=>{
  //console.log(req.body);
  let {order_code, material_name} = req.body;
  let result = await materialService.inspectionInfo(order_code, material_name);
  res.send(result);
});


// 재고 조회 메뉴 ( 전체 또는 조건 )
router.post('/material/materialqtylist', async(req,res)=>{
  let { materialCode, materialName, startDate, endDate, qty_state, limitOut, product_qty, order_qty } = req.body;
  let result = await materialService.materialQtyList(materialCode, materialName, startDate, endDate, qty_state, limitOut, product_qty, order_qty);
  res.send(result);
});

// LOT 재고 폐기
router.post('/material/trushGo', async(req,res)=>{
  let { lot_seq, trush_reason, emp_num } = req.body;
  let result = await materialService.trushGo(lot_seq, trush_reason, emp_num);
  res.send(result);
});



module.exports = router;