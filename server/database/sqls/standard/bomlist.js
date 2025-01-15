const bomList = 
`SELECT bm.bom_seq,
        bm.bom_num,
        bm.material_code,
        bm.material,
        bm.material_con,
        b.product_code,
        b.product_name,
        b.capacity
 FROM bom_material bm join bom b
 on bm.bom_num = b.bom_num
 WHERE bm.bom_num = ?
 ORDER BY bm.bom_seq;`;
 
 // BOM 제품 리스트 조회
 const bomView = 
 `SELECT product_name,
 capacity,
 bom_num,
 product_code
 FROM bom
 order by product_code`;
 
 // BOM 조회 
 const bomselectView =
 `SELECT b.bom_num,
 b.product_name,
 b.capacity,
 b.product_code,
 bm.material_code,
 bm.material,
 bm.material_con
 FROM bom_material bm join bom b
 on bm.bom_num = b.bom_num
 WHERE bom_num = ?`;
 
 // bom등록
 const bomInsert =
 `INSERT INTO bom
 SET ?`;
 
 // 수정
 const bomUpdate =
 `UPDATE bom_material 
 SET ? 
 WHERE bom_seq = ? `;
 
 // 자재등록 , 수정할때 자재추가
 const bomAddInsert =
 `INSERT INTO bom_material
 SET ?` ;
 
 // 자재만 삭제 할때
 const materialDelete2 =
 `DELETE FROM bom_material
 WHERE bom_seq = ?`;
 
 // 삭제
 const materialDelete =
 `DELETE FROM bom_material
 WHERE bom_num = ?`;
 
 const bomDelete =
 `DELETE FROM bom
 WHERE bom_num = ?`;
 
 // 자재 목록 조회 code , name
 const materialSelect =
 `SELECT material_code,
 material_name
 FROM material`;

 // 제품제품제품제품제품제품제품제품제품제품제품제품
 // 제품 조회
const productSelect =
`SELECT product_code,
        product_name,
        capacity,
        expiration_date
 FROM product
 ORDER BY product_code DESC`;
 
 // 제품 등록
 const productInsert =
 `INSERT INTO product
values(?,?,?,?)`;

// 제품 삭제
const productDelete =
`DELETE FROM product
WHERE product_code = ?`;

// 제품 수정
const productUpdate =
`UPDATE product
 SET  product_name = ?,
      expiration_date = ?,
      capacity = ?
 WHERE product_code = ?`;

// 제품제품제품제품제품제품제품제품제품제품제품제품
// 자재자재자재자재자재자재자재자재자재자재자재자재
 // 자재 조회
const materialList =
`SELECT material_code,
       material_name,
       safety_inventory,
       expiration_date,
       DATE_FORMAT(regi_date, '%Y-%m-%d') AS regi_date
FROM material`;

 // 자재 등록
 const materialInsert =
  `INSERT INTO material
   values(?,?,?,?,sysdate())`;

 // 자재 수정
 const materialUpdate =
  `UPDATE material
   SET material_name = ?,
       safety_inventory = ?,
       expiration_date = ?
   WHERE material_code = ?`;
 // 자재 삭제
const materialDel =
`DELETE FROM material
WHERE material_code = ?`;
// 자재자재자재자재자재자재자재자재자재자재자재자재

// 공정기준정보공정기준정보공정기준정보공정기준정보
// 공정정보 조회
const processList =
`SELECT process_code,
        process_name,
        machine_type
 FROM process`;
 // 공정정보 등록
 const processInsert =
 `INSERT INTO process
  values(?,?,?)`;
 // 공정정보 수정
 const processUpdate =
 `UPDATE process
  SET process_name = ?,
      machine_type = ?
  WHERE process_code = ?`;
// 공정정보 삭제
const processDelete =
`DELETE FROM process
 WHERE process_code = ?`;
// 공정기준정보공정기준정보공정기준정보공정기준정보

// 사원사원사원사원사원사원사원사원사원사원사원사원
// 사원 조회
const employeeList =
`SELECT emp_num,
        name,
        DATE_FORMAT(birth, '%Y-%m-%d') AS birth,
        tel,
        job,
        job_num,
        position,
        DATE_FORMAT(employment_date, '%Y-%m-%d') AS employment_date,
        DATE_FORMAT(resignation_date, '%Y-%m-%d') AS resignation_date,
        level
 FROM employee
 order by emp_num desc`;
// 사원 삭제
const employeeDelete =
`DELETE FROM employee
 WHERE emp_num = ?`;
// 사원 등록 and 수정
const employeeInsert =
`INSERT INTO employee
 VALUES(?,?,?,?,?,?,?,?,?,?)
 ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  birth = VALUES(birth),
  tel = VALUES(tel),
  job = VALUES(job),
  job_num = VALUES(job_num),
  position = VALUES(position),
  employment_date = VALUES(employment_date),
  resignation_date = VALUES(resignation_date),
  level = VALUES(level)`;
// 사원사원사원사원사원사원사원사원사원사원사원사원
// 거래처거래처거래처거래처거래처거래처거래처거래처거래처
// 거래처 조회
const customerList =
`SELECT client_num,
        com_num,
        com_name,
        address,
        trade,
        boss,
        boss_tel,
        emp_name,
        emp_tel
FROM client`
// // 거래처 등록
// const customerInsert =
// `INSERT INTO client
//  VALUES(NULL,?,?,?,?,?,?,?,?)
//  ON DUPLICATE KEY UPDATE
//   com_num = VALUES(com_num),
//   com_name = VALUES(com_name),
//   address = VALUES(address),
//   trade = VALUES(trade),
//   boss = VALUES(boss),
//   boss_tel = VALUES(boss_tel),
//   emp_name = VALUES(emp_name),
//   emp_tel = VALUES(emp_tel)`;
 // 거래처 등록
 const customerInsert =
 `INSERT INTO client
  values(NULL,?,?,?,?,?,?,?,?)`;
 // 거래처 수정
 const customerUpdate =
 `UPDATE client
  SET com_num = ?,
      com_name = ?,
      address = ?,
      trade = ?,
      boss = ?,
      boss_tel = ?,
      emp_name = ?,
      emp_tel = ?
  WHERE client_num = ?`;
// 거래처 삭제
const customerDelete =
`DELETE FROM client
 WHERE client_num = ?`;
// 거래처거래처거래처거래처거래처거래처거래처거래처거래처
// 창고창고창고창고창고창고창고창고창고창고창고창고창고
// 창고 조회
const warehouseList =
`SELECT warehouse_code,
        warehouse_name,
        storage,
        warehouse_location,
        emp_name,
        emp_tel,
        warehouse_area
 FROM warehouse`

 // 창고 등록 , 수정
 const warehouseInsert =
`INSERT INTO warehouse
 VALUES(?,?,?,?,?,?,?)
 ON DUPLICATE KEY UPDATE
  warehouse_code = VALUES(warehouse_code),
  warehouse_name = VALUES(warehouse_name),
  storage = VALUES(storage),
  warehouse_location = VALUES(warehouse_location),
  emp_name = VALUES(emp_name),
  emp_tel = VALUES(emp_tel),
  warehouse_area = VALUES(warehouse_area)`;

 // 창고 삭제
 const warehouseDelete =
 `DELETE FROM warehouse
  WHERE warehouse_code = ?`
// 창고창고창고창고창고창고창고창고창고창고창고창고창고

// 불량코드 조회
const faultyList = 
`SELECT faulty_code,
        faulty_reason
 FROM faulty_code`;
// 불량코드 등록 , 수정
const faultyInsert = 
`INSERT INTO faulty_code
 VALUES(?,?)
 ON DUPLICATE KEY UPDATE
  faulty_code = VALUES(faulty_code),
  faulty_reason = VALUES(faulty_reason)`;
// 불량코드 삭제
const faultyDelete = 
`DELETE FROM faulty_code
 WHERE faulty_code = ?`;
// 반품코드 조회
const returnList = 
`SELECT return_code,
        return_reason
 FROM return_code`;
// 반품코드 등록 , 수정
const returnInsert = 
`INSERT INTO return_code
 VALUES(?,?)
 ON DUPLICATE KEY UPDATE
  return_code = VALUES(return_code),
  return_reason = VALUES(return_reason)`;
// 반품코드 삭제
const returnDelete = 
`DELETE FROM return_code
 WHERE return_code = ?`;
// 흐름도흐름도흐름도흐름도흐름도흐름도흐름도흐름도흐름도
// 공정흐름도 조회
const flowList =
`SELECT process_chart_num,
        product_code,
        process_code,
        process_sequence,
        process_name
 FROM process_chart
 WHERE product_code = ?
 ORDER BY process_sequence`;

// 공정흐름도 등록
const flowInsert = 
`SET @next_process_sequence := (SELECT IFNULL(MAX(process_sequence), 0) + 1 FROM process_chart WHERE product_code = ?);
INSERT INTO process_chart (product_code,process_code, process_sequence , process_name)
VALUES (?,  ?, @next_process_sequence, ?)`;

// 공정 순서 변경
const flowUpdate = 
`UPDATE process_chart 
    SET process_sequence = ?
    WHERE process_chart_num = ?`;
const flowNumList =
`SELECT process_chart_num
 FROM process_chart
 WHERE product_code = ?
 and process_sequence = ?`;
const beforeUpdate =
`UPDATE process_chart
 SET process_sequence = ?
 WHERE process_chart_num = ?`;

 // 흐름도 삭제
 const flowDelete = 
 `DELETE FROM process_chart
  WHERE process_chart_num = ?`;
 // 흐름도 삭제후 순서 조정

// 흐름도흐름도흐름도흐름도흐름도흐름도흐름도흐름도흐름도

// 로그인
// 아이디 체크
const idSelect =
`SELECT emp_num
 FROM employee
 WHERE emp_num = ?`;
// 비밀번호 체크
const pwSelect =``;
// 로그인
 module.exports = {
    bomList,
    bomView,
    bomInsert,
    bomDelete,
    bomUpdate,
    bomselectView,
    bomAddInsert,
    materialDelete,
    productSelect,
    materialDelete2,
    materialSelect,
    productInsert,
    productDelete,
    productUpdate,
    materialList,
    materialInsert,
    materialUpdate,
    materialDel,
    processList,
    processDelete,
    processInsert,
    processUpdate,
    employeeList,
    employeeDelete,
    employeeInsert,
    customerList,
    customerInsert,
    customerUpdate,
    customerDelete,
    warehouseList,
    warehouseInsert,
    warehouseDelete,
    faultyList,
    faultyInsert,
    faultyDelete,
    returnList,
    returnInsert,
    returnDelete,
    flowList,
    flowInsert,
    flowUpdate,
    flowNumList,
    beforeUpdate,
    flowDelete,
}