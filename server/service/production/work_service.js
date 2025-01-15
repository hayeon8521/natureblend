const mysql = require('../../database/mapper');

const findWorkingOrders = async ()=>{
    return await mysql.query('workingOrders');
}

const findCompletedOrders = async ()=>{
    return await mysql.query('completedOrders');
}

const findWorkForToday = async ()=>{
    return await mysql.query('workForToday');
}

const findWorkByOrderNum = async (productionOrderNum)=>{
    return await mysql.query('workByOrderNum', [productionOrderNum]);
}

const addPartialWork = async (partialWorkInfo)=>{
    let result = await mysql.query('insertPartialWork', Object.values(partialWorkInfo));
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const findPartialWork = async (processWorkHeaderNum)=>{
    return await mysql.query('partialWorkByProcess', [processWorkHeaderNum]);
}

const getProductionEmpList = async ()=>{
    return await mysql.query('partialWorkEmpList')
}

const getMachineList = async (processCode)=>{
    return await mysql.query('machineListByProcess', [processCode])
}

const startPartialWork = async (startInfo)=>{
    let query =  `set emp_num = ${startInfo.empName}, machine_num = ${startInfo.machineNum}, process_todo_qty = ${startInfo.todoQty}, partial_process_start_time = NOW(), partial_process_status = 'partial_processing',`

    if(typeof startInfo.failQty === 'number' && typeof startInfo.successQty !== 'number') {
        query += `fail_qty = ${startInfo.failQty}, success_qty = ${null}`
    } else if(typeof startInfo.failQty !== 'number' && typeof startInfo.successQty === 'number') {
        query += `fail_qty = ${null}, success_qty = ${startInfo.successQty}`
    } else if(typeof startInfo.failQty !== 'number' && typeof startInfo.successQty !== 'number') {
        query += `fail_qty = ${null}, success_qty = ${null}`
    } else {
        query += `fail_qty = ${startInfo.failQty}, success_qty = ${startInfo.successQty}`
    }

    query += ` where process_num = ${startInfo.process_num}`

    let result = await mysql.query('startPartialWork', query)
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const endPartialWork = async (endInfo)=>{
    let query =  `set partial_process_end_time = NOW(), partial_process_status = 'partial_process_complete'`

    if(typeof endInfo.failQty === 'number' && typeof endInfo.successQty !== 'number') {
        query += `, fail_qty = ${endInfo.failQty}`
    } else if(typeof endInfo.failQty !== 'number' && typeof endInfo.successQty === 'number') {
        query += `, success_qty = ${endInfo.successQty}`
    } else if(typeof endInfo.failQty === 'number' && typeof endInfo.successQty === 'number'){
        query += `, fail_qty = ${endInfo.failQty}, success_qty = ${endInfo.successQty}`
    } else {
        // 불량량, 합격량을 입력하고 시작 버튼 누른경우임
        // failQty, successQty 둘 다 null이라 업데이트하면 안됨
    }

    query += ` where process_num = ${endInfo.process_num}`

    let result = await mysql.query('endPartialWork', query)
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const updateProcessStatus = async (statusInfo)=>{
    return await mysql.query('updateProcessStatus', Object.values(statusInfo))
}

const updateStartTime = async (startInfo)=>{
    return await mysql.query('updateProcessStartTime', Object.values(startInfo))
}

const updateEndTime = async (endInfo)=>{
    return await mysql.query('updateProcessEndTime', Object.values(endInfo))
}

const qcCleaning = async (qcInfo)=>{
    return await mysql.query('insertCleaningQc', Object.values(qcInfo))
}

const qcJuice = async (qcInfo)=>{
    return await mysql.query('insertJuiceQc', [qcInfo.processNum, qcInfo.empNum])
}

const qcPackaging = async (qcInfo)=>{
    return await mysql.query('insertPackagingQc', Object.values(qcInfo))
}

const getProcessStatus = async (prodOrderNum)=>{
    return await mysql.query('checkProcessStatus', [prodOrderNum])
}

const updateProdOrderStatus = async (statusInfo)=>{
    return await mysql.query('updateProdOrderStatus', Object.values(statusInfo))
}

const updateMaterial = async (prodOrderNum)=>{
    return await mysql.query('updateMaterial', Object.values(prodOrderNum))
}

const updatePlanStatus = async (planStatusInfo)=>{
    return await mysql.query('updatePlanStatus', Object.values(planStatusInfo))
}

const getCompletePartialWork = async (urlQuery)=>{
    let dbQuery = ''

    if(Object.keys(urlQuery).length !== 0) {
        if(urlQuery.prodOrderNum) {
            dbQuery += ` and production_order_num = ${urlQuery.prodOrderNum}`
        }
        if(urlQuery.processCode) {
            dbQuery += ` and process_code = '${urlQuery.processCode}'`
        }
        if(urlQuery.productCode) {
            dbQuery += ` and ph.product_code = '${urlQuery.productCode}'`
        }
    }

    dbQuery += ' order by production_order_num desc'
    return await mysql.query('completePartialWork', dbQuery)
}

const getProcessList = async ()=>{
    return await mysql.query('processList')
}

const getWorkCompletedProduct = async ()=>{
    return await mysql.query('completeWorkProduct')
}

module.exports = {
    findWorkingOrders,
    findCompletedOrders,
    findWorkForToday,
    findWorkByOrderNum,
    addPartialWork,
    findPartialWork,
    getProductionEmpList,
    getMachineList,
    startPartialWork,
    endPartialWork,
    updateProcessStatus,
    updateStartTime,
    updateEndTime,
    qcCleaning,
    qcJuice,
    qcPackaging,
    getProcessStatus,
    updateProdOrderStatus,
    updateMaterial,
    updatePlanStatus,
    getCompletePartialWork,
    getProcessList,
    getWorkCompletedProduct
}