const mariadb = require('mariadb/callback');
const sqlList = require('./sql.js');

const connectionPool = mariadb.createPool({
  host : process.env.MYSQL_HOST,
  port : process.env.MYSQL_PORT,
  user : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD,
  database : process.env.MYSQL_DB,
  connectionLimit : process.env.MYSQL_LIMIT,
  multipleStatements: true, // 다중 결과 집합 허용
  trace : true, //log
  logger: {
    query: (msg) => console.info(msg),
    error: (err) => console.error(err),
  },
  permitSetMultiParamEntries : true, //parameter가 객체일 경우 escape 작업
  insertIdAsNumber : true,           //insertId를 Number 타입으로
  bigIntAsNumber : true,             //bigInt를 자동으로 Number 타입으로
});
//where 절 있는 경우 where 절 string으로 sql 에 넘긴다. 해당 타입이 string이고 공백이 아닌 경우 값을 sql로 values 보내고 아닌 경우 공백 
const query = (alias, values)=>{
  return new Promise((resolve, reject)=>{
    let executeSql = sqlList[alias] + (typeof values === 'string' && values !== '' ? values : '');
    connectionPool.query(executeSql, values, (err, results)=>{
      if(err) {
        reject({err});
      }else{
        resolve(results);
      }
    });
  })
  .catch(err => console.log(err));
};


// const query = async (alias, values) => {
//   let executeSql = sqlList[alias]
//   console.log('executeSql', executeSql)
//   let conn
//   try{
//     conn = await connectionPool.getConnection()
//     return await conn.query(executeSql, values)
//   }catch(err){
//     throw err
//   }finally{
//     if(conn) await conn.release()
//   }
// }

module.exports = {
  query
}