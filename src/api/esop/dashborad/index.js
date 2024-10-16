import request from "@/utils/request";

/**
 * 获取新增统计
 * @returns {*}
 */
export function increaseStatistic() {
  return request({
    url: '/api/erp/attachments/increase/statistic',
    method: 'get'
  })
}

/**
 * 近30天上传统计
 * @returns {*}
 */
export function uploadStatistic(){
    return request({
        url: '/api/erp/attachments/upload/statistic',
        method: 'get'
    })
}

/**
 * 文件上传类型统计
 * @returns {*}
 */
export function fileTypeStatistic(){
    return request({
        url: '/api/erp/attachments/fileType/statistic',
        method: 'get'
    })
}
