import request from '@/utils/request'

/**
 * 生产设备综合分析
 * @param {Object} data
 */
export function getProductionEquipmentSynthesisReport(data) {
    return request({
        url: 'api/equipment/EquipmentReport/getProductionEquipmentSynthesisReport',
        method: 'post',
        data: data
    })
}

/**
 * 生产检测设备综合分析
 * @param {Object} data
 */
export function getProductionCheckoutEquipmentSynthesisReport(data) {
    return request({
        url: 'api/equipment/EquipmentReport/getProductionCheckoutEquipmentSynthesisReport',
        method: 'post',
        data: data
    })
}

/**
 * 检测设备综合分析
 * @param {Object} data
 */
export function getCheckoutEquipmentSynthesisReport(data) {
    return request({
        url: 'api/equipment/EquipmentReport/getCheckoutEquipmentSynthesisReport',
        method: 'post',
        data: data
    })
}

/**
 * 查询设备开机率
 * @param {Object} data
 */
export function getEquipmentOnline(data) {
    return request({
        url: '/api/equipment/EquipmentReport/getEquipmentOnline',
        method: 'post',
        data: data
    })
}



/**
 * 查询设备oee_v2
 * @param {Object} data
 */
export function getEquipmentOeeList_v2(data) {
    return request({
        url: '/api/equipment/EquipmentReport/getEquipmentOeeList_v2',
        method: 'post',
        data: data
    })
}


/**
 * 查询设备稼动率_v2
 * @param {Object} data
 */
export function getEquipmentEfficency_v2(data) {
    return request({
        url: '/api/equipment/EquipmentReport/getEquipmentEfficency_v2',
        method: 'post',
        data: data
    })
}

/**
 * 查询不良品分析
 * @param {Object} data
 */
export function getRejectsReport(data) {
    return request({
        url: '/api/equipment/EquipmentReport/getRejectsReport',
        method: 'post',
        data: data
    })
}


/**
 * 查询CPK
 * @param {Object} data
 */
export function selectCPK(data) {
    return request({
        url: '/api/equipment/EquipmentReport/selectCPK',
        method: 'post',
        data: data
    })
}
/**
 * 查询设备参数
 * @param {Object} data
 */
export function selectEquipmentParameter(data) {
    return request({
        url: '/api/equipment/EquipmentReport/selectEquipmentParameter',
        method: 'post',
        data: data
    })
}
