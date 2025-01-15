const mariadb = require('../../database/mapper.js');

// 사용 가능한 부품 조회
const findAllParts = async ()=>{
  let list = await mariadb.query('partList');
  return list;
}

// 부품 상세 정보
const findPartInfo = async (no) => {
  let list = await mariadb.query('partInfo', [no]);
  let info = list[0];
  return info;
}

// 등록
const createNewPart = async (partInfo)=>{
  let result = await mariadb.query('partInsert', partInfo);
  if( result.insertId > 0){
    return { part_num : result.insertId }; 
  }else{
    return {};
  }
}

// 부품 수정
const updatePartInfo = async (no, updateInfo) => {
  let datas = [updateInfo, no];
  let result = await mariadb.query('partUpdate', datas);
  let sendData = {};
  if(result.affectedRows == 1){
    sendData.target = { 'part_no' : no };
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

// 삭제
const delPartInfo = async (pno) => {
  let result = await mariadb.query('partDelete', [pno]);
  if(result.affectedRows == 1) {
    return { "result" : "success" };
  } else {
    return { "result" : "fail" };
  }
}

// 교체 가능한 부품 목록
const findChangeParts = async (mType) => {
  let code = '%' + mType + '%';
  let list = await mariadb.query('changePartList', [code]);
  return list;
}


module.exports = {
  findAllParts,
  findPartInfo,
  createNewPart,
  updatePartInfo,
  delPartInfo,
  findChangeParts,

};