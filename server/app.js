require('dotenv').config({ path : './database/mysql.env'});
const express = require('express');
const app = express();
const boardRouter = require('./router/board_router.js');
const bookRouter = require('./router/book_router.js');
const empRouter = require('./router/emp_router.js');

const path = require('path');
const history = require("connect-history-api-fallback");

// 영업
const salesRouter = require('./router/sales/order_router.js');
const outputRouter = require('./router/sales/output_router.js');
const inputRouter = require('./router/sales/input_router.js');
const returnRouter = require('./router/sales/return_router.js');
// 자재
const materialRouter = require('./router/material/material_router.js');
const materialRouter2 = require('./router/material/material_router2.js');  //공정흐름도

// 생산
const productionPlanRouter = require('./router/production/plan_router');
const productionOrderRouter = require('./router/production/order_router');
const productionWorkRouter = require('./router/production/work_router');

// 품질
const qualityRouter = require('./router/qc_router.js');

// 설비
const machineRouter = require('./router/machine/machine_router.js');
const inactRouter = require('./router/machine/inact_router.js');
const maintenanceRouter = require('./router/machine/maintenance_router.js')
const partRouter = require('./router/machine/part_router.js')

// 기준정보
const standardRouter = require('./router/standard_router.js');
const loginRouter = require('./router/login_router.js');

// 미들웨어
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended : false}));


// 새로고침 수정
app.set("port", process.env.PORT || 3000);

app.use(history()); //라우터보다 먼저 실행되야함

//정적 경로 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


// 라우터 등록
app.use('/api', boardRouter);
app.use('/api', bookRouter);
app.use('/api', empRouter);

// 영업 라우터
app.use('/api', salesRouter);
app.use('/api', outputRouter);
app.use('/api', inputRouter);
app.use('/api', returnRouter);

// 자재 라우터
app.use('/api', materialRouter);
app.use('/api', materialRouter2);  // 공정 흐름도

// 생산 라우터
app.use('/api/production/plan', productionPlanRouter);
app.use('/api/production/order', productionOrderRouter);
app.use('/api/production/work', productionWorkRouter);

// 품질 라우터
app.use('/api', qualityRouter);

// 설비 라우터
app.use('/api/machine', machineRouter);
app.use('/api/inActs', inactRouter);
app.use('/api/maintenances', maintenanceRouter);
app.use('/api/parts', partRouter);


// 기준정보 라우터
app.use('/api', standardRouter);
app.use('/api', loginRouter);


app.listen(3000, ()=>{
  console.log('Server Start');
  console.log('http://localhost:3000');
})


// 라우팅
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
})