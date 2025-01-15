const loginCheck = 
`SELECT *
 FROM employee
 WHERE emp_num = ?
 and date_format(birth, '%Y%m%d') = ?`;




module.exports = {
    loginCheck,
}