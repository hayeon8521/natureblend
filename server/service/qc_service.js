const mysql = require('../database/mapper.js');

//입고검사신청
// 조회
const findMeterialOrder = async (mName, startDate, endDate) => {
  let searchList = [];

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `h.order_date >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `h.order_date <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY h.order_code DESC" : `AND ${querywhere} ORDER BY h.order_code DESC`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('searchMaterialOrderWithConditions', querywhere);
  return result;

};

const findMeterialAllOrder = async () => {
  let sql = 'searchMaterialOrder';
  let list = await mysql.query(sql);
  return list;
}

const requestInspectionForM = async (insertObj) => {
  let sql = 'inputQCMaterial';
  let arr = insertObj;
  let successNum = 0;

  for (let item of arr) {
    let { orderCode, mName, ordQty, empNum } = item

    let result = await mysql.query(sql, [empNum, orderCode, mName, ordQty]);
    if (result[0][0].result == 'Success!') {
      successNum++;
    }
    //console.log(result[0][0].result);

  }
  return { 'successNum': successNum };

}

//입고검사관리-조회
const findAllRequestForQCM = async () => {
  let sql = 'selectedQCMAll';
  let list = await mysql.query(sql);
  return list;
}
//입고검사관리-선택조회(검색)
const findRequestForQCM = async (mName, startDate, endDate) => {
  let searchList = [];

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `q.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `q.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY q.qc_material_id DESC" : `AND ${querywhere} ORDER BY q.qc_material_id DESC`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCMWithConditions', querywhere);
  return result;

};

//입고검사관리-검사완료
const completeQCM = async (qcm, qcmr) => {
  let sql1 = 'updateQCM';
  let sql2 = 'insertQCMF';
  let updatedRows = 0;  // 수정된 수(검사완료처리)
  let successNum = 0;   // 등록된 수 (불량품처리)

  //입고검사-완료 처리
  for (let item of qcm) {
    let { passQnt, rjcQnt, qcMaterialId } = item;

    let result = await mysql.query(sql1, [passQnt, rjcQnt, qcMaterialId]);
    console.log(result.data);
    if (result.affectedRows > 0) {
      updatedRows += result.affectedRows; // 누적
    }
  }
  //입고검사-불량품
  for (let item of qcmr) {
    let { qcMaterialId, faultyCode, qty } = item;

    let result = await mysql.query(sql2, [qcMaterialId, faultyCode, qty]);
    if (result[0][0].result == 'Success!') {
      successNum++;
    }
  }
  return { 'updatedRows': updatedRows, 'defectNum': successNum };


};


//불량코드(1~5)
const findFaultyCodeOneToFive = async () => {
  let sql = 'selectFaultyCodeOneToFive';
  let list = await mysql.query(sql);
  return list;
};

//입고검사기록조회(전체조회)
const findQCMRecordAll = async () => {
  let sql = 'selectQCMRAll';
  let list = await mysql.query(sql);
  return list;
}
//입고검사기록조회(선택 조회)
const findQCMRecord = async (mName, startDate, endDate, qcState) => {
  let searchList = [];

  //검사상태
  let state = ''
  switch(qcState) {
    case 'qcs2':
      state = `inspec_status LIKE '검사완료'`;
      searchList.push(state);
      break;
    case 'qcs3':
      state = `inspec_status LIKE '검사요청완료'`;
      searchList.push(state);
      break;
    default:
      break;
  }

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `q.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `q.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY q.qc_material_id DESC" : `WHERE ${querywhere} ORDER BY q.qc_material_id DESC`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCMRWithConditions', querywhere);
  return result;

}


//입고검사-불량내역조회
const findQCMFaultyAll = async () => {
  let sql = 'selectQCMF';
  let list = await mysql.query(sql);
  return list;
}
const findQCMFaulty = async (mName, startDate, endDate) => {

  let searchList = [];

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `q.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `q.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY r.qc_material_rjc_id DESC " : `WHERE ${querywhere} ORDER BY r.qc_material_rjc_id DESC `;
  console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCMFWithConditions', querywhere);
  return result;
}
///////////////////////////////////////////////////////////////////////////
//공정검사 - 세척검사조회(공통 - 전체, 선택 조회 모두 포함)
const findQCPC = async (status, mName, startDate, endDate)=>{

  let searchList = [];

  if (status != undefined && status != null && status != '') {
    let search = `qcpc.inspec_status LIKE \'%${status}%\'`;
    searchList.push(search);
  }

  if (mName != undefined && mName != null && mName != '') {
    let search = `bm.material LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `qcpc.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `qcpc.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY qcpc.qc_cleaning_id DESC " : `AND ${querywhere} ORDER BY qcpc.qc_cleaning_id DESC `;
  //console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCPC', querywhere);
  return result;

};

// 세척검사 불량코드
const findFaultyCodeQCPC = async () => {
  let sql = 'selectFaultyCodeQCPC';
  let list = await mysql.query(sql);
  return list;
};

// 세척검사 완료 처리
const completeQCPC = async (qcpc, qcpcr) =>{
  let sql1 = 'updateQCPC';
  let sql2 = 'insertQCPCR';
  let updatedRows = 0;  // 수정된 수(검사완료처리)
  let successNum = 0;   // 등록된 수 (불량품처리)

  //검사 완료 처리
  for (let item of qcpc) {
    let { qcProcessId, processNum, passQnt,  rjcQnt} = item;

    // '검사번호', 공정바디번호,  합격수, 불합격수
    let result = await mysql.query(sql1, [qcProcessId, processNum, passQnt, rjcQnt]);
    if (result[0][0].result == 'Success') {
      updatedRows++;
    }
  }

  //불량 등록 처리
  for (let item of qcpcr) {
    let { qcProcessId, faultyCode, qty } = item;

    let result = await mysql.query(sql2, [qcProcessId, faultyCode, qty]);
    if (result[0][0].result == 'Success!') {
      successNum++;
    }
  }
  //수정된 행수, 불량품내역 추가된 수 return
  return { 'updatedRows': updatedRows, 'defectNum': successNum };



}
// 세척검사-불량내역조회
const findQCPCR = async(mName, startDate, endDate)=>{

  let searchList = [];


  if (mName != undefined && mName != null && mName != '') {
    let search = `bm.material LIKE \'%${pName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `qcpc.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `qcpc.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY qpcr.cleaning_rjc_id DESC " : `AND ${querywhere} ORDER BY qpcr.cleaning_rjc_id DESC `;
  //console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCPCR', querywhere);
  return result;

};



///////////////////////////////////////////////////////////////////////////
//공정검사 - 음료검사



//검사항목 불러오기
const loadTestDetails = async() => {
  let sql = 'selectTestDetails';
  let list = await mysql.query(sql);

  // 데이터를 product_code 기준으로 그룹화
  let groupedData = list.reduce((acc, cur) => {
    const { product_code, ...details } = cur;
    if (!acc[product_code]) acc[product_code] = [];
    acc[product_code].push(details);
    return acc;
  }, {});

  return groupedData;
};


//공정검사 - 음료검사조회(공통 - 전체, 선택 조회 모두 포함)
const findQCPB = async (status, pName, startDate, endDate, passResult)=>{

  let searchList = [];

  if (status != undefined && status != null && status != '') {
    let search = `qb.inspec_status LIKE \'%${status}%\'`;
    searchList.push(search);
  }

  if (passResult!= undefined && passResult != null && passResult != '') {
    let search = `qb.inspec_result LIKE \'${passResult}\'`;
    searchList.push(search);
  }

  if (pName != undefined && pName != null && pName != '') {
    let search = `ph.product_name LIKE \'%${pName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `qb.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `qb.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY qb.qc_berverage_id DESC " : `WHERE ${querywhere} ORDER BY qb.qc_berverage_id DESC `;
  //console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCPB', querywhere);
  return result;

};


const completeQCPB = async (qcpb, qcpbr) =>{
  let sql1 = 'updateQCPB';
  let sql2 = 'insertBevTestResult';
  let updatedRows = 0;  // 수정된 수(검사완료처리)
  let successNum = 0;   // 등록된 수 (불량품처리)

  //검사 완료 처리
  for (let item of qcpb) {
    let { qcProcessId, processNum, inspecResult} = item;

    // '검사번호', 공정바디번호,  합격수, 불합격수
    let result = await mysql.query(sql1, [qcProcessId, processNum, inspecResult]);
    if (result[0][0].result == 'Success') {
      updatedRows++;
    }
  }

  //불량 등록 처리
  for (let item of qcpbr) {
    let { qcProcessId, detailsId, itemId, actualValue, isPassed } = item;
    let result = await mysql.query(sql2, [qcProcessId, detailsId, itemId, actualValue, isPassed]);
    console.log(result);
    // 영향을 받은 행 수를 확인
    if (result.affectedRows > 0) {
      successNum++;
    }
  }
  //수정된 행수, 불량품내역 추가된 수 return
  return { 'updatedRows': updatedRows, 'defectNum': successNum / 5 };


}
const findBevTestResult = async () => {
  let sql = 'selectBevTestResult';
  let list = await mysql.query(sql);
  return list;
};








///////////////////////////////////////////////////////////////////////////
//포장검사조회(공통 - 전체, 선택 조회 모두 포함)
const findQCPP  = async(status, pName, startDate, endDate)=>{

  let searchList = [];

  if (status != undefined && status != null && status != '') {
    let search = `qcpp.inspec_status LIKE \'%${status}%\'`;
    searchList.push(search);
  }

  if (pName != undefined && pName != null && pName != '') {
    let search = `b.product_name LIKE \'%${pName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `qcpp.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `qcpp.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY qcpp.qc_packing_id DESC " : `WHERE ${querywhere} ORDER BY qcpp.qc_packing_id DESC `;
  //console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCPP', querywhere);
  return result;

};

// 포장검사 완료 처리
const completeQCPP = async (qcpp, qcppr) =>{
  let sql1 = 'updateQCPP';
  let sql2 = 'insertQCPPR';
  let updatedRows = 0;  // 수정된 수(검사완료처리)
  let successNum = 0;   // 등록된 수 (불량품처리)

  //검사 완료 처리
  for (let item of qcpp) {
    let { qcProcessId, processNum, passQnt,  rjcQnt} = item;

    // '검사번호', 공정바디번호,  합격수, 불합격수
    let result = await mysql.query(sql1, [qcProcessId, processNum, passQnt, rjcQnt]);
    if (result[0][0].result == 'Success') {
      updatedRows++;
    }
  }

  //불량 등록 처리
  for (let item of qcppr) {
    let { qcProcessId, faultyCode, qty } = item;

    let result = await mysql.query(sql2, [qcProcessId, faultyCode, qty]);
    if (result[0][0].result == 'Success!') {
      successNum++;
    }
  }
  //수정된 행수, 불량품내역 추가된 수 return
  return { 'updatedRows': updatedRows, 'defectNum': successNum };

}

//포장검사조회(공통 - 전체, 선택 조회 모두 포함)
const findQCPPR  = async(pName, startDate, endDate)=>{

  let searchList = [];


  if (pName != undefined && pName != null && pName != '') {
    let search = `b.product_name LIKE \'%${pName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `qp.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `qp.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY qpr.packing_rjc_id DESC " : `WHERE ${querywhere} ORDER BY qpr.packing_rjc_id DESC `;
  //console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCPPR', querywhere);
  return result;

};



module.exports = {
  findMeterialOrder,
  findMeterialAllOrder,
  requestInspectionForM,
  findAllRequestForQCM,
  findRequestForQCM,
  completeQCM,
  findFaultyCodeOneToFive,
  findQCMRecordAll,
  findQCMRecord,
  findQCMFaultyAll,
  findQCMFaulty,

  findQCPC,
  findFaultyCodeQCPC,
  completeQCPC,
  findQCPCR,


  loadTestDetails,
  findQCPB,
  completeQCPB,
  findBevTestResult,


  findQCPP,

  completeQCPP,
  findQCPPR,

};