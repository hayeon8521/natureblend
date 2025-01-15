// 설비 쿼리문

// 설비 목록
const machineList = `
SELECT machine_num,
       m.process_code,
       process_name,
       model_num,
       machine_type,
       machine_name,
       machine_location,
       machine_state,
       buy_date
FROM machine m JOIN process p
               ON (m.process_code = p.process_code)
ORDER BY machine_num
`;

// 설비 상세 정보 -> client_num의 경우 기준정보 거래처 제작 상황에 따라 변경 예정(거래처 이름과 같은 설비 등록에서 직접 입력한 데이터)
const machineInfo = `
SELECT machine_num,
       machine_name,
       machine_location,
       machine_img,
       model_num,
       machine_type,
       machine_state,
       m.emp_num,
       e.name,
       m.client_num,
       c.com_name,
       buy_date,
       uph,
       upd,
       m.process_code
FROM machine m JOIN process p
               ON (m.process_code = p.process_code)
               JOIN employee e
               ON (m.emp_num = e.emp_num)
               JOIN client c
               ON (m.client_num = c.client_num)
WHERE machine_num = ?
`;
// 설비 생산 정보 -> success_qty 체크는 나중에 is_inspected(검사 여부) 체크로 변경
const machinePrdInfo = `
SELECT SUM(success_qty) AS success_sum,
       SUM(fail_qty) AS fail_sum,
       SUM(TIMESTAMPDIFF(HOUR, partial_process_start_time, partial_process_end_time)) AS hour_sum
FROM process_work_body
WHERE machine_num = ?
  AND success_qty IS NOT NULL
`;
// 설비 부품 정보
const machinePartList = `
SELECT part_num
FROM machine_part
WHERE machine_num = ?
ORDER BY replace_date
`;


// 설비 등록
const machineInsert = `
INSERT INTO machine 
SET ?
`;

// 설비 분류 검색
const typeList = `
SELECT process_code,
       machine_type
FROM process
`;

// 설비 수정
const machineUpdate = `
UPDATE machine
SET ?
WHERE machine_num = ?
`;

// 설비 삭제
const machineDelete = `
DELETE FROM machine
WHERE machine_num = ?
`;

// 설비 검색 조회
const searchMachineList = `
SELECT machine_num,
       m.process_code,
       process_name,
       model_num,
       machine_type,
       machine_name,
       machine_location,
       machine_state,
       buy_date
FROM machine m JOIN process p
               ON (m.process_code = p.process_code) 
`;

//거래처조회 
const clientList = 
`SELECT com_name,
		client_num
FROM client
WHERE trade='구매'
ORDER BY com_name`;

module.exports = {
  machineList,
  machineInsert,
  typeList,
  machineInfo,
  machinePrdInfo,
  machinePartList,
  machineUpdate,
  machineDelete,
  searchMachineList,
  clientList,

}