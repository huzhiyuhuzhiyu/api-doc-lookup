import request from '@/utils/request'

export function getListState(data) {
    return request({
        url: 'api/equipment/Equipment/getListState',
        method: 'post',
        data: data
    })
}

/**
 * 查询设备状态
 * @param {Object} id
 */
export function getState(id) {
    return request({
        url: 'api/equipment/Equipment/getState/' + id,
        method: 'get'
    })
}

/**
 * 查询设备状态
 * @param {Object} id
 */
export function getStateByDate(id, data) {
    return request({
        url: 'api/equipment/Equipment/getStateByDate/' + id,
        method: 'post',
        data: data
    })
}

/**
 *
 * 查询设备产量列表 （今日、本周、本月）
 *
 * @param {Object} data
 */
export function getListOutPut(data) {
    return request({
        url: 'api/equipment/Equipment/getListOutPut',
        method: 'post',
        data: data
    })
}

/**
 *
 * 查询设备今日产量列表 （今日）
 *
 * @param {Object} data
 */
export function getListTodayOutPut(data) {
    return request({
        url: 'api/equipment/Equipment/getListTodayOutPut',
        method: 'post',
        data: data
    })
}

/**
 * 查询设备数据图表
 * @param {Object} data
 */
export function getListChart(data) {
    return request({
        url: 'api/equipment/Equipment/getListChart',
        method: 'post',
        data: data
    })
}

/**
 * 查询设备数据图表
 * @param {Object} data
 */
export function getListStateLine(data) {
    return request({
        url: '/api/equipment/Equipment/getListStateLine',
        method: 'post',
        data: data
    })
}

/**
 * 查询能耗数据
 * @param {Object} data
 */
export function getListEnergy(data) {
    return request({
        url: '/api/equipment/Equipment/getListEnergy',
        method: 'post',
        data: data
    })
}

/**
 * 查询设备数量 通过是否联网、设备类型
 * @param {Object} data
 */
export function selectIotEquipmentCountByTypeS(data) {
    return request({
        url: '/api/equipment/Equipment/selectIotEquipmentCountByTypeS',
        method: 'post',
        data: data
    })
}

/**
 * 获取设备状态数量
 * @param data
 * @returns {AxiosPromise}
 */
export function getEquipmentNumberByState(data) {
    return request({
        url: '/api/equipment/Equipment/getEquipmentNumberByState',
        method: 'post',
        data: data
    })
}


/**
 * 查询设备能耗集合 通过ids
 * @param data
 * @returns {AxiosPromise}
 */
export function getListEnergyByIds(data) {
    return request({
        url: '/api/equipment/Equipment/getListEnergyByIds',
        method: 'post',
        data: data
    })
}


/**
 * @title 查询设备状态颜色
 */
export function getColorListApi(callback, codes) {
    
    let colors = sessionStorage.getItem('equipmentStateColor')
    if (colors) {
        // return JSON.parse(colors)
        callback(JSON.parse(colors))
    } else {
        request({
            url: '/api/jx/Equipment_state/selectListByCodes',
            method: 'post',
            data: codes || []
        }).then(res => {
            if (res.data.length > 0) {
                sessionStorage.setItem('equipmentStateColor', JSON.stringify(res.data))
                callback(res.data)
                // return res.data.list
            } else {
                callback([])
            }

        })
    }

}

// 新CPK查询数据
export function getCPKdata(data) {

    return request({
        url: '/api/equipment/EquipmentReport/selectCPKData',
        method: 'post',
        data: data
    })
}
// CPK分析X-R图

export function getCPKXRData(data) {

    return request({
        url: 'api/equipment/EquipmentReport/selectXRData',
        method: 'post',
        data: data
    })
}

// 上传图片
export function uploaderWithCode(data) {
    return request({
        url: 'api/extend/Document/uploader/with/code',
        method: 'post',
        data: data
    })
}

// 上传文件
export function uploaderFileWithCode(data) {
    return request({
        url: '/api/extend/Document/merge/with/code',
        method: 'post',
        data: data
    })
}