const mysql = require('../database/mapper.js');

// 전체조회
const findAllEmployees = async ()=>{
  let list = await mysql.query('employeeList');
  return list;
}

module.exports = {
  findAllEmployees,

};