import request from '@/utils/request'
// 产品库位对照表-列表
export function getTablecomparisonTableList(data) {
    return request({
        url: `/api/wms/stockProductWarehouseCompare/list`,
        method: 'post',
        data
    })
}
// 产品库位对照表-新增
export function addcomparisonTable(data) {
    return request({
        url: `/api/wms/stockProductWarehouseCompare/insert`,
        method: 'post',
        data
    })
}
// 产品库位对照表-修改
export function updatecomparisonTable(data) {
    return request({
        url: `/api/wms/stockProductWarehouseCompare/modify`,
        method: 'put',
        data
    })
}
// 产品库位对照表-删除
export function deletecomparisonTable(id) {
    return request({
        url: `/api/wms/stockProductWarehouseCompare/remove/${id}`,
        method: 'delete',
    })
}
// 产品库位对照表-详情
export function getcomparisonTable(id) {
    return request({
        url: `/api/wms/stockProductWarehouseCompare/detail/${id}`,
        method: 'get',
    })
}