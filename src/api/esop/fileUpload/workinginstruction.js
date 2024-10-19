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


export function getFileUploadByAuditId(data) {
    return request({
        url: `/api/zgt/bimFileUpload/listByBusinessIds`,
        method: 'post',
        data
    })
}
