const mysql = require('../../database/mapper.js');


//자재 발주 리스트 조회 ( 조건문 넣어서 )
const configLoding = async (materialCode, clientName, POListCode, startDate, endDate, materialState)=>{
    let searchList = [];
  
    if(materialState != undefined && Object.keys(materialState).length > 0){
      let search = `mob.material_state IN (`;  
      for (let key in materialState) {        
          search += (key == '0' ? ' ' : ', ') + `\'${materialState[key]}\'`;   
      }
      search += ' )';
      searchList.push(search);
     }

     searchList.push(` mob.order_code NOT IN (SELECT order_code FROM qc_material) `);
    
    // 조건을 기반으로 WHERE절 최종 구성
    let querywhere = '';
    for(let i = 0 ; i < searchList.length; i++){
      let search  = searchList[i];
      querywhere+= (i == 0 ? ` `:` AND `) + search;  
    };
    querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
    querywhere += ` ORDER BY order_code DESC, mob.body_num DESC `;
    console.log('selected Query', querywhere);
  
    let result = await mysql.query('configloding',querywhere);
    return result;
  }


  //자재검사중
const findQCMRecord2 = async (mName, startDate, endDate, qcState) => {
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
    let querywhere = '';
    for (let i = 0; i < searchList.length; i++) {
      let search = searchList[i];
      querywhere += (i == 0 ? ` ` : `AND `) + search;
    };
    querywhere = searchList.length == 0 ? "ORDER BY q.qc_material_id DESC" : `WHERE ${querywhere} ORDER BY q.qc_material_id DESC`;
    console.log('selected Query', querywhere);
  
    let result = await mysql.query('selectQCMRWithConditions2', querywhere);
    return result;
  }

//자재 입고해야할 목록(자재입고대기)
const materialInputQcList2 = async ()=>{
    let list = await mysql.query('material_input_qc_list2');
    return list;
}

//생산 지시 목록
const processlist = async ()=>{
    let list = await mysql.query('processlist');
    return list;
}

//착즙 공정
const process1list = async ()=>{
    let list = await mysql.query('process1list');
    return list;
}

//착즙 공정 품질
const process1qclist = async ()=>{
  let list = await mysql.query('process1qclist');
  return list;
}

//세척 공정
const process2list = async ()=>{
  let list = await mysql.query('process2list');
  return list;
}

//세척 공정 품질
const process2qclist = async ()=>{
let list = await mysql.query('process2qclist');
return list;
}

//포장 공정
const process3list = async ()=>{
  let list = await mysql.query('process3list');
  return list;
}

//포장 공정 품질
const process3qclist = async ()=>{
  let list = await mysql.query('process3qclist');
  return list;
  }


// 제품 입고 대기
const product_input_wait = async ()=>{
  let list = await mysql.query('product_input_wait');
  return list;
}

// 제품 출고 대기
const produce_out_wait = async ()=>{
  let list = await mysql.query('produce_out_wait');
  return list;
}

// 제품 재고
const product_qtying = async ()=>{
  let list = await mysql.query('product_qtying');
  return list;
}

// 자재 재고
const material_qtying = async ()=>{
  let list = await mysql.query('material_qtying');
  return list;
}

module.exports = {
    configLoding,
    findQCMRecord2,
    materialInputQcList2,
    processlist,
    process1list,
    process1qclist,
    process2list,
    process2qclist,
    process3list,
    process3qclist,
    product_input_wait,
    produce_out_wait,
    product_qtying,
    material_qtying,

};