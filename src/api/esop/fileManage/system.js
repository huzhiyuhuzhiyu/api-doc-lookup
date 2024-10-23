import request from "@/utils/request";

/**
 * 获取系统附件列表
 * @param data
 * @returns {AxiosPromise}
 */
export function systemAttachmentsList(data){
    return request({
        url: '/api/erp/attachments/list',
        method: 'post',
        data
    })
}
