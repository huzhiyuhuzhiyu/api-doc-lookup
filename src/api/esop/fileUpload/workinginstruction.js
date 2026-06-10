import request from "@/utils/request";

/**
 * 获取文件上传申请单列表
 * @param data
 * @returns {*}
 */
export function getBimFileUpload(data) {
    return request({
        url: `/api/zgt/bimFileUpload/list/condition`,
        method: 'post',
        data
    })
}

/**
 *  新增文件上传申请单
 * @param data
 * @returns {*}
 */
export function addBimFileUpload(data) {
    return request({
        url: `/api/zgt/bimFileUpload/insert`,
        method: 'post',
        data
    })
}

/**
 * 获取文件上传申请单详情
 * @param id
 * @returns {*}
 */
export function detailBimFileUpload(id) {
    return request({
        url: `/api/zgt/bimFileUpload/detail/${id}`,
        method: 'get',
    })
}

/**
 * 退回文件上传申请单
 * @param id
 * @returns {AxiosPromise}
 */
export function backBimFileUpload(id) {
    return request({
        url: `/api/zgt/bimFileUpload/turnBack/${id}`,
        method: 'get',
    })
}
/**
 * 修改文件上传申请单
 * @param data
 * @returns {*}
 */
export function modifyBimFileUpload(data) {
    return request({
        url: `/api/zgt/bimFileUpload/modify`,
        method: 'put',
        data
    })
}

/**
 * 删除文件上传申请单
 * @param id
 * @returns {*}
 */
export function deleteBimFileUpload(id) {
    return request({
        url: `/api/zgt/bimFileUpload/remove/${id}`,
        method: 'delete',
    })
}
/**
 * 删除文件上传申请单单个明细
 * @param id
 * @returns {*}
 */
export function deleteBimFileUploadDetailById(id) {
    return request({
        url: `/api/zgt/bimFileUpload/removeLine/${id}`,
        method: 'delete',
    })
}

/**
 * 批量删除文件上传申请个明细
 * @param data  id数组
 * @returns {*}
 */
export function batchDeleteBimFileUploadDetailById(data) {
    return request({
        url: `/api/zgt/bimFileUpload/removeLineBatch`,
        method: 'delete',
        data
    })
}


/**
 * 批量删除文件上传申请单
 * @param data id数组
 * @returns {*}
 */

export function batchDeleteBimFileUpload(data) {
    return request({
        url: `/api/zgt/bimFileUpload/delBatch`,
        method: 'delete',
        data
    })
}

/**
 * 获取文件上传单根据id数组
 * @param data
 * @returns {*}
 */
export function getFileUploadByIds(data) {
    return request({
        url: `/api/zgt/bimFileUpload/listByBusinessIds`,
        method: 'post',
        data
    })
}

/**
 * 切换启用标记
 * @param id
 * @returns {*}
 */
export function switchEnableMark(id){
    return request({
        url: `/api/zgt/bimFileUpload/switchEnableMark/${id}`,
        method: 'put',
    })
}
