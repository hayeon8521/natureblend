const mysql = require('../../database/mapper.js');
//반품코드 조회
const getReturnList = async()=>{
    let list = await mysql.query('getReturn');
    return list;
}

//반품등록
const createReturn = async(returnInfo)=>{
    let result = await mysql.query('returnlistInsert',returnInfo);
    return result;
}

//반품리스트출력(필터)
const getReturnSearch = async (clientName, startDate, endDate)=>{
    let searchList = [];

    if(clientName  != undefined && clientName != null && clientName != ''){
        let search = `c.com_name LIKE \'%${clientName.com_name}%\'`;
        searchList.push(search);
      }

      if(startDate  != undefined && startDate != null && startDate != ''){
        let search = `r.return_date >= \'${startDate}\'`;
        searchList.push(search);
      }
    
      if(endDate  != undefined && endDate != null && endDate != ''){
        let search = `r.return_date <= \'${endDate}\'`;
        searchList.push(search);
      }

      
        // 조건을 기반으로 WHERE절 최종 구성
        let querywhere = '';
        for(let i = 0 ; i < searchList.length; i++){
          let search  = searchList[i];
          querywhere+= (i == 0 ? ` `:`AND `) + search;  
        };
      
        querywhere = searchList.length == 0 ? `ORDER BY r.return_date` : `WHERE ${querywhere} ORDER BY r.return_date`;
        console.log('selected Query', querywhere);
      
        let result = await mysql.query('returnSearch',querywhere);
        return result;

}

//반품수정 
const updateReturnInfo = async(updateReturnInfo)=>{
    let datas = Object.values(updateReturnInfo);

    let result = await mysql.query('updateReturn',datas);
    let sendData = {};

    if(result.changeRows !== 0){
        sendData.result = true;
      }else{
        sendData.result = false;
      }
      return sendData;
}

//반품삭제 
const deleteReturnInfo = async(deleteReturnInfo)=>{
    let datas = Object.values(deleteReturnInfo);
    console.log("datas==",datas)
    let result = await mysql.query('returnlistsDelete',datas);
    console.log("result== ",result)
    let sendData = {};

    if(result.affectedRows !== 0){
        sendData.result = true;
      }else{
        sendData.result = false;
      }
      return sendData;

}





module.exports = {
    getReturnList,
    createReturn,
    getReturnSearch,
    updateReturnInfo,
    deleteReturnInfo,
}