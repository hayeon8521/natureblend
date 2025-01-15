const boards = require('./sqls/boards.js');
const comments = require('./sqls/comments.js');
const books = require('./sqls/books.js');
const emp = require('./sqls/emp.js')

// 영업
const orderlist = require('./sqls/sales/orderlist.js');
const outputlist = require('./sqls/sales/outputlist.js');
const inputlist = require('./sqls/sales/inputlist.js')
const returnlist = require('./sqls/sales/returnlist.js');

// 자재
const material = require('./sqls/material/material.js');
const material2 = require('./sqls/material/material2.js'); //공정흐름도

// 생산
const productionPlan = require('./sqls/production/productionPlan');
const productionOrder = require('./sqls/production/productionOrder');
const productionWork = require('./sqls/production/productionWork');

// 품질
const quality = require('./sqls/quality.js');

// 설비
const machine = require('./sqls/machine/machine.js');
const inactivity = require('./sqls/machine/inactivity.js');
const maintenance = require('./sqls/machine/maintenance.js');
const part = require('./sqls/machine/part.js');

// 기준정보
const bomlist = require('./sqls/standard/bomlist.js');
const processflow = require('./sqls/standard/processflow.js');
const loginquery = require('./sqls/standard/loginquery.js');

module.exports = {
  ...boards,
  ...comments,
  ...books,
  ...emp,

  // 영업
  ...orderlist,
  ...outputlist,
  ...inputlist,
  ...returnlist,

  // 자재
  ...material,
  ...material2,

  // 생산
  ...productionPlan,
  ...productionOrder,
  ...productionWork,

  // 품질
  ...quality,

  // 설비
  ...machine,
  ...inactivity,
  ...maintenance,
  ...part,

  // 기준정보
  ...bomlist,
  ...processflow,
  ...loginquery,
}