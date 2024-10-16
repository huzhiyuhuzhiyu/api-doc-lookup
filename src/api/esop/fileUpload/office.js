import request from "@/utils/request";

export function attachmentsInsert(data){
    return request({
        url: '/api/erp/attachments/insert',
        method: 'post',
        data
    })
}
