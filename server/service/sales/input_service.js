const mysql = require('../../database/mapper.js');

const getWarehouse = async ()=>{
    let list = await mysql.query('getUseWarehouse');
    return list;
}

// 품질검사필터 조회 
const getQtList = async(productCode, startDate,endDate)=>{
    let qtList = [];
    if(productCode  != undefined && productCode != null && productCode != ''){
        let search = `w.product_code LIKE \'${productCode}\'`;
        qtList.push(search);
    }

    if(startDate  != undefined && startDate != null && startDate != ''){
        let search = `q.inspec_end >= \'${startDate}\'`;
        qtList.push(search);
      }
    
    if(endDate  != undefined && endDate != null && endDate != ''){
        let search = `q.inspec_end <= \'${endDate}\'`;
        qtList.push(search);
      }

      // 조건을 기반으로 WHERE절 최종 구성
        let querywhere = '';
        for(let i = 0 ; i < qtList.length; i++){
          let search  = qtList[i];
          querywhere+= `AND ` + search;  
        };
      
        querywhere = qtList.length == 0 ? `ORDER BY q.inspec_end` : ` ${querywhere} ORDER BY q.inspec_end`;
        console.log('selected Query', querywhere);
      
        let result = await mysql.query('getQtResult',querywhere);
        return result;
    
}
//제품입고등록 
const addInput = async(inputInfo)=>{
  let datas = [ ...Object.values(inputInfo)];
  console.log("service의 데이터:",datas);
  let result = await mysql.query('insertProduct',datas);
  console.log("서비스 결과:",result);
  if (Array.isArray(result) && result[0] && result[0][0]) {
    return { message: result[0][0].result };
  } 
  // 배열이 아닐 경우 처리
  else if (result && result.result) {
    return { message: result.result };
  } else {
    // 결과가 없을 경우
    return {};
  }

}

//입고리스트조회(필터)
// 품질검사필터 조회 
const inputLists = async(productCode, startDate,endDate)=>{
  let inputList = [];
  if(productCode  != undefined && productCode != null && productCode != ''){
      let search = `ib.product_code LIKE \'${productCode}\'`;
      inputList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
      let search = `ih.input_date >= \'${startDate}\'`;
      inputList.push(search);
    }
  
  if(endDate  != undefined && endDate != null && endDate != ''){
      let search = `ih.input_date <= \'${endDate}\'`;
      inputList.push(search);
    }

    // 조건을 기반으로 WHERE절 최종 구성
      let querywhere = '';
      for(let i = 0 ; i < inputList.length; i++){
        let search  = inputList[i];
        querywhere+=(i == 0 ? ` `:`AND `) + search;  
      };
    
      querywhere = inputList.length == 0 ? "" : `WHERE ${querywhere}`;
      querywhere += `ORDER BY ih.input_date`
      console.log('selected Query', querywhere);
    
      let result = await mysql.query('inputRecord',querywhere);
      return result;
  
}

//입고수정을 원하는 값들이 출고가 된 적 있는지 체크 (사용안함)
// const checkLotOutput = async(deleteInfo)=>{
//   let result = await mysql.query('checkLotOutput',Object.values(deleteInfo));
//   return result;
// }

// 입고건 수정 
const updateInputInfo = async(updateInputInfo)=>{
  let datas = Object.values(updateInputInfo);
  console.log("서비스에서의 수정데이터:",datas);

  let result = await mysql.query('inputUpdate',datas);
  let sendData = {};

  if(result.changeRows !== 0){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

//입고 건 삭제
const deleteInputInfo = async(deleteInfo)=>{
  let datas = Object.values(deleteInfo);
  console.log(datas);
  let result = await mysql.query('deleteInput',datas);
  let sendData = {};
  if(result.changeRows !== 0){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}


//제품번호로 재고 조회 (제품)
const getInventoryProduct = async(productCode)=>{
  let searchList = [];
  if(productCode != undefined && Object.keys(productCode).length > 0 ){
    let search = `p.product_code = \'${productCode}\'`;
    console.log("쿼리:",search);
    searchList.push(search);
  }

   // 조건을 기반으로 WHERE절 최종 구성
   let querywhere = '';
   for(let i = 0 ; i < searchList.length; i++){
     let search  = searchList[i];
     querywhere+= search;  
   }; 
   querywhere = searchList.length == 0 ? `GROUP BY p.product_code, p.product_name` : `WHERE ${querywhere} GROUP BY p.product_code, p.product_name`;
   
   console.log('selected Query=',querywhere);

   let result = await mysql.query('productNum',querywhere);
   return result;
}

// 제품 상태, 유통기한 범위로 lot 재고 조회 
const getInventoryLot = async(productStatus,startDate,endDate)=>{
  let searchList = [];
  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `ib.expire_date >= \'${startDate}\'`;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `ib.expire_date <= \'${endDate}\'`;
    searchList.push(search);
  }
  if(productStatus != undefined && Object.keys(productStatus).length > 0){
  let search = `status.product_status IN (`;  
  for (let key in productStatus) {        
      search += (key == '0' ? ' ' : ', ') + `\'${productStatus[key]}\'`;   
  }
   // "소진" 상태 추가
   if (productStatus["소진"] === "소진") {
    search += `, '소진'`;
  }
  search += ' )';
  searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? 
   `GROUP BY 
      ib.product_lot, 
      ib.product_code, 
      p.product_name, 
      w.warehouse_name, 
      qp.inspec_end, 
      ib.expire_date, 
      status.product_status
    ORDER BY 
      ib.expire_date` 
    : `WHERE ${querywhere}
      GROUP BY 
        ib.product_lot, 
        ib.product_code, 
        p.product_name, 
        w.warehouse_name, 
        qp.inspec_end, 
        ib.expire_date, 
        status.product_status
      ORDER BY 
        ib.expire_date`;
    console.log('selected Query', querywhere);
  
    let result = await mysql.query('lotNum',querywhere);
    return result;
}
//제품폐기처리
const disposeLot = async(disposeLot)=>{
  let datas = Object.values(disposeLot);
  let result = await mysql.query('disposeLot',datas);
  let sendData = {};

  if(result.changeRows !== 0){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

//제품번호로 lot 조회
const getProductLotInfo = async(no)=>{
  let list = await mysql.query('productLot',[no]);
  return list;
}





module.exports = {
    getWarehouse,
    getQtList,
    addInput,
    inputLists,
    updateInputInfo,
    deleteInputInfo,

    
    getInventoryProduct,
    getInventoryLot,
    disposeLot,
    getProductLotInfo,

}