// 부품

// 사용 가능 부품 리스트
const partList = `
SELECT part_num
       , part_name
       , machine_type
       , client_num
       , replace_cycle
       , buy_date
FROM machine_part
WHERE machine_num IS NULL
`;

// 부품 상세 정보
const partInfo = `
SELECT part_num
       , part_name
       , replace_date
       , replace_cycle
       , part_location
       , buy_date
       , machine_type
       , client_num
FROM machine_part
WHERE part_num = ?
`;

// 등록
const partInsert = `
INSERT INTO machine_part
SET ?
`;

// 수정
const partUpdate = `
UPDATE machine_part
SET ?
WHERE part_num = ?
`;

// 삭제
const partDelete = `
DELETE FROM machine_part
WHERE part_num = ?
`;

// 부품 교체?
const changePartList = `
SELECT part_num
       , part_name
       , machine_type
FROM machine_part
WHERE machine_type like ?
AND machine_num IS NULL
`



module.exports = {
  partList,
  partInfo,
  partInsert,
  partUpdate,
  partDelete,
  changePartList,

}
