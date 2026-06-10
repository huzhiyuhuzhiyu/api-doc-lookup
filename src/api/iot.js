import request from '@/utils/request'


export function getIot(data) {
  return request({
    url: '/api/iot/Iot/getIot',
    method: 'post',
    data: data
  })
}


/**
 * @title 查询设备状态信息
 * @versions v1
 *
 * @param {Object} data
 */
export function getEquipmentItem(data) {
  return request({
    url: '/api/iot/Iot/getEquipmentItem',
    method: 'post',
    data: data
  })
}

export function getMosaicBar(data) {
  return request({
    url: '/api/iot/Iot/getMosaicBar',
    method: 'post',
    data: data
  })
}


/**
 * @title 查询设备各状态持续时间
 * @versions v1
 *
 * @param {Object} data
 */
export function getAggregationTimeByUidAndCategories_v1(data) {
  return request({
    url: '/api/iot/Iot/getAggregationTimeByUidAndCategories',
    method: 'post',
    data: data
  })
}

/**
 * @title 根据状态批量获取时间聚合结果
 * @versions v1
 *
 * @param {Object} data
 */
export function getBatchAggregationTimeByUidAndCategories(data) {
    return request({
        url: '/api/iot/Iot/getBatchAggregationTimeByUidAndCategories',
        method: 'post',
        data: data
    })
}

/**
 * @title 查询设备时间线
 * @param {Object} data
 */
export function getTimeLine(data) {
  return request({
    url: '/api/iot/Iot/getTimeLine',
    method: 'post',
    data: data
  })
}

/**
 * @title 查询设备时间线 (数据后端处理版)
 * @param {Object} data
 */
export function getStateTimeLine(data) {
  return request({
    url: '/api/iot/Iot/getStateTimeLine',
    method: 'post',
    data: data
  })
}



/**
 * @title 查询设备OEE、稼动率
 * @param {Object} data
 */
export function getEquipmentWorkpieceRatio(data) {
  return request({
    url: '/api/iot/Iot/getEquipmentWorkpieceRatio',
    method: 'post',
    data: data
  })
}


/**
 * @title 查询设备运转率
 * @param {Object} data
 */
export function getRunningRate(data) {
  return request({
    url: '/api/iot/Iot/getRunningRate',
    method: 'post',
    data: data
  })
}

/**
 * 查询设备生产产量分析
 * @param {Object} data
 */
export function getOutputAnalysis(data) {
    return request({
        url: '/api/iot/Iot/getOutputAnalysis',
        method: 'post',
        data: data
    })
}
