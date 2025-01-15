//require('dotenv').config({ path : './database/mysql.env'});

const express = require('express');
const app = express();
//const boardRouter = require('./router/board_router.js');
const practiceRouter = require('./router/practice_router.js');

// 미들웨어
app.use(express.json()); // application/json

app.use(express.urlencoded({ extended : false})) // application/x-form-urlencoded

// 라우터 등록
//app.use('/', boardRouter);
app.use('/', practiceRouter);

app.listen(3000, ()=>{
  console.log('Server Start');
  console.log('http://localhost:3000');
})

// 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome!!');
})