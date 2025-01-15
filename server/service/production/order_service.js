const mysql = require('../../database/mapper');

const findWaitingPlanList = async ()=>{
    return await mysql.query('waitingPlanList');
}

const findProcessFlow = async (productCode)=>{
    return await mysql.query('processFlow', [productCode]);
}

const findBom = async (productCode)=>{
    return await mysql.query('bomByProduct', [productCode]);
}

const materialStock = async (materialCodes)=>{
    let result = await mysql.query('getMaterialStock', Object.values(materialCodes));
    return result[0]
}

const addProductionOrder = async (orderInfo)=>{
    let result = await mysql.query('insertProductionOrder', Object.values(orderInfo));
    if(result.affectedRows === 1) {
        return {
            message: 'success',
            newProdOrderNum: result.insertId
        }
    } else {
        return { message: 'fail' }
    }
}

const addHoldingStock = async (holdStockInfo)=>{
    let result = await mysql.query('insertHoldingStock', Object.values(holdStockInfo));
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const addProcessWork = async (processWorkInfo)=>{
    let result = await mysql.query('insertProcessWork', Object.values(processWorkInfo));
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const prodOrderList = async ()=>{
    return await mysql.query('prodOrderList');
}

const deleteProdOrder = async (prodOrderNums)=>{
    let result = await mysql.query('deleteProdOrder', [prodOrderNums])

    if(result.affectedRows > 0) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const deleteProcessWork = async (prodOrderNums)=>{
    let result = await mysql.query('deleteProcessWork', [prodOrderNums])

    if(result.affectedRows > 0) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const deleteInvalidMaterial = async (prodOrderNums)=>{
    let result = await mysql.query('deleteInvalidMaterial', [prodOrderNums])

    if(result.affectedRows > 0) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

module.exports = {
    findWaitingPlanList,
    findProcessFlow,
    findBom,
    materialStock,
    addProductionOrder,
    addHoldingStock,
    addProcessWork,
    prodOrderList,
    deleteProdOrder,
    deleteProcessWork,
    deleteInvalidMaterial
}