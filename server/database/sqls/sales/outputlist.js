//주문서 검색 조회
const outputOrderlist = 
`SELECT o.orderlist_num,
		o.orderlist_title,
		o.order_date,
		o.due_date,
		o.orderlist_status,
		e.name, 
		c.com_name
FROM orderlists o LEFT JOIN employee e 
ON  o.emp_num = e.emp_num
                  LEFT JOIN client c
ON o.client_num = c.client_num 
WHERE o.orderlist_status != 'done' `;
// WHERE 
// (o.orderlist_status LIKE ? OR ? IS NULL)
// AND (o.orderlist_title LIKE ? OR ? IS NULL)
// AND (c.com_name LIKE ? OR ? IS NULL)
// AND (o.order_date >= ? OR ? IS NULL)
// AND (o.order_date <= ? OR ? IS NULL)`;

//미출고된 주문 조회
const disoutputOrder = 
`
SELECT 
    o.order_num,
    p.product_code,
    p.product_name,
    o.order_amount,
    COALESCE(os.total_output_amount, 0) AS output_amount,
    o.order_amount - COALESCE(os.total_output_amount, 0) AS disorder_amount,
    o.order_status
FROM orders o
LEFT JOIN product p 
    ON o.product_code = p.product_code
LEFT JOIN (
    SELECT 
        order_num,
        SUM(output_amount) AS total_output_amount
    FROM output
    GROUP BY order_num
) AS os
    ON o.order_num = os.order_num
WHERE o.orderlist_num = ?
  AND o.order_status != 'shipped'
`;
//버전문제
// `WITH output_summary AS (
//     SELECT 
//         order_num,
//         SUM(output_amount) AS total_output_amount
//     FROM output
//     GROUP BY order_num
// )
// SELECT 
//     o.order_num,
//     p.product_code,
//     p.product_name,
//     o.order_amount,
//     NVL(os.total_output_amount, 0) AS output_amount,
//     o.order_amount - NVL(os.total_output_amount, 0) AS disorder_amount,
//     o.order_status 
// FROM orders o
// LEFT JOIN product p 
//     ON o.product_code = p.product_code
// LEFT JOIN output_summary os
//     ON o.order_num = os.order_num
// WHERE o.orderlist_num = ?
//   AND o.order_status != 'shipped' `;

//제품별 lot 조회
const getLotBaseProduct =
`
SELECT 
    b.product_lot,
    b.input_amount - COALESCE(o.total_output_amount, 0) AS total_amount,
    q.inspec_end
FROM input_body b
LEFT JOIN (
    SELECT
        input_num,
        SUM(output_amount) AS total_output_amount
    FROM output
    GROUP BY input_num
) AS o
ON b.input_num = o.input_num
LEFT JOIN qc_packaging q
ON b.qc_packing_id = q.qc_packing_id
WHERE b.product_code = ?
  AND b.input_amount - COALESCE(o.total_output_amount, 0) != 0
  AND b.input_flag = 0
  AND b.dispose_flag = 0
ORDER BY b.expire_date
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
//       b.product_lot
// 	  ,b.input_amount - IFNULL(o.total_output_amount,0) AS total_amount
//       ,q.inspec_end
// FROM input_body b LEFT JOIN output_aggregated o
//                   ON b.input_num = o.input_num
//                   LEFT JOIN qc_packaging q
//                   ON b.qc_packing_id = q.qc_packing_id
// WHERE b.product_code = ?
// AND b.input_amount - NVL(o.total_output_amount, 0) != 0
// AND b.input_flag = 0
// AND b.dispose_flag = 0
// order by b.expire_date`;


// 출고 등록 및 주문서와 주문 상태 변화

/*DELIMITER //
CREATE PROCEDURE outputProduct
(
IN v_product_lot_json_array TEXT,
IN v_output_amount_json_array TEXT,
IN v_order_num INT,
IN v_com_name VARCHAR(30),
IN v_emp_name VARCHAR(30)
)
BEGIN
DECLARE product_lot_array_length INT;
DECLARE product_lot_value TEXT;
DECLARE i INT DEFAULT 1;


DECLARE v_com_num INT;
DECLARE v_emp_num INT;
DECLARE output_amount_value TEXT;
DECLARE v_product_code VARCHAR(30);
DECLARE input_num_value TEXT;
DECLARE v_result_value INT;

    -- 트렌젝션 시작
    START TRANSACTION;

-- 회사번호 (회사이름)
SELECT client_num
INTO v_com_num
FROM client
WHERE com_name = v_com_name
GROUP BY client_num
LIMIT 1;

-- 사원번호 (사원이름)
SELECT emp_num
INTO v_emp_num
FROM employee
WHERE name = v_emp_name
GROUP BY emp_num
LIMIT 1;

SET product_lot_array_length = JSON_LENGTH(v_product_lot_json_array);
WHILE i <= product_lot_array_length DO
	SET product_lot_value = JSON_UNQUOTE(JSON_EXTRACT(v_product_lot_json_array, CONCAT('$[', i - 1, ']')));
    SET output_amount_value = JSON_UNQUOTE(JSON_EXTRACT(v_output_amount_json_array, CONCAT('$[', i - 1, ']')));
   
-- 제품코드  
SELECT product_code , input_num
INTO v_product_code , input_num_value
FROM input_body
WHERE product_lot = product_lot_value
LIMIT 1;

-- 출고테이블 추가 
INSERT INTO output
				(client_num
                ,product_code
                ,output_amount
                ,input_num
                ,order_num
                ,emp_num)
VALUES (v_com_num
	   ,v_product_code
       ,output_amount_value
       ,input_num_value
       ,v_order_num
       ,v_emp_num);
	SET v_result_value = ROW_COUNT();
			IF v_result_value != 1 THEN 
				-- 오류 발생 시 롤백
				rollback;
				
			END IF;
	SET i = i + 1;
END WHILE;
-- 주문번호 의 상태 업데이트 만약  order_amount = output_amount 경우 "shipped" , order_amount > output_amount 경우 "semiShipped" , output_amount 가 0이거나 null인 경우 "preparing" 
-- 주문 상태 업데이트
UPDATE orders
SET order_status = 
	CASE 
		WHEN order_amount = (
			SELECT SUM(output_amount)
			FROM output
			WHERE order_num = v_order_num
		) THEN 'shipped'
		WHEN order_amount > (
			SELECT SUM(output_amount)
			FROM output
			WHERE order_num = v_order_num
		) AND (
			SELECT SUM(output_amount)
			FROM output
			WHERE order_num = v_order_num
		) > 0 THEN 'semiShipped'
		ELSE 'preparing'
	END
WHERE order_num = v_order_num;
-- 주문 번호 업데이트 후 주문서 상태 업데이트 만약 주문서의 주문들 중 하나라도 shipped , semiShipped가 있는 경우 "continue"로 변경 , 주문 모두 shipped의 경우 "done"으로 변경  
-- 주문서 상태 업데이트

UPDATE orderlists ol
JOIN orders o ON o.orderlist_num = ol.orderlist_num
SET ol.orderlist_status = 
    CASE 
		WHEN (
				SELECT COUNT(*) 
				FROM orders 
				WHERE orderlist_num = ol.orderlist_num 
				  AND order_status != 'shipped'
			) = 0 THEN 'done'
        WHEN (
            SELECT COUNT(*) 
            FROM orders 
            WHERE orderlist_num = ol.orderlist_num 
              AND order_status IN ('shipped', 'semiShipped')
        ) > 0 THEN 'continue'
        ELSE ol.orderlist_status
    END
WHERE o.order_num = v_order_num;     

    -- 문제없을때
    COMMIT;

END//
DELIMITER ; CALL outputProduct(
    '["LOT20241221002", "LOT20241221001"]',  -- v_product_lot_json_array
    '[50, 50]',  -- v_output_amount_json_array
    13,  -- v_order_num
    '헤인유통',  -- v_com_name
    '정사원'   -- v_emp_name
);*/ 
const outputOrders = 
`CALL outputProduct(?, ?, ?, ?, ? )`;


// 필터조건에 맞게 출고 조회
const outputListSearch = 
`SELECT op.output_num
	  ,ol.orderlist_title
      ,c.com_name
      ,op.product_code
      ,p.product_name
      ,ib.product_lot
      ,op.output_amount
      ,op.output_date
FROM output op JOIN orders o
				ON op.order_num = o.order_num
                JOIN orderlists ol
				ON o.orderlist_num = ol.orderlist_num
                JOIN product p 
                ON op.product_code = p.product_code
                JOIN input_body ib
                ON op.input_num = ib.input_num
                JOIN client c 
                ON op.client_num = c.client_num `;
/**WHERE c.com_name = ?
AND p.product_name = ?
AND ol.orderlist_title = ?
AND op.output_date <= ? 
AND op.output_date >= ?
ORDER BY op.output_date; */

module.exports = {
    outputOrderlist,
	disoutputOrder,
	getLotBaseProduct,
	outputOrders,
	outputListSearch,
}