//주문서 

//전체조회 
const orderList =
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
ORDER BY 
	CASE 
		WHEN o.orderlist_status = 'update' THEN 1
		WHEN  o.orderlist_status = 'continue' THEN 2
		WHEN  o.orderlist_status = 'done' THEN 3
		ELSE 4
	END; `;

//거래처조회 
const clientlist = 
`SELECT com_name,
		client_num
FROM client
WHERE trade='판매'
ORDER BY com_name`;

//주문서 검색 조회
const orderListInfo = 
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
ON o.client_num = c.client_num `;
// WHERE 
// (o.orderlist_status LIKE ? OR ? IS NULL)
// AND (o.orderlist_title LIKE ? OR ? IS NULL)
// AND (c.com_name LIKE ? OR ? IS NULL)
// AND (o.order_date >= ? OR ? IS NULL)
// AND (o.order_date <= ? OR ? IS NULL)`;


// 주문서 등록 가능한 직원만: 영업부서 
const orderEmployees = 
` select name
		,emp_num
  from employee
  where job_num = 1`;

//제품이름, 코드 전체 출력 
const orderProduct =
`SELECT product_code,
       product_name
FROM product
ORDER BY product_code`;

//주문,주문서 등록 
/*DELIMITER //
CREATE PROCEDURE orderlistInput(
IN v_orderlist_title VARCHAR(50),
IN v_due_date DATETIME,
IN v_com_name VARCHAR(30),


IN v_product_code_json_array TEXT,
IN v_product_num_json_array TEXT,
IN v_per_price_json_array TEXT,
IN v_emp_name VARCHAR(30)
)

BEGIN
-- 변수 선언
DECLARE v_emp_num INT;
DECLARE v_com_num INT;
DECLARE v_last_num INT;
DECLARE v_change_num INT;
DECLARE v_result_value INT;

DECLARE i INT DEFAULT 1;
DECLARE product_code_array_length INT;
DECLARE product_code_value TEXT;
DECLARE product_num_value TEXT;
DECLARE per_price_value TEXT;


-- 트랜잭션 시작
START TRANSACTION;

-- JSON 배열 길이 계산
SET product_code_array_length = JSON_LENGTH(v_product_code_json_array);

-- 사원번호 (사원이름)
SELECT emp_num
INTO v_emp_num
FROM employee
WHERE name = v_emp_name
LIMIT 1;

-- 회사번호 (회사이름)
SELECT client_num
INTO v_com_num
FROM client
WHERE com_name = v_com_name
LIMIT 1;

-- 주문서 등록
INSERT INTO orderlists
		(orderlist_title,
        due_date,
        emp_num,
        client_num)
VALUES (v_orderlist_title,
	    v_due_date,
		v_emp_num,
		v_com_num);

-- 주문서 등록 후 변화한 값 
SET v_change_num = FOUND_ROWS();
        
SELECT v_change_num;

IF v_change_num = 1 THEN 
-- 마지막 주문서 번호 가져오기
SELECT orderlist_num
INTO v_last_num
FROM orderlists
ORDER BY orderlist_num desc
limit 1;

-- 반복으로  json 배열 요소 추출 
WHILE i <= product_code_array_length DO
	SET product_code_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_code_json_array , CONCAT('$[', i - 1, ']')));
    SET product_num_value   = JSON_UNQUOTE(JSON_EXTRACT(v_product_num_json_array  , CONCAT('$[', i - 1, ']')));
    SET per_price_value   = JSON_UNQUOTE(JSON_EXTRACT(v_per_price_json_array  , CONCAT('$[', i - 1, ']')));
	INSERT INTO orders 
			(order_amount,
			total_price,
			per_price,
			product_code,
			orderlist_num)
	VALUES (product_num_value,
			product_num_value*per_price_value,
			per_price_value,
			product_code_value,
			v_last_num);
		SET v_result_value = FOUND_ROWS();
			IF v_result_value != 1 THEN 
				-- 오류 발생 시 롤백
				rollback;
				
			END IF;
		SET i = i + 1;
	END WHILE;
    -- 트랜잭션 커밋
        COMMIT;
    ELSE
    -- 주문서 등록 실패 시 롤백
        ROLLBACK;
END IF;
END//
DELIMITER; */
// CALL orderlistInput('테스트 주문서','2024-12-31','대한유통','["P001", "P002"]','[10, 20]','[1000, 2000]','김사원');

const orderListInsert = 
`CALL orderlistInput(?, ?, ?, ?, ?, ?, ?);`;

//주문서 단건 조회 (주문서 + 주문) => 사용 안함 
// const orderInfos =
// `SELECT l.orderlist_num,
// 	   l.orderlist_title,
//        l.order_Date,
//        l.due_date,
//        l.orderlist_status,
//        e.name,
//        c.com_name,
//        o.order_num,
//        o.order_amount,
//        o.total_price,
//        o.order_status,
//        o.per_price,
//        o.product_code,
//        p.product_name
// from orderlists l join orders o
// on l.orderlist_num = o.orderlist_num
// 				   left join client c
// on l.client_num = c.client_num
// 					left join employee e
// on l.emp_num = e.emp_num
// join product p 
// on p.product_code = o.product_code
// where l.orderlist_num = ?`;

//주문서 번호에 대한 주문 조회 
const orderInfo = 
`SELECT
	   o.order_num,
       o.order_amount,
       o.total_price,
       o.order_status,
       o.per_price,
       o.product_code,
       p.product_name
from orderlists l join orders o
				on l.orderlist_num = o.orderlist_num
				  join product p 
				on p.product_code = o.product_code
where l.orderlist_num = ?`;

//주문 업데이트에서 추가 주문 
/*DELIMITER //
CREATE PROCEDURE orderUpdateInput
(
IN v_orderlist_num INT,
IN v_product_code_json_array TEXT,
IN v_product_num_json_array TEXT,
IN v_per_price_json_array TEXT
)
BEGIN
	DECLARE i INT DEFAULT 1;
	DECLARE product_code_array_length INT;
	DECLARE product_code_value TEXT;
	DECLARE product_num_value TEXT;
	DECLARE per_price_value TEXT;
    DECLARE v_result_value INT;

    -- 트렌젝션 시작
    START TRANSACTION;
    
    SET product_code_array_length = JSON_LENGTH(v_product_code_json_array);
	
    -- 주문등록
    WHILE i <= product_code_array_length DO
    SET product_code_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_code_json_array , CONCAT('$[', i - 1, ']')));
    SET product_num_value   = JSON_UNQUOTE(JSON_EXTRACT(v_product_num_json_array  , CONCAT('$[', i - 1, ']')));
    SET per_price_value   = JSON_UNQUOTE(JSON_EXTRACT(v_per_price_json_array  , CONCAT('$[', i - 1, ']')));
	INSERT INTO orders 
				(orderlist_num,
                order_amount,
                per_price,
                total_price,
                product_code)
	VALUES  (v_orderlist_num,
			product_num_value,
            per_price_value,
            product_num_value*per_price_value,
            product_code_value);
	SET v_result_value = ROW_COUNT();
		IF v_result_value != 1 THEN 
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
CALL orderUpdateInput(2 (orderlist_num),'["P001", "P002"]' (product_code array),'[10, 20]'(order_amount array),'[1000, 2000]'(per_price array)
);*/ 
const updateAddOrder= 
`
CALL orderUpdateInput(? ,? ,? ,?);`;

//주문서, 주문 업데이트 
/*DELIMITER //
CREATE PROCEDURE orderUpdate
(
IN v_orderlist_num INT,
IN v_orderlist_title VARCHAR(50),
IN v_due_date DATETIME,

IN v_order_code_json_array TEXT,
IN v_product_code_json_array TEXT,
IN v_product_num_json_array TEXT,
IN v_per_price_json_array TEXT

)
BEGIN
DECLARE v_result_value INT;

DECLARE i INT DEFAULT 1;
DECLARE product_code_array_length INT;
DECLARE product_code_value TEXT;
DECLARE product_num_value TEXT;
DECLARE per_price_value TEXT;
DECLARE order_code_value TEXT;
DECLARE v_change_num INT;

-- 트렌젝션 시작
START TRANSACTION;

-- JSON 배열 길이 계산
SET product_code_array_length = JSON_LENGTH(v_product_code_json_array);

-- 주문서 수정 
UPDATE orderlists
SET orderlist_title = v_orderlist_title,
	due_date = v_due_date
WHERE orderlist_num = v_orderlist_num;

-- 주문 수정 
-- 반복으로  json 배열 요소 추출 
WHILE i <= product_code_array_length DO
	SET product_num_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_num_json_array , CONCAT('$[', i - 1, ']')));
    SET per_price_value   = JSON_UNQUOTE(JSON_EXTRACT(v_per_price_json_array  , CONCAT('$[', i - 1, ']')));
    SET order_code_value = JSON_UNQUOTE(JSON_EXTRACT(v_order_code_json_array  , CONCAT('$[', i - 1, ']')));
    SET product_code_value = JSON_UNQUOTE(JSON_EXTRACT(v_product_code_json_array  , CONCAT('$[', i - 1, ']')));
    -- 주문정보 업데이트 
    UPDATE orders
	SET order_amount = product_num_value,
		product_code = product_code_value,
		per_price = per_price_value,
        total_price = product_num_value *  per_price_value
	WHERE orderlist_num = v_orderlist_num AND order_num = order_code_value;
    
    -- 변경된 행 체크 
    SET v_change_num = ROW_COUNT();
			IF v_change_num != 1 THEN 
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
CALL orderUpdate(14,'오렌지나라','2025-01-03','[15, 16]','["P008", "P008"]','[30, 40]','[1000, 2000]'
);*/ 
const updateOrder=
`CALL orderUpdate(?, ?, ?, ?, ?, ?, ?)`;


// 주문 주문서 삭제 
/**DELIMITER //
CREATE PROCEDURE orderlistDelete(
IN v_orderlist_num INT 
)

BEGIN
-- 변수 선언

DECLARE vo_change_num INT;
DECLARE vl_change_num INT;

-- 트랜잭션 시작
START TRANSACTION;

DELETE FROM orderlists 
WHERE orderlist_num = v_orderlist_num;

-- 변경된 행 체크 
SET vl_change_num = ROW_COUNT();
IF vl_change_num = 1 THEN 
	DELETE FROM orders 
	WHERE orderlist_num = v_orderlist_num;


	SET vo_change_num = ROW_COUNT();
END IF;
	-- 트랜잭션 커밋 또는 롤백 처리
	IF vl_change_num = 1 AND vo_change_num >= 1 THEN -- `orders`에서 최소 1개 이상의 행이 삭제되었다면 커밋
		-- 트랜잭션 커밋
			COMMIT;
	ELSE
    -- 주문서 등록 실패 시 롤백
        ROLLBACK;
	END IF;
END//
DELIMITER ;
CALL orderlistDelete(21);*/
const orderListDelete = 
`CALL orderlistDelete(?)`;


//주문서를 검색해서 출고완료된 주문 출력 
const shippedOrder = 
`SELECT  o.order_num
		,op.output_num
		,p.product_code
        ,p.product_name
        ,o.order_amount
        ,NVL(op.output_amount, 0) AS output_amount
        ,o.per_price
			,op.client_num
        ,op.output_date
FROM orders o left join product p 
                     ON o.product_code = p.product_code
              left join output op
                     ON o.order_num = op.order_num
            	left join returnlists r
    						ON op.output_num = r.output_num
WHERE o.orderlist_num= ?
AND o.order_status != 'preparing'
AND r.output_num IS NULL`;
// AND op.output_num NO IN (SELECT output_num FROM returnlists)

//미출고주문만 삭제 
/**DROP PROCEDURE deleteOrders;
DELIMITER //
CREATE PROCEDURE deleteOrders
(
IN v_order_num_json_array TEXT
)
BEGIN
DECLARE i INT DEFAULT 1;
DECLARE v_change_num INT;
DECLARE order_num_array_length INT;
DECLARE order_num_value TEXT;

    -- 트렌젝션 시작
    START TRANSACTION;
    
-- JSON 배열 길이 계산
SET order_num_array_length = JSON_LENGTH(v_order_num_json_array);

WHILE i <= order_num_array_length DO 
	SET order_num_value = JSON_UNQUOTE(JSON_EXTRACT(v_order_num_json_array , CONCAT('$[', i - 1, ']')));
	-- 주문 삭제 
	DELETE FROM orders 
	WHERE order_num = order_num_value;
    
    -- 변경된 행 체크 
    SET v_change_num = ROW_COUNT();
		IF v_change_num = 0 THEN 
				-- 오류 발생 시 롤백
					rollback;
		END IF;
	SET i = i + 1;
	END WHILE;
    -- 문제없을때
    COMMIT;

END//
DELIMITER ;

CALL deleteOrders ('[82]'); */
const deleteOrders = 
`CALL deleteOrders (?)`;

module.exports = {
    orderList,
	clientlist,
    orderListInfo,
	orderEmployees,
	orderProduct,
    orderListInsert,
    updateAddOrder,
	updateOrder,
    orderListDelete,
	orderInfo,
	shippedOrder,
	deleteOrders,

}