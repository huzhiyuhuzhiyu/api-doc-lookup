import request from '@/utils/request'


// 工单重制申请表
export function getRemasteredPage(data) {
    return request({
        url: `/api/erp/proRemastered/list`,
        method: 'post',
        data
    })
}

// 工单重制申请表 新增
export function RemasteredAdd(data) {
    return request({
        url: `/api/erp/proRemastered/insert`,
        method: 'post',
        data
    })
}

//   工单重制申请表 修改
export function RemasteredEdit(data) {
    return request({
        url: `/api/erp/proRemastered/modify`,
        method: 'put',
        data
    })
}

// 工单重制申请表 详情
export function getRemastered(id) {
    return request({
        url: `/api/erp/proRemastered/detail/${id}`,
        method: 'GET'
    })
}
