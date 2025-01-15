const express = require('express');
const router = express.Router();
const bomService = require('../service/standard_service.js');

// bom 조회
router.get('/boms/:bomnum', async (req, res)=>{
    let searchs = req.params.bomnum;
    let bomList = await bomService.findAllBom(searchs);
    res.send(bomList); 
    console.log(bomList);
});
// product 테이블 조회
router.get('/bomproduct',async(req,res)=>{
  let searchs = req.query;
  let productSelect = await bomService.findProduct(searchs);
  res.send(productSelect);
  console.log(productSelect);
})

// bom등록
router.post('/bomregist', async(req, res)=>{
  let bomInfo = req.body;
  let result = await bomService.createNewBom(bomInfo);
  res.send(result);
});

// bom 수정
router.post('/bomupdate/:bomnum', async(req,res)=>{
  let num = req.params.bomnum;
  let info = req.body;
  // console.log(num);
  // console.log('aaa', info);
  let result = await bomService.updateBom(num,info);
  res.send(result);
});

// 자재 추가 등록
router.post('/bominsert/:bomnum', async(req,res)=>{
  let bomnum = req.params.bomnum;
  let insertInfo = req.body;
  let result = await bomService.insertBomList(bomnum, insertInfo);
  res.send(result);
});


// bom 목록 조회
router.get('/bomview',async (req,res)=>{
    let searchs = req.query;
    let bomName = await bomService.findBomView(searchs);
    res.send(bomName);
});

// bom 자재 삭제
router.get('/materialdelete/:bomseq',async(req,res)=>{
  let bomseq = req.params.bomseq;
  console.log(bomseq);
  console.log(bomseq);
  console.log(bomseq);
  let result = await bomService.deleteMaterial(bomseq);
  res.send(result);
});

// bom 삭제
router.delete('/bomdelete/:bomnum',async(req,res)=>{
  let bomnum = req.params.bomnum;
  let result = await bomService.deleteBom(bomnum);
  res.send(result);
});

// 자재 목록 조회 code , name
router.get('/materialselect',async(req,res)=>{
  let searchs = req.query;
  let materialSelect = await bomService.selectMaterial(searchs);
  res.send(materialSelect);
});

// 제품 등록
router.post('/productInsert',async(req,res)=>{
  let { product_code,product_name,expiration_date,capacity } = req.body;
  let result = await bomService.insertProduct(product_code,product_name,expiration_date,capacity);
  res.send(result);
});

// 제품 삭제
router.delete('/productDelete/:product_code',async(req,res)=>{
  let product_code = req.params.product_code;
  let result = await bomService.deleteProduct(product_code);
  res.send(result);
});

// 제품 수정
router.post('/productUpdate/:product_code',async(req,res)=>{
  let product_code = req.params.product_code;
  let { product_name,expiration_date,capacity } = req.body;
  let result = await bomService.updateProduct(product_code,product_name,expiration_date,capacity);
  res.send(result);
});

// 자재 조회
router.get('/materialList',async(req,res)=>{
  let searchs = req.query;
  let materialList = await bomService.materialList(searchs);
  res.send(materialList);
});

// 자재 등록
router.post('/materialInsert',async(req,res)=>{
  let { material_code,material_name,safety_inventory,expiration_date } = req.body;
  let result = await bomService.insertMaterial(material_code,material_name,safety_inventory,expiration_date);
  res.send(result);
});
// 자재 수정
router.post('/materialUpdate/:material_code',async(req,res)=>{
  let material_code = req.params.material_code;
  let { material_name,safety_inventory,expiration_date } = req.body;
  let result = await bomService.updateMaterial(material_code,material_name,safety_inventory,expiration_date);
  res.send(result);
});
// 자재 삭제
router.delete('/materialDel/:material_code',async(req,res)=>{
  let material_code = req.params.material_code;
  let result = await bomService.delMaterial(material_code);
  res.send(result);
});

// 공정정보 조회
router.get('/processList',async(req,res)=>{
  let searchs = req.query;
  let processSelect = await bomService.processList(searchs);
  res.send(processSelect);
});

// 공정정보 삭제
router.delete('/processDelete/:process_code',async(req,res)=>{
  let process_code = req.params.process_code;
  let result = await bomService.deleteProcess(process_code);
  res.send(result);
});

// 공정정보 등록
router.post('/processInsert',async(req,res)=>{
  let { process_code,process_name,machine_type } = req.body;
  let result = await bomService.insertProcess(process_code,process_name,machine_type);
  res.send(result);
});

// 공정정보 수정
router.post('/processUpdate/:process_code',async(req,res)=>{
  let process_code = req.params.process_code;
  let { process_name,machine_type } = req.body;
  let result = await bomService.updateProcess(process_code,process_name,machine_type);
  res.send(result);
});

// 사원 조회
router.get('/employeeList',async(req,res)=>{
  let searchs = req.query;
  let empList = await bomService.employeeList(searchs);
  res.send(empList);
});

// 사원 삭제
router.delete('/employeeDelete/:emp_num',async(req,res)=>{
  let emp_num = req.params.emp_num;
  let result = await bomService.deleteEmployee(emp_num);
  res.send(result);
})

// 사원 등록 , 수정
router.post('/employeeInsert',async(req,res)=>{
  let { emp_num,name,birth,tel,job,job_num,position,employment_date,resignation_date,level } = req.body;
  let result = await bomService.insertEmployee(emp_num,name,birth,tel,job,job_num,position,employment_date,resignation_date,level);
  res.send(result);
});

// 거래처 조회
router.get('/customerList',async(req,res)=>{
  let searchs = req.query;
  let customerList = await bomService.customerList(searchs);
  res.send(customerList);
});

// 거래처 등록
router.post('/customerInsert',async(req,res)=>{
  let { com_num,com_name,address,trade,boss,boss_tel,emp_name,emp_tel } = req.body;
  let result = await bomService.insertCustomer(com_num,com_name,address,trade,boss,boss_tel,emp_name,emp_tel);
  res.send(result);
});

// 거래처 수정
router.post('/customerUpdate/:client_num',async(req,res)=>{
  let client_num = req.params.client_num;
  let { com_num,com_name,address,trade,boss,boss_tel,emp_name,emp_tel } = req.body;
  let result = await bomService.updateCustomer(client_num,com_num,com_name,address,trade,boss,boss_tel,emp_name,emp_tel);
  res.send(result);
});

// 거래처 삭제
router.delete('/customerDelete/:client_num',async(req,res)=>{
  let client_num = req.params.client_num;
  let result = await bomService.deleteCustomer(client_num);
  res.send(result);
});

// 창고 조회
router.get('/warehouseList',async(req,res)=>{
  let searchs = req.query;
  let warehouseList = await bomService.warehouseList(searchs);
  res.send(warehouseList);
})

// 창고 등록 , 수정
router.post('/warehouseInsert',async(req,res)=>{
  let { warehouse_code,warehouse_name,storage,warehouse_location,emp_name,emp_tel,warehouse_area } = req.body;
  let result = await bomService.insertWarehouse(warehouse_code,warehouse_name,storage,warehouse_location,emp_name,emp_tel,warehouse_area);
  res.send(result);
});
// 창고 삭제
router.delete('/warehouseDelete/:warehouse_code',async(req,res)=>{
  let warehouse_code = req.params.warehouse_code;
  let result = await bomService.deleteWarehouse(warehouse_code);
  res.send(result);
});

// 불량코드 조회
router.get('/faultyList',async(req,res)=>{
  let searchs = req.query;
  let faultyList = await bomService.faultyList(searchs);
  res.send(faultyList);
});
// 불량코드 등록 , 수정
router.post('/faultyInsert',async(req,res)=>{
  let { faulty_code,faulty_reason } = req.body;
  let result = await bomService.insertFaulty(faulty_code,faulty_reason);
  res.send(result);
});
// 불량코드 삭제
router.delete('/faultyDelete/:faulty_code',async(req,res)=>{
  let faulty_code = req.params.faulty_code;
  let result = await bomService.deleteFaulty(faulty_code);
  res.send(result);
})
// 반품코드 조회
router.get('/returnList',async(req,res)=>{
  let searchs = req.query;
  let returnList = await bomService.returnList(searchs);
  res.send(returnList);
});
// 반품코드 등록 , 수정
router.post('/returnInsert',async(req,res)=>{
  let { return_code,return_reason } = req.body;
  let result = await bomService.insertReturn(return_code,return_reason);
  res.send(result);
});
// 반품코드 삭제
router.delete('/returnDelete/:return_code',async(req,res)=>{
  let return_code = req.params.return_code;
  let result = await bomService.deleteReturn(return_code);
  res.send(result);
})
// 공정흐름도 조회
router.get('/flowList/:product_code',async(req,res)=>{
  let productCode = req.params.product_code;
  console.log(productCode);
  // let searchs = req.query;
  let flowList = await bomService.flowList(productCode);
  res.send(flowList);
})
// 공정흐름도 등록
router.post('/flowInsert' ,async(req,res)=>{
  let { product_code, process_code, process_name } = req.body;
  console.log('라우터에서 데이터 확인',product_code);
  let result = await bomService.insertFlow(product_code, process_code, process_name);
  res.send(result);
})
// 공정흐름도 수정
router.post('/flowUpdate', async (req, res) => {
  const { process_chart_num,process_sequence } = req.body;
  let result = await bomService.updateFlow( process_chart_num,process_sequence );
  res.send(result);
})
// 선택한 상품의 process chart num 조회
router.post('/flowNumList', async(req,res)=>{
  const { beforeProcessSequence, beforeData } = req.body;
  let result = await bomService.flowNumList(beforeProcessSequence, beforeData);
  res.send(result);
})
// before 데이터 업데이트
router.post('/beforeUpdate', async(req,res) => {
  const {beforeData,beforeProcessSequence} = req.body;
  let result = await bomService.beforeData(beforeData,beforeProcessSequence);
  res.send(result);
})
// 흐름도 삭제
router.delete('/flowDelete/:process_chart_num', async(req,res) => {
  let process_chart_num = req.params.process_chart_num;
  let result = await bomService.deleteFlow(process_chart_num);
  res.send(result);
})

module.exports = router;