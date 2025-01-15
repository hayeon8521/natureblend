const mysql = require('../../database/mapper.js');


// 미지시생산계획 material_order_head
const allmaterial = async ()=>{
  let list = await mysql.query('material_order_head');
  return list;
}

// 자재리스트 조회 ( 개별 자재 주문 할때 사용)
const material_list = async ()=>{
  let list = await mysql.query('material_list');
  return list;
}

// 발주 필요 자재 조회 need_order_material
const needOrderMaterial = async (plan_code)=>{
  let list = await mysql.query('need_order_material', [plan_code]);
  //let info = list[0];
  return list;
}

//거래처 전체
const fullClient = async ()=>{
  let list = await mysql.query('full_client');
  return list;
}

//거래처 전체 조회 full_client
const fullClientInfo = async (clientKeyWord)=>{
  searchKeyword = '%'+clientKeyWord+'%';
let list = await mysql.query('full_client_info', [searchKeyword]);
return list;
}


// 발주서 등록 input_order
// CALL material_input_polist(?, ?, ?, ?, ?, ?, ?, @result);
const inputOrder = async (materialObj)=>{
  console.log(materialObj);
  let a1 = materialObj.clientNum;
  let a2 = materialObj.empNum;
  let a3 = materialObj.materialCode;
  let a4 = materialObj.ordQty;
  let a5 = materialObj.limitDate;
  let a6 = materialObj.unitPrice;
  let a7 = materialObj.totalPrice;
  let list = await mysql.query('input_order', [a1, a2, a3, a4, a5, a6, a7] );
  return list;
}

// ★발주서 등록 input_order2 [ 리뉴얼 ]
const inputOrder2 = async (materialKey, client_num, emp_num, material_code, go_qty, limit_date, go_price, go_total_price)=>{
  let a1 = materialKey;
  let a2 = client_num;
  let a3 = emp_num;
  let a4 = material_code;
  let a5 = go_qty;
  let a6 = limit_date;
  let a7 = go_price;
  let a8 = go_total_price;
  console.log(`CALL material_input_polist_rmk(${materialKey}, ${client_num}, ${emp_num}, ${material_code}, ${go_qty}, ${limit_date}, ${go_price}, ${go_total_price});`);
  let list = await mysql.query('input_order2', [a1, a2, a3, a4, a5, a6, a7, a8] );
  return list;
}


// 자재 입고 처리 페이지 리스트
// material_input_qc_list
const materialInputQcList = async ()=>{
  let list = await mysql.query('material_input_qc_list');
  return list;
}

// 가능 창고리스트 조회
//allwarehouseList  // warehouse_list
const allwarehouseList = async ()=>{
  let list = await mysql.query('warehouse_list');
  return list;
}

//로트번호 생성하기
const lotNumInfo = async ()=>{
  let list = await mysql.query('material_lot_num');
  return list;
}


// 자재 입고 및 로트 부여 및 발주바디 상태 입고완료로 변경
//inputLotInfoGo  ///material/inputMaterial
//CALL material_lot_input('19Z24004', 'PO241218004', '식용색소', 999000, 'W001', 1000, 'W002', 1, @v_result)
//CALL material_lot_input(?, ?, ?, ?, ?, ?, ?, ?, @v_result)
const inputLotInfoGo = async (materialObj)=>{
  console.log(materialObj);
  let a1 = materialObj.lot_code;
  let a2 = materialObj.order_code;
  let a3 = materialObj.material_name;
  let a4 = materialObj.pass_qnt;
  let a5 = materialObj.warehouse1;
  let a6 = materialObj.rjc_qnt;
  let a7 = materialObj.warehouse2;
  let a8 = materialObj.emp_num;
  console.log('aaaa', a8);
  console.log('aaaa', a8);
  console.log('aaaa', a8);
  console.log('aaaa', a8);
  console.log('aaaa', a8);
  let list = await mysql.query('input_lot_material', [a1, a2, a3, a4, a5, a6, a7, a8] );
  console.log(list);
  return list;
}


//자재 발주 리스트 조회 (현재 사용안함 삭제 해도됨)
// material_order_list 쿼리 문 // materialOrderList 함수명
const materialOrderList = async ()=>{
  let list = await mysql.query('material_order_list');
  return list;
}

//자재 발주 리스트 조회 ( 조건문 넣어서 )
const materialOrderList2 = async (materialCode, clientName, POListCode, startDate, endDate, materialState)=>{
  console.log(materialCode);
  console.log(clientName);
  console.log(POListCode);
  console.log(startDate);
  console.log(endDate);
  console.log(materialState);
  let searchList = [];

  if(materialState != undefined && Object.keys(materialState).length > 0){
    let search = `mob.material_state IN (`;  
    for (let key in materialState) {        
        search += (key == '0' ? ' ' : ', ') + `\'${materialState[key]}\'`;   
    }
    search += ' )';
    searchList.push(search);
   }
   
  if(materialCode  != undefined && materialCode != null && materialCode != ''){
    let search = `mat.material_name LIKE \'%${materialCode}%\' `;
    searchList.push(search);
  }

  if(clientName  != undefined && clientName != null && clientName != ''){
    let search = `cli.com_name LIKE \'%${clientName}%\' `;
    searchList.push(search);
  }

  if(POListCode  != undefined && POListCode != null && POListCode != ''){
    let search = `mob.order_code LIKE \'%${POListCode}%\' `;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `moh.order_date >= \'${startDate} 00:00:00\' `;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `moh.order_date <= \'${endDate} 23:59:59\' `;
    searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:` AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  querywhere += ` ORDER BY order_code DESC, mob.body_num DESC `;
  console.log('selected Query', querywhere);

  let result = await mysql.query('material_order_list',querywhere);
  return result;
}

// 발주 전체취소 또는 개별취소
const poListDelete = async (deleteNum, body_num, order_code)=>{
  let querywhere = '';
  if(deleteNum == 2){
    querywhere += ` WHERE body_num = \'${body_num}\' `;
  }else{
    querywhere += ` WHERE order_code = \'${order_code}\' `;
  }
  //console.log(querywhere);
  let result = await mysql.query('material_cance',querywhere);
  return result;
}

// 발주 입고리스트 조회 (조건 또는 전체)
const materialInputList = async (materialCode, clientName, POListCode, startDate, endDate)=>{
  console.log(materialCode);
  console.log(clientName);
  console.log(POListCode);
  console.log(startDate);
  console.log(endDate);
  let searchList = [];
  if(materialCode  != undefined && materialCode != null && materialCode != ''){
    let search = `mat.material_name LIKE \'%${materialCode}%\' `;
    searchList.push(search);
  }

  if(clientName  != undefined && clientName != null && clientName != ''){
    let search = `cli.com_name LIKE \'%${clientName}%\' `;
    searchList.push(search);
  }

  if(POListCode  != undefined && POListCode != null && POListCode != ''){
    let search = `mi.order_code LIKE \'%${POListCode}%\' `;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `mi.inset_lot_date >= \'${startDate} 00:00:00\' `;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `mi.inset_lot_date <= \'${endDate} 23:59:59\' `;
    searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:` AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  querywhere += ` ORDER BY mi.input_num DESC `;
  console.log('selected Query', querywhere);

  let result = await mysql.query('material_input_list',querywhere);
  return result;
}

// 입고번호로 로트번호 조회해서 보여주기 ( 입고 조회 메뉴 )
//lotinfo     //lotQtyInfomation
const lotQtyInfomation = async (inputNum)=>{
  let list = await mysql.query('lot_qty_info', [inputNum]);
  return list;
}



//로트 재고 조회 페이지에서 사용하는 전체조회 또는 조건조회
const lotQtyList = async (qty_state, materialCode, clientName, POListCode, startDate, endDate, materialNomal, materialLotState, limitOut)=>{
  
  let searchList = [];

  searchList.push(` mlq.in_qty > 0 `);


  if(materialNomal != undefined && Object.keys(materialNomal).length > 0){
    let search = `mlq.material_nomal IN (`;  
    for (let key in materialNomal) {        
        search += (key == '0' ? ' ' : ', ') + `\'${materialNomal[key]}\'`;   
    }
    search += ' )';
    searchList.push(search);
   }

   if(materialLotState != undefined && Object.keys(materialLotState).length > 0){
    let search = `mlq.material_lot_state IN (`;  
    for (let key in materialLotState) {        
        search += (key == '0' ? ' ' : ', ') + `\'${materialLotState[key]}\'`;   
    }
    search += ' )';
    searchList.push(search);
   }

   if(qty_state  != undefined && qty_state != null && qty_state != ''){
    if(qty_state == 'a2'){
      let search = ` mlq.stok_qty > 0 `;
      searchList.push(search);
    }else if(qty_state == 'a3'){
      let search = ` mlq.stok_qty <= 0 `;
      searchList.push(search);
    }
  }

  if(materialCode  != undefined && materialCode != null && materialCode != ''){
    let search = `mat.material_name LIKE \'%${materialCode}%\' `;
    searchList.push(search);
  }

  if(clientName  != undefined && clientName != null && clientName != ''){
    let search = `cli.com_name LIKE \'%${clientName}%\' `;
    searchList.push(search);
  }

  //변수가 저거인거지 로트코드임
  if(POListCode  != undefined && POListCode != null && POListCode != ''){
    let search = `mlq.lot_code LIKE \'%${POListCode}%\' `;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `mi.inset_lot_date >= \'${startDate} 00:00:00\' `;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `mi.inset_lot_date <= \'${endDate} 23:59:59\' `;
    searchList.push(search);
  }

  if(limitOut  != undefined && limitOut != null && limitOut != ''){
    let search = `mlq.limit_date < CURRENT_TIMESTAMP`;
    searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:` AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  querywhere += ` ORDER BY mlq.lot_seq DESC `;
  console.log('selected Query', querywhere);
  
  let list = await mysql.query('lot_qty_list', querywhere);
  return list;
}


// 발주번호 같은 자재 리스트 긁어오기
const materialBodyList = async (orderCode)=>{
  let list = await mysql.query('material_order_body_list', [orderCode]);
  return list;
}

// 검수확인증 모달 리스트
const inspectionInfo = async (order_code, material_name)=>{
  let list = await mysql.query('inspection_info', [order_code, material_name]);
  return list;
}

// 재고 조회 메뉴 ( 전체 또는 조건 )
const materialQtyList = async (materialCode, materialName, startDate, endDate, qty_state, limitOut, product_qty, order_qty)=>{

  let searchList = [];

  if(qty_state  != undefined && qty_state != null && qty_state != ''){
    if(qty_state == 'a2'){
      let search = ` pm.stok_qty > 0 `;
      searchList.push(search);
    }else if(qty_state == 'a3'){
      let search = ` COALESCE(pm.stok_qty, 0) <= 0 `;
      searchList.push(search);
    }
  }

  if(limitOut  != undefined && limitOut != null && limitOut != ''){
    let search = `rm.stok_qty > 0 `;
    searchList.push(search);
  }

  if(product_qty  != undefined && product_qty != null && product_qty != ''){
    let search = `im.stok_qty > 0 `;
    searchList.push(search);
  }

  if(order_qty  != undefined && order_qty != null && order_qty != ''){
    let search = `om.stok_qty > 0 `;
    searchList.push(search);
  }


  if(materialCode  != undefined && materialCode != null && materialCode != ''){
    let search = `mat.material_code LIKE \'%${materialCode}%\' `;
    searchList.push(search);
  }

  if(materialName  != undefined && materialName != null && materialName != ''){
    let search = `mat.material_name LIKE \'%${materialName}%\' `;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `mat.regi_date >= \'${startDate} 00:00:00\' `;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `mat.regi_date <= \'${endDate} 23:59:59\' `;
    searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:` AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  querywhere += ` ORDER BY mat.material_code DESC `;
  console.log('selected Query', querywhere);

  let list = await mysql.query('material_qty_list', querywhere);

  list = list.map((row, index) => ({
    row_num: list.length - index, // 순번 추가
    ...row,
  }));

  return list;
}

// LOT 재고 폐기
const trushGo = async (lot_seq, trush_reason, emp_num)=>{
  let list = await mysql.query('trush_go', [lot_seq, trush_reason, emp_num]);
  return list;
}

module.exports = {
  allmaterial,
  needOrderMaterial,
  fullClient,
  fullClientInfo,
  inputOrder,
  inputOrder2,
  materialInputQcList,
  allwarehouseList,
  lotNumInfo,
  inputLotInfoGo,
  materialOrderList,
  materialOrderList2,
  poListDelete,
  materialInputList,
  lotQtyInfomation,
  lotQtyList,
  materialBodyList,
  inspectionInfo,
  materialQtyList,
  trushGo,
  material_list,

};