import request from "@/utils/request";

/**
 * 获取回收站列表
 * @param data
 * @returns {*}
 */
export function getBimRecycleBin(data) {
    return request({
        url: `/api/zgt/bimRecycleBin/list/condition`,
        method: 'post',
        data
    })
}
/**
 * 获取回收站详情
 * @param id
 * @returns {*}
 */
export function detailBimRecycleBin(id) {
    return request({
        url: `/api/zgt/bimRecycleBin/detail/${id}`,
        method: 'get',
    })
}
/**
 * 还原回收站
 * @param id
 * @returns {*}
 */
export function revertBimRecycleBin(id) {
    return request({
        url: `/api/zgt/bimRecycleBin/revert/${id}`,
        method: 'get',
    })
}
/**
 * 还原回收站明细
 * @param id
 * @returns {*}
 */
export function revertDetailBimRecycleBin(id) {
    return request({
        url: `/api/zgt/bimRecycleBin/revertLine/${id}`,
        method: 'get',
    })
}
