const workingOrders = `
    select 
        production_order_num, 
        production_order_name, 
        plan_num, 
        po.product_code, 
        p.product_name, 
        DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date, 
        production_order_qty, 
        production_order_date, 
        emp_num, 
        po.production_order_status
    from production_order po inner join product p
        on po.product_code = p.product_code
    where po.production_order_status in ('work_waiting', 'work_in_process')
    order by production_order_num desc
`

const completedOrders = `
    select 
        production_order_num, 
        production_order_name, 
        plan_num, 
        po.product_code, 
        p.product_name,
        work_date, 
        production_order_qty, 
        production_order_date, 
        emp_num, 
        po.production_order_status
    from production_order po inner join product p
        on po.product_code = p.product_code
    where po.production_order_status in ('work_complete')
    order by production_order_num desc
`

const workForToday = `
    select machine_type, process_code, process_end_time, process_name, process_start_time, process_status, process_work_header_num, product_code, product_name, production_order_name, production_order_num, production_order_qty, DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date
    from process_work_header
    where process_status = 'process_waiting'
    and work_date = CURDATE()
`

const workByOrderNum = `
    select * from process_work_header
    where production_order_num = ?
`

const insertPartialWork = `
    insert into process_work_body(process_work_header_num, product_code)
    values(?, ?)
`

const partialWorkByProcess = `
    select process_num, process_work_header_num, emp_num, your_employee(emp_num, 'name') as emp_name, machine_num, your_machine(machine_num, 'machine_name') as machine_name, partial_process_status, process_todo_qty,process_complete_qty, fail_qty, success_qty, partial_process_start_time, partial_process_end_time, is_inspected
    from process_work_body
    where process_work_header_num = ?
`

// 생산부서 직원만 조회
const partialWorkEmpList = `
    select emp_num, name, birth, tel, job, job_num, position
    from employee
    where job_num = 2
`
// 특정 공정에서 사용하는 설비 중 가동 가능한 설비 조회
const machineListByProcess = `
    select machine_num, machine_name
    from machine 
    where process_code = ?
    and machine_state = 'run';
`

const startPartialWork = `
    update process_work_body
`

const endPartialWork = `
    update process_work_body
`

const updateProcessStatus = `
    update process_work_header
    set process_status = ?
    where process_work_header_num = ?
`

const updateProcessStartTime = `
    update process_work_header
    set process_start_time = ?
    where process_work_header_num = ?
`

const updateProcessEndTime = `
    update process_work_header
    set process_end_time = ?
    where process_work_header_num = ?
`

// 실행 방법(공정작업바디번호, 총 (검사) 수량, 사원번호)
// CALL qc_p_cleaning_input_list(4, 50, 1, @result);
const insertCleaningQc = `
    CALL qc_p_cleaning_input_list(?, ?, ?, @result);
`

const insertJuiceQc = `
    CALL qc_p_beverage_input_list(?, ?, @result)
`

const insertPackagingQc = `
    CALL qc_p_packaging_input_list(?, ?, ?, @result);
`

const checkProcessStatus = `
    select process_status 
    from process_work_header
    where production_order_num = ?
`

const updateProdOrderStatus = `
    update production_order
    set production_order_status = ?
    where production_order_num = ?;
`

// DELIMITER $$
//
// CREATE PROCEDURE deductMaterial(
//     IN p_production_order_num INT
// )
// BEGIN
// -- 변수 선언
// DECLARE v_material_code VARCHAR(50);
// DECLARE v_lot_code VARCHAR(50);
// DECLARE v_material_qty INT;
// DECLARE done INT DEFAULT 0;
//
// -- 커서 선언
// DECLARE cur CURSOR FOR
// SELECT material_code, lot_code, material_qty
// FROM invalid_material
// WHERE production_order_num = p_production_order_num;
//
// -- 핸들러 선언
// DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
//
// -- 커서 열기
// OPEN cur;
//
// -- 레코드 순회
// read_loop: LOOP
// -- 커서에서 한 행씩 추출
// FETCH cur INTO v_material_code, v_lot_code, v_material_qty;
//
// -- 종료 조건
// IF done THEN
// LEAVE read_loop;
// END IF;
//
// -- 1. material_lot_qty1 테이블의 out_qty 업데이트
// UPDATE material_lot_qty1
// SET out_qty = out_qty + v_material_qty
// WHERE material_code = v_material_code
// AND material_nomal = 'b1'
// AND lot_code = v_lot_code;
//
// -- 2. stok_qty 재계산
// UPDATE material_lot_qty1
// SET stok_qty = in_qty - out_qty
// WHERE material_code = v_material_code
// AND material_nomal = 'b1'
// AND lot_code = v_lot_code;
//
// -- 3. invalid_material 테이블의 is_out, out_date 업데이트
// UPDATE invalid_material
// SET is_out = TRUE,
//     out_date = NOW()
// WHERE material_code = v_material_code
// AND lot_code = v_lot_code
// AND production_order_num = p_production_order_num;
//
// END LOOP;
//
// -- 커서 닫기
// CLOSE cur;
//
// END$$
//
// DELIMITER ;

const updateMaterial = `
    CALL deductMaterial(?);
`

// work_in_process, work_complete
const updatePlanStatus = `
    update production_plan
    set plan_status = ? 
    where plan_num = ?
`

const completePartialWork = `
    select
        rownum() as no,
        ph.process_work_header_num,
        production_order_num,
        process_name,
        process_code,
        your_machine(pb.machine_num, 'machine_name') as machine_name,
        your_employee(pb.emp_num, 'name') as emp_name,
        pb.process_complete_qty,
        pb.fail_qty,
        pb.success_qty,
        pb.partial_process_start_time,
        pb.partial_process_end_time,
        ph.product_name,
        ph.capacity
    from process_work_header ph
             join process_work_body pb
                  on ph.process_work_header_num = pb.process_work_header_num
    where pb.partial_process_status = 'partial_process_complete'
`

const processList = `
    select process_code, process_name from process
`

const completeWorkProduct = `
    select ph.product_name,
           ph.capacity,
           ph.product_code
    from process_work_header ph
             join process_work_body pb
                  on ph.process_work_header_num = pb.process_work_header_num
    where pb.partial_process_status = 'partial_process_complete'
    group by product_name, capacity
    order by production_order_num desc
`

module.exports = {
    workingOrders,
    completedOrders,
    workForToday,
    workByOrderNum,
    insertPartialWork,
    partialWorkByProcess,
    partialWorkEmpList,
    machineListByProcess,
    startPartialWork,
    endPartialWork,
    updateProcessStatus,
    updateProcessStartTime,
    updateProcessEndTime,
    insertCleaningQc,
    insertJuiceQc,
    insertPackagingQc,
    checkProcessStatus,
    updateProdOrderStatus,
    updateMaterial,
    updatePlanStatus,
    completePartialWork,
    processList,
    completeWorkProduct
}