import request from "@/utils/request";

export function recycleBinAttachList(data){
    return request({
        url: '/api/zgt/bimRecycleBin/attachmentsList/condition',
        method: 'post',
        data
    })
}
export function recycleBinAttachRevert(id){
    return request({
        url: `/api/zgt/bimRecycleBin/attachmentsRevert/${id}`,
        method: 'get',
    })
}
