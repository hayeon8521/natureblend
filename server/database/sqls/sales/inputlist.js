//창고조회(사용가능 + 위치 물류)
const getUseWarehouse = 
`SELECT warehouse_code
	  ,warehouse_name
FROM warehouse
WHERE storage = '가능'
AND warehouse_location LIKE '%물류%'`;

//제품명, 통과일자 날짜 받아서 통과 결과 출력 
const getQtResult = 
`SELECT q.qc_packing_id
	   ,w.product_code
       ,p.product_name
       ,q.process_num
       ,q.pass_qnt
       ,q.inspec_end
FROM process_work_body w  LEFT JOIN qc_packaging q
                          ON q.process_num = w.process_num
                          LEFT JOIN product p
                          ON w.product_code = p.product_code
WHERE q.qc_packing_id NOT IN (SELECT qc_packing_id FROM input_body)
AND q.inspec_status = '검사완료' `;

//제품 입고 
/*DELIMITER //
CREATE PROCEDURE inputProduct
(
IN v_product_code_json_array TEXT,
IN v_process_num_json_array TEXT,
IN v_input_amount_json_array TEXT,
IN v_qc_packing_id_json_array TEXT,
IN v_inspect_end_json_array TEXT,
IN v_warehouse_code_json_array TEXT,

IN v_emp_num int
)
BEGIN
-- DECLARE v_emp_num INT; 
DECLARE v_expiration_date_array TEXT;

DECLARE v_change_num INT;
DECLARE v_result_value INT;
DECLARE v_last_num INT;
DECLARE i INT DEFAULT 1;

DECLARE qc_packing_id_array_length INT;

DECLARE qc_packing_id_value TEXT;
DECLARE product_code_value TEXT;
DECLARE process_num_value TEXT;
DECLARE input_amount_value TEXT;
DECLARE inspect_end_value TEXT;
DECLARE warehouse_code_value TEXT;

DECLARE expiration_date_value TEXT;

    -- 트렌젝션 시작
    START TRANSACTION;
-- 사원번호 (사원이름)
-- SELECT emp_num
-- INTO v_emp_num
-- FROM employee
-- WHERE name = v_emp_name
-- LIMIT 1;

-- 입고 헤더 추가 input_header
INSERT INTO input_header (emp_num)
VALUES (v_emp_num);

-- 입고헤더 등록 후 변화한 값 
SET v_change_num = ROW_COUNT();

SELECT v_change_num;

	IF v_change_num = 1 THEN 
		-- 마지막 입고헤더 번호 가져오기
		SELECT inputlist_num
		INTO v_last_num
		FROM input_header
		ORDER BY inputlist_num desc
		limit 1;

		SET qc_packing_id_array_length = JSON_LENGTH(v_qc_packing_id_json_array);
		WHILE i <= qc_packing_id_array_length DO
			SET product_code_value = JSON_UNQUOTE(JSON_EXTRACT(v_product_code_json_array, CONCAT('$[', i - 1, ']')));
			SET process_num_value = JSON_UNQUOTE(JSON_EXTRACT(v_process_num_json_array, CONCAT('$[', i - 1, ']')));
			SET input_amount_value = JSON_UNQUOTE(JSON_EXTRACT(v_input_amount_json_array, CONCAT('$[', i - 1, ']')));
			SET qc_packing_id_value = JSON_UNQUOTE(JSON_EXTRACT(v_qc_packing_id_json_array, CONCAT('$[', i - 1, ']')));
			SET inspect_end_value = JSON_UNQUOTE(JSON_EXTRACT(v_inspect_end_json_array, CONCAT('$[', i - 1, ']')));
            SET warehouse_code_value = JSON_UNQUOTE(JSON_EXTRACT(v_warehouse_code_json_array, CONCAT('$[', i - 1, ']')));

		-- 각 product 의 expiration_date 구하기 
		SELECT expiration_date
		INTO expiration_date_value
		FROM product
		WHERE product_code = product_code_value
		LIMIT 1;
        
        -- 입고테이블(input_body) 등록
        INSERT INTO input_body
						(product_code
                        ,product_lot
                        ,input_amount
                        ,warehouse_code
                        ,qc_packing_id
                        ,expire_date
                        ,inputlist_num)
		VALUES (product_code_value
				,CONCAT(product_code_value,DATE_FORMAT(inspect_end_value,'%d%m%y'),process_num_value)
                ,input_amount_value
                , warehouse_code_value
                , qc_packing_id_value
                ,ADDDATE(inspect_end_value,expiration_date_value)
                ,v_last_num );
                
				SET v_result_value = ROW_COUNT();
					IF v_result_value != 1 THEN 
						-- 오류 발생 시 롤백
						rollback;
					END IF;
				SET i = i + 1;
		END WHILE;
		-- 문제없을때
		COMMIT;
		ELSE
		-- 입고 등록 실패 시 롤백
			ROLLBACK;
   END IF;
END//
DELIMITER ;
CALL inputProduct(
    '["P001", "P002", "P003"]',    -- v_product_code_json_array
    '["001", "002", "003"]',       -- v_process_num_json_array
    '["1500", "1500", "1500"]',       -- v_input_amount_json_array
    '["QCM2412210001", "QCM2412210004", "QCM2412210006"]', -- v_qc_packing_id_json_array
    '["2024-12-24", "2024-12-20", "2024-12-23"]', -- v_inspect_end_json_array
    '김사원',                    -- v_emp_name (사원이름)
    '["W005","W005","W005"]'                        -- v_warehouse_code (창고코드)
);*/ 
const insertProduct = 
`CALL inputProduct(?, ?, ?, ?, ?, ?, ? )`;


//입고기록조회 
const inputRecord = 
`SELECT ib.product_code
	   ,ib.input_amount
	   ,p.product_name
       ,ib.product_lot
       ,w.warehouse_name
       ,e.name
       ,ih.input_date
FROM input_body ib  JOIN product p 
                    ON ib.product_code = p.product_code
                   JOIN warehouse w 
                   ON ib.warehouse_code = w.warehouse_code
				   JOIN input_header ih
                   ON ib.inputlist_num = ih.inputlist_num
                   JOIN employee e
                   ON ih.emp_num = e.emp_num
WHERE ib.input_flag = 0
AND ib.dispose_flag = 0 `;

//수정을 원하는 입고 건이 출고가 되었는지 유무 체크
/**SELECT COUNT(*)
FROM input_body i JOIN output o 
ON i.input_num = o.input_num
WHERE i.product_lot = 'LOT20241221001';

DELIMITER //
CREATE PROCEDURE checkLotOutput
(
IN v_product_lot_json_array TEXT
)
BEGIN
DECLARE product_lot_array_length INT;
DECLARE v_sum_count  INT DEFAULT 0; 
DECLARE v_counts INT DEFAULT 0; 
DECLARE i INT DEFAULT 1;
DECLARE product_lot_value TEXT;

  -- 트렌젝션 시작
    START TRANSACTION;
SET product_lot_array_length = JSON_LENGTH(v_product_lot_json_array);

	-- product_lot 길이 만큼 for문 돌아서  i.input_num = o.input_num 값 수 체크 하기
		WHILE i <= product_lot_array_length DO
		SET product_lot_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_lot_json_array , CONCAT('$[', i - 1, ']')));
        
        SELECT COUNT(*)
		INTO  v_counts
		FROM input_body i JOIN output o 
		ON i.input_num = o.input_num
		WHERE i.product_lot = product_lot_value;
        
		-- 누적 합 업데이트
        SET v_sum_count = v_sum_count + v_counts;

        -- 반복문 인덱스 증가
        SET i = i + 1;
    END WHILE;

    -- 결과 출력
    SELECT v_sum_count AS total_output_count;

END//
DELIMITER ;
    
    CALL checkLotOutput('["LOT20241221001", "LOT20241221002", "LOT20241221003"]'); */
const checkLotOutput = 
`CALL checkLotOutput(?) `;

//입고수정 
/*DELIMITER //
CREATE PROCEDURE inputUpdate
(
IN v_product_lot_json_array TEXT,
IN v_warehouse_name_json_array TEXT 
)
BEGIN
DECLARE product_lot_array_length INT;

DECLARE product_lot_value TEXT;
DECLARE warehouse_name_value TEXT;


DECLARE warehouse_code_value TEXT;

DECLARE i INT DEFAULT 1;
DECLARE v_change_num INT;

    -- 트렌젝션 시작
    START TRANSACTION;
SET product_lot_array_length = JSON_LENGTH(v_product_lot_json_array);

-- product_lot 길이 만큼 for문 돌아서 업데이트 작업 하기
	WHILE i <= product_lot_array_length DO
		SET product_lot_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_lot_json_array , CONCAT('$[', i - 1, ']')));
		SET warehouse_name_value   = JSON_UNQUOTE(JSON_EXTRACT(v_warehouse_name_json_array  , CONCAT('$[', i - 1, ']')));
        
-- 창고이름으로 창고 번호 가져오기 
SELECT warehouse_code
INTO warehouse_code_value
FROM warehouse
WHERE warehouse_name = warehouse_name_value
LIMIT 1;

-- 창고코드 업데이트 
UPDATE input_body
SET warehouse_code = warehouse_code_value
WHERE product_lot = product_lot_value;

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

CALL inputUpdate ('["LOT20241221001","LOT20241221002"]','["제품창고4","제품창고5"]');*/

const inputUpdate = 
`CALL inputUpdate (?, ? )`;

//입고건삭제처리 
/**DELIMITER //
CREATE PROCEDURE deleteUpdate
(
IN v_product_lot_json_array TEXT
)
BEGIN
DECLARE product_lot_array_length INT;

DECLARE product_lot_value TEXT;


DECLARE i INT DEFAULT 1;
DECLARE v_change_num INT;

    -- 트렌젝션 시작
    START TRANSACTION;
SET product_lot_array_length = JSON_LENGTH(v_product_lot_json_array);

-- product_lot 길이 만큼 for문 돌아서 업데이트 작업 하기
	WHILE i <= product_lot_array_length DO
		SET product_lot_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_lot_json_array , CONCAT('$[', i - 1, ']')));

--  input_flag 업데이트 취소된 경우 1로 설정 
UPDATE input_body
SET input_flag = 1
WHERE product_lot = product_lot_value;

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

CALL deleteUpdate ('["LOT20241221001","LOT20241221002"]'); */
const deleteInput = 
`CALL deleteUpdate (? )`;

// 제품별 재고 조회 (유효한입고 , 유효한 출고, 폐기된양, 입고취소된양 , 전체 재고)
const productNum = 
`
SELECT 
    p.product_code,
    p.product_name, 

    -- 유효한 입고량
    COALESCE(SUM(CASE 
                    WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN i.input_amount 
                    ELSE 0 
                END), 0) AS valid_input_amount,

    -- 유효한 출고량
    COALESCE(SUM(CASE 
                    WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN COALESCE(oa.total_output_amount, 0) 
                    ELSE 0 
                END), 0) AS valid_output_amount,

    -- 폐기된 양
    COALESCE(SUM(CASE 
                    WHEN i.dispose_flag = 1 THEN COALESCE(i.input_amount, 0) 
                    ELSE 0 
                END), 0) AS disposed_amount,

    -- 입고 취소된 양
    COALESCE(SUM(CASE 
                    WHEN i.input_flag = 1 THEN COALESCE(i.input_amount, 0) 
                    ELSE 0 
                END), 0) AS canceled_amount,

    -- 전체 재고량
    COALESCE(
        (SUM(CASE 
                WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN i.input_amount 
                ELSE 0 
            END) 
         - 
         SUM(CASE 
                WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN COALESCE(oa.total_output_amount, 0) 
                ELSE 0 
            END)
        ), 0) AS stock_amount
FROM 
    product p
LEFT JOIN input_body i
ON p.product_code = i.product_code
LEFT JOIN (
    SELECT 
        input_num,
        SUM(output_amount) AS total_output_amount
    FROM output
    GROUP BY input_num
) AS oa
ON i.input_num = oa.input_num
`;
//버전문제
// `WITH output_aggregated AS (
//     SELECT 
//         input_num,
//         SUM(output_amount) AS total_output_amount
//     FROM output
//     GROUP BY input_num
// )
// SELECT 
//     p.product_code,
//     p.product_name, 

//     NVL(SUM(CASE 
//                 WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN i.input_amount 
//                 ELSE 0 
//             END), 0) AS valid_input_amount,


//     NVL(SUM(CASE 
//                 WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN NVL(oa.total_output_amount, 0) 
//                 ELSE 0 
//             END), 0) AS valid_output_amount,

   
//     NVL(SUM(CASE 
//                 WHEN i.dispose_flag = 1 THEN NVL(i.input_amount,0) 
//                 ELSE 0 
//             END), 0) AS disposed_amount,

//     NVL(SUM(CASE 
//                 WHEN i.input_flag = 1 THEN NVL(i.input_amount,0) 
//                 ELSE 0 
//             END), 0) AS canceled_amount,

  
//     NVL(
//         (SUM(CASE 
//                 WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN i.input_amount 
//                 ELSE 0 
//             END) 
//          - 
//          SUM(CASE 
//                 WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN NVL(oa.total_output_amount, 0) 
//                 ELSE 0 
//             END)
//         ), 0) AS stock_amount
// FROM 
//     product p
// LEFT JOIN input_body i
// ON p.product_code = i.product_code
// LEFT JOIN output_aggregated oa
// ON i.input_num = oa.input_num `;


//lot별 재고 조회 (재고상태, 유통기한 필터)
const lotNum =
`
SELECT 
    ib.product_lot,
    ib.product_code,
    p.product_name,
    COALESCE(SUM(ib.input_amount), 0) - COALESCE(SUM(o.total_output_amount), 0) AS product_quantity,
    w.warehouse_name,
    qp.inspec_end AS manufacturing_date,
    ib.expire_date,
    status.product_status
FROM 
    input_body ib 
LEFT JOIN (
    SELECT
        input_num,
        SUM(output_amount) AS total_output_amount
    FROM output
    GROUP BY input_num
) AS o
ON ib.input_num = o.input_num
LEFT JOIN warehouse w
ON ib.warehouse_code = w.warehouse_code
LEFT JOIN qc_packaging qp
ON ib.qc_packing_id = qp.qc_packing_id
LEFT JOIN product p
ON ib.product_code = p.product_code
LEFT JOIN (
    SELECT 
        ib_inner.input_num,
        CASE 
            WHEN COALESCE(SUM(ib_inner.input_amount), 0) - COALESCE(SUM(o_inner.total_output_amount), 0) <= 0 THEN '소진'
            WHEN ib_inner.dispose_flag = 1 THEN '폐기'
            WHEN ib_inner.input_flag = 1 THEN '취소'
            ELSE '보관'
        END AS product_status
    FROM 
        input_body ib_inner
    LEFT JOIN (
        SELECT
            input_num,
            SUM(output_amount) AS total_output_amount
        FROM output
        GROUP BY input_num
    ) AS o_inner
    ON ib_inner.input_num = o_inner.input_num
    GROUP BY 
        ib_inner.input_num,
        ib_inner.dispose_flag,
        ib_inner.input_flag
) AS status
ON ib.input_num = status.input_num
`;


//버전문제
// `WITH output_aggregated AS (
// 	SELECT
// 		input_num,
//         SUM(output_amount) AS total_output_amount
// 	FROM output
//     GROUP BY input_num
// )
// SELECT 
//     ib.product_lot,
//     ib.product_code,
//     p.product_name,
//     NVL(SUM(ib.input_amount), 0) - IFNULL(SUM(o.total_output_amount), 0) AS product_quantity,
//     w.warehouse_name,
//     qp.inspec_end AS manufacturing_date,
//     ib.expire_date,
//     status.product_status
// FROM 
//     input_body ib LEFT JOIN output_aggregated o
//                   ON ib.input_num = o.input_num
// 				  LEFT JOIN warehouse w
//                   ON ib.warehouse_code = w.warehouse_code
// 				  LEFT JOIN qc_packaging qp
//                   ON ib.qc_packing_id = qp.qc_packing_id
// 				  LEFT JOIN product p
//                   ON ib.product_code = p.product_code
//                   LEFT JOIN  (
//                                     SELECT 
//                                         ib_inner.input_num,
//                                         CASE 
//                                         WHEN NVL(SUM(ib_inner.input_amount), 0) - IFNULL(SUM(o.total_output_amount), 0) <= 0 THEN '소진'
//                                         WHEN ib_inner.dispose_flag = 1 THEN '폐기'
//                                         WHEN ib_inner.input_flag = 1 THEN '취소'
//                                         ELSE '보관'
//                                         END AS product_status
//                                     FROM 
//                                         input_body ib_inner
//                                     LEFT JOIN output_aggregated o
//                                         ON ib_inner.input_num = o.input_num
//                                     GROUP BY 
//                                         ib_inner.input_num,
//                                         ib_inner.dispose_flag,
//                                         ib_inner.input_flag
//                                 ) STATUS
//                   ON ib.input_num = status.input_num `;





//service에서 조건에 맞게 쿼리 가져오기
/**WHERE ib.expire_date >='2025-01-01' 
AND ib.expire_date <='2025-08-01' -- 유통기한 범위
AND status.product_status IN ('보관') -- 상태 조건 (다중 필터링)
GROUP BY 
    ib.product_lot, 
    ib.product_code, 
    p.product_name, 
    w.warehouse_name, 
    qp.inspec_end, 
    ib.expire_date, 
    status.product_status
ORDER BY 
    ib.expire_date; */

//유통기한 지난거 폐기처리
const disposeLot =
`UPDATE input_body
SET dispose_flag = 1
WHERE product_lot = ?`;

//제품클릭시 제품의 lot 출력 
const productLot = 
`
SELECT 
    ib.product_lot,
    ib.product_code,
    p.product_name,
    COALESCE(SUM(ib.input_amount), 0) - COALESCE(SUM(o.total_output_amount), 0) AS product_quantity,
    w.warehouse_name,
    qp.inspec_end AS manufacturing_date,
    ib.expire_date,
    status.product_status
FROM 
    input_body ib 
LEFT JOIN (
    SELECT
        input_num,
        SUM(output_amount) AS total_output_amount
    FROM output
    GROUP BY input_num
) AS o
ON ib.input_num = o.input_num
LEFT JOIN warehouse w
ON ib.warehouse_code = w.warehouse_code
LEFT JOIN qc_packaging qp
ON ib.qc_packing_id = qp.qc_packing_id
LEFT JOIN product p
ON ib.product_code = p.product_code
LEFT JOIN (
    SELECT 
        ib_inner.input_num,
        CASE
            WHEN COALESCE(SUM(ib_inner.input_amount), 0) - COALESCE(SUM(o_inner.total_output_amount), 0) <= 0 THEN '소진'
            WHEN ib_inner.dispose_flag = 1 THEN '폐기'
            WHEN ib_inner.input_flag = 1 THEN '취소'
            ELSE '보관'
        END AS product_status
    FROM 
        input_body ib_inner
    LEFT JOIN (
        SELECT
            input_num,
            SUM(output_amount) AS total_output_amount
        FROM output
        GROUP BY input_num
    ) AS o_inner
    ON ib_inner.input_num = o_inner.input_num
    GROUP BY 
        ib_inner.input_num,
        ib_inner.dispose_flag,
        ib_inner.input_flag
) AS status
ON ib.input_num = status.input_num
WHERE p.product_code = ?
GROUP BY 
    ib.product_lot, 
    ib.product_code, 
    p.product_name, 
    w.warehouse_name, 
    qp.inspec_end, 
    ib.expire_date, 
    status.product_status
ORDER BY 
    CASE 
        WHEN status.product_status = '보관' THEN 1
        ELSE 2
    END,
    ib.expire_date
`;
//버전문제
// `WITH output_aggregated AS (
// 	SELECT
// 		input_num,
//         SUM(output_amount) AS total_output_amount
// 	FROM output
//     GROUP BY input_num
// )
// SELECT 
//     ib.product_lot,
//     ib.product_code,
//     p.product_name,
//     NVL(SUM(ib.input_amount), 0) - IFNULL(SUM(o.total_output_amount), 0) AS product_quantity,
//     w.warehouse_name,
//     qp.inspec_end AS manufacturing_date,
//     ib.expire_date,
//     status.product_status
// FROM 
//     input_body ib LEFT JOIN output_aggregated o
//                   ON ib.input_num = o.input_num
// 				  LEFT JOIN warehouse w
//                   ON ib.warehouse_code = w.warehouse_code
// 				  LEFT JOIN qc_packaging qp
//                   ON ib.qc_packing_id = qp.qc_packing_id
// 				  LEFT JOIN product p
//                   ON ib.product_code = p.product_code
//                   LEFT JOIN  (
//                                     SELECT 
//                                         ib_inner.input_num,
//                                         CASE
//                                         WHEN NVL(SUM(ib_inner.input_amount), 0) - IFNULL(SUM(o.total_output_amount), 0) <= 0 THEN '소진'
//                                         WHEN ib_inner.dispose_flag = 1 THEN '폐기'
//                                         WHEN ib_inner.input_flag = 1 THEN '취소'
//                                         ELSE '보관'
//                                         END AS product_status
//                                     FROM 
//                                         input_body ib_inner
//                                      LEFT JOIN output_aggregated o
//                                         ON ib_inner.input_num = o.input_num
//                                     GROUP BY 
//                                         ib_inner.input_num,
//                                         ib_inner.dispose_flag,
//                                         ib_inner.input_flag
//                                 ) STATUS
//                   ON ib.input_num = status.input_num
// WHERE p.product_code = ?
// GROUP BY 
//     ib.product_lot, 
//     ib.product_code, 
//     p.product_name, 
//     w.warehouse_name, 
//     qp.inspec_end, 
//     ib.expire_date, 
//     status.product_status
// ORDER BY 
//     CASE 
//         WHEN status.product_status = '보관' THEN 1
//         ELSE 2
//     END,
//     ib.expire_date`;


module.exports = {
    getUseWarehouse,
    getQtResult,
    insertProduct,
    inputRecord,
	checkLotOutput,
	inputUpdate,
	deleteInput,

	productNum,
    lotNum,
    disposeLot,
    productLot,
}