const express = require('express');
const router = express.Router();
const empService = require('../service/emp_service.js');

// 전체조회
router.get('/employees', async (req, res)=>{
  let employeeList = await empService.findAllEmployees();
  res.send(employeeList);
});

module.exports = router;