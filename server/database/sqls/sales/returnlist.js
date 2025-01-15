// 반품코드, 이유 조회
const getReturn =
`SELECT return_code,
		 return_reason
FROM return_code`;

//반품등록 
const returnlistInsert = 
`INSERT INTO returnlists
SET ? `;

//반품기록 조회 
const returnSearch = 
`SELECT r.returnlist_num  -- 반품코드 (returnlists)
	   ,o.output_num  -- 출고코드 (output)
       ,c.com_name -- 거래처명 (client)
       ,i.product_lot -- 제품lot번호 ( input_body)
       ,i.product_code -- 제품코드 (input_body)
       ,p.product_name -- 제품명 ( product)
       ,o.output_amount -- 출고량(output)
       ,r.return_num -- 반품량(returnlists)
       ,e.name -- 담당자(employee)
       ,r.return_date -- 반품날짜(returnlists)
       ,rc.return_reason -- 반품사유 (retrun_code)
       ,r.return_code -- 반품코드(return_code)
FROM returnlists r  JOIN output o
					ON r.output_num = o.output_num
					JOIN client c 
                    ON r.client_num = c.client_num
                    JOIN product p 
                    ON r.product_code = p.product_code
                    JOIN employee e 
                    ON r.emp_num = e.emp_num
                    JOIN return_code rc
                    ON r.return_code = rc.return_code
                    JOIN input_body i
                    ON o.input_num = i.input_num `;
// WHERE c.com_name = ?
// AND r.return_date >= ?
// AND r.return_date <= ?
// ORDER BY r.return_date;

//반품수정 
/**DELIMITER //
CREATE PROCEDURE returnUpdate
(
IN v_returnlist_num_json_array TEXT,
IN v_return_num_json_array TEXT,
IN v_return_code_json_array TEXT 
)
BEGIN
DECLARE returnlist_num_array_length INT;

DECLARE returnlist_num_value TEXT;
DECLARE return_num_value TEXT;
DECLARE return_code_value TEXT;


DECLARE i INT DEFAULT 1;
DECLARE v_change_num INT;

    -- 트렌젝션 시작
    START TRANSACTION;
SET returnlist_num_array_length = JSON_LENGTH(v_returnlist_num_json_array);

-- returnlist_num 길이 만큼 for문 돌아서 업데이트 작업 하기
	WHILE i <= returnlist_num_array_length DO
		SET returnlist_num_value  = JSON_UNQUOTE(JSON_EXTRACT(v_returnlist_num_json_array , CONCAT('$[', i - 1, ']')));
		SET return_num_value   = JSON_UNQUOTE(JSON_EXTRACT(v_return_num_json_array  , CONCAT('$[', i - 1, ']')));
        SET return_code_value   = JSON_UNQUOTE(JSON_EXTRACT(v_return_code_json_array  , CONCAT('$[', i - 1, ']')));
        

-- 반품량,반품코드 업데이트 
UPDATE returnlists
SET return_num = return_num_value ,
	return_code = return_code_value 
WHERE returnlist_num  = returnlist_num_value;

		SET v_change_num = ROW_COUNT();
		IF v_change_num = 0 THEN 
			-- 오류 발생 시 롤백
			rollback;
		END IF;
		SET i = i + 1;
	END WHILE;
    -- 문제없을때
    COMMIT;

    -- 문제있을때
    ROLLBACK;

END//
DELIMITER ;

CALL returnUpdate ('[1,2]','[5,2]','["RC003","RC005"]'); */
const updateReturn = 
`CALL returnUpdate(?, ?, ? )`;

//반품 삭제 
/**DELIMITER //
CREATE PROCEDURE returnDelete
(
IN v_returnlist_num_json_array TEXT

)
BEGIN
DECLARE returnlist_num_array_length INT;

DECLARE returnlist_num_value TEXT;


DECLARE i INT DEFAULT 1;
DECLARE v_change_num INT;

    -- 트렌젝션 시작
    START TRANSACTION;
SET returnlist_num_array_length = JSON_LENGTH(v_returnlist_num_json_array);

-- returnlist_num 길이 만큼 for문 돌아서 업데이트 작업 하기
	WHILE i <= returnlist_num_array_length DO
		SET returnlist_num_value  = JSON_UNQUOTE(JSON_EXTRACT(v_returnlist_num_json_array , CONCAT('$[', i - 1, ']')));
		

-- 반품  삭제
DELETE FROM returnlists
WHERE returnlist_num  = returnlist_num_value;

		SET v_change_num = ROW_COUNT();
		IF v_change_num = 0 THEN 
			-- 오류 발생 시 롤백
			rollback;
		END IF;
		SET i = i + 1;
	END WHILE;
    -- 문제없을때
    COMMIT;

    -- 문제있을때
    ROLLBACK;

END//
DELIMITER ;

CALL returnDelete('[3,2]'); */
const returnlistsDelete = 
`CALL returnDelete(? )`;

module.exports ={
    getReturn,
    returnlistInsert,
    returnSearch,
    updateReturn,
    returnlistsDelete
}