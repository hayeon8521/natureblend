const mysql = require('../database/mapper.js');

// 로그인
const loginInfo = async( empnum,password ) => {
    let result = await mysql.query('loginCheck',[empnum,password]);
    return result;
}

module.exports = {
    loginInfo,
}  