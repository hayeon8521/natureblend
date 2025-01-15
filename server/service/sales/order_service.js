const mysql = require('../../database/mapper.js');
//주문서 
//판매 거래처 전체 조회 
const getClientList = async ()=>{
    let list = await mysql.query('clientlist');
    return list;
}
// 검색 기준 전체조회
const getOrderList = async (orderStatus, orderName, clientName, startDate, endDate)=>{
/*
    let querywhere = "";
    if(orderStatus == undefined){
        querywhere += `o.orderlist_status LIKE ${orderStatus}`;
    }
    
                    
    querywhere += `AND (o.orderlist_title LIKE ${orderName}`;
                    AND (c.com_name LIKE ${clientName} OR  ${clientName} IS NULL)
                    AND (o.order_date >= ${startDate} OR ${startDate} IS NULL)
                    AND (o.order_date <= ${endDate} OR ${endDate} IS NULL) `
    let result = await mysql.query('orderListInfo',querywhere);
    return result;
    console.log(querywhere);
    */
   let searchList = [];
   if(orderStatus != undefined && Object.keys(orderStatus).length > 0){
    let search = `o.orderlist_status IN (`;  
    for (let key in orderStatus) {        
        search += (key == '0' ? ' ' : ', ') + `\'${orderStatus[key]}\'`;   
    }
    search += ' )';
    searchList.push(search);
   }

  if(orderName  != undefined && orderName != null && orderName != ''){
    let search = `o.orderlist_title LIKE \'%${orderName}%\'`;
    searchList.push(search);
  }
  console.log("회사명:",clientName)
  if(clientName  != undefined && clientName != null && clientName != ''){
    let search = `c.com_name LIKE \'%${clientName.com_name}%\'`;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `o.order_date >= \'${startDate}\'`;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `o.order_date <= \'${endDate}\'`;
    searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? `ORDER BY o.due_date` : `WHERE ${querywhere} ORDER BY o.due_date`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('orderListInfo',querywhere);
  return result;
}


//영업사원 전체 조회
const getEmpList = async ()=> {
  let list = await mysql.query('orderEmployees');
  return list;
}

//전체 제품코드, 이름 조회
const getProductList = async()=>{
  let list = await mysql.query('orderProduct');
  return list;
}


//주문서, 주문 등록
const addOrder = async(orderInfo)=>{
  let result = await mysql.query('orderListInsert',Object.values(orderInfo));
  return { message: result[0][0].result }
}

//주문상세보기 (다수의 주문)
const getOrderInfo = async(no)=>{
  let list = await mysql.query('orderInfo',[no]);
  return list;
}

//주문수정_추가주문처리 
const updateAddOrder = async(orderInfo)=>{
  let result = await mysql.query('updateAddOrder',Object.values(orderInfo));
  // 결과가 배열일 경우 처리(여러값인 경우 )
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

//주문,주문서수정
const updateOrderInfo = async (no,updateOrder)=>{
  let datas = [Number(no), ... Object.values(updateOrder)];
  console.log(datas);
  let result = await mysql.query('updateOrder',datas);
  let sendData = {}; //값을 보내준 후 결과 값 
  console.log("결과:",result);

  if(result.changeRows == 1){
    sendData.target = {'orderlist_num' : no};
    sendData.result = true;
  }else {
    sendData.result = false;
  }
  return sendData;

}

//주문,주문서 삭제
const delOrderlist = async(orderlistNum)=>{
  console.log(orderlistNum, "타입:",typeof orderlistNum);
  let result = await mysql.query('orderListDelete',Number(orderlistNum));
  console.log(result);
  if(result.affecteRows != 0 ){
    return {"result" : "success","orderlistNum": orderlistNum};
  }else{
    return {"result" : "fail"};
  }
}

//출고된주문검색 
const getShippedOrder = async(no)=>{
  let list = await mysql.query('shippedOrder',[no]);
  return list;
}

//주문삭제 
const deleteOrderInfo = async(deleteOrder)=>{
  let datas = Object.values(deleteOrder);
  console.log("서비스데이터==",datas);
  let result = await mysql.query('deleteOrders',datas);
  let sendData = {};
  if(result.changeRows !== 0){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}
module.exports = {
    getClientList,
    getOrderList,
    getEmpList,
    getProductList,
    addOrder,
    getOrderInfo,
    updateAddOrder,
    updateOrderInfo,
    delOrderlist,
    getShippedOrder,
    deleteOrderInfo,
}