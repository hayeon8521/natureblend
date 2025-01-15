// 정비 서비스
const mariadb = require('../../database/mapper.js');

// 요청 리스트
const findAllRequests = async ()=>{
  let list = await mariadb.query('requestList');
  return list;
}

// 완료 리스트
const findAllCompletes = async ()=>{
  let list = await mariadb.query('completeList');
  return list;
}

// 정비 상세 내역
const getMaintenanceInfo = async (no) => {
    let list = await mariadb.query('maintenanceInfo', [no]);
    let info = list[0];
    return info;
}

// 등록
const createNewRequest = async (requestInfo)=>{
  let result = await mariadb.query('requestInsert', requestInfo);
  if( result.insertId > 0){
    return { maintenance_num : result.insertId }; 
  }else{
    return {};
  }
}

// 수정
const updateMaintenanceInfo = async (no, updateInfo) => {
  let datas = [updateInfo, no];
  let result = await mariadb.query('maintenanceUpdate', datas);
  let sendData = {};
  if(result.affectedRows == 1){
    sendData.target = { 'maintenance_no' : no };
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

module.exports = {
  findAllRequests,
  findAllCompletes,
  getMaintenanceInfo,
  createNewRequest,
  updateMaintenanceInfo,

};




