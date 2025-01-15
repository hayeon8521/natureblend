const mariadb = require('../../database/mapper.js');

// 전체조회
const findAllMachines = async () => {
  let list = await mariadb.query('machineList');
  return list;
}

// 설비 상세 정보
const findMachineInfo = async (no) => {
  let list = await mariadb.query('machineInfo', [no]);
  let info = list[0];
  return info;
}
// 설비 생산 정보 
const findMachinePrdInfo = async (no) => {
  let list = await mariadb.query('machinePrdInfo', [no]);
  let info = list[0];
  return info;
}
// 설비 부품 정보
const findMachinePartList = async (no) => {
  let list = await mariadb.query('machinePartList', [no]);
  return list;
}


// 설비 등록
const createNewMachine = async (machineInfo) => {
  let result = await mariadb.query('machineInsert', machineInfo);
  if( result.insertId > 0){
    return { machine_num : result.insertId }; 
  }else{
    return {};
  }
}

// 설비 수정
const updateMachineInfo = async (no, updateInfo) => {
  let datas = [updateInfo, no];
  let result = await mariadb.query('machineUpdate', datas);
  let sendData = {};
  if(result.affectedRows == 1){
    sendData.target = { 'machine_no' : no };
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

// 설비 삭제
const delMachineInfo = async (mno) => {
  let result = await mariadb.query('machineDelete', [mno]);
  if(result.affectedRows == 1) {
    return { "result" : "success" };
  } else {
    return { "result" : "fail" };
  }
}

// 설비 분류 검색
const findMachineType = async () => {
  let list = await mariadb.query('typeList');
  return list;
}

// 설비 검색 리스트
const searchMachineList = async (machine_state, process_code, selectSearchType, searchData) => {
  let searchList = [];
  if(machine_state != undefined && machine_state != null && machine_state != '') {
    let search = `machine_state = '${machine_state}'`;
    searchList.push(search);
  }
  if(process_code != undefined && Object.keys(process_code).length > 0) {
    let search = `m.process_code IN (`;  
    for (let key in process_code) {        
      search += (key == '0' ? ' ' : ', ') + `\'${process_code[key]}\'`;   
    }
    search += ' )';
    searchList.push(search);
  }
  if(selectSearchType != undefined && selectSearchType != null && selectSearchType != '' &&
     searchData != undefined && searchData != null && searchData != ''
  ) {
      if(selectSearchType != 'all') {
        let search = `${selectSearchType} LIKE \'%${searchData}%\'`;
        searchList.push(search);
      } else {
        let search = `(process_name LIKE \'%${searchData}%\' OR 
                      model_num LIKE \'%${searchData}%\' OR 
                      machine_name LIKE \'%${searchData}%\')`;
        searchList.push(search);
      }
      
  }

  // WHERE 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  console.log('selected Query', querywhere);

  let result = await mariadb.query('searchMachineList', querywhere);
  return result;
}

const getClientList = async ()=>{
  let list = await mariadb.query('clientList');
  return list;
}

module.exports = {
  findAllMachines,
  createNewMachine,
  findMachineType,
  findMachineInfo,
  findMachinePrdInfo,
  findMachinePartList,
  updateMachineInfo,
  searchMachineList,
  delMachineInfo,
  getClientList,
};