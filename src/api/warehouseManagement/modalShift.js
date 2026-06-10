import request from '@/utils/request'

// 形态转换-列表
export function InventorymodalShiftlist(data) {
    return request({
        url: `/api/wms/stock/modal/shift/list`,
        method: 'POST',
        data
    })
}
// 形态转换-明细列表
export function InventorymodalShiftmxlist(data) {
    return request({
        url: `/api/wms/stock/modal/shift/line/list`,
        method: 'POST',
        data
    })
}
// 形态转换-删除
export function InventorymodalShiftdele(id) {
    return request({
        url: `/api/wms/stock/modal/shift/del/${id}`,
        method: 'DELETE',
    })
}
// 形态转换-新增
export function InventorymodalShiftdata(data) {
    return request({
        url: `/api/wms/stock/modal/shift/add`,
        method: 'POST',
        data
    })
}
// 形态转换-修改
export function updateInventorymodalShift(data) {
    return request({
        url: `/api/wms/stock/modal/shift/update`,
        method: 'PUT',
        data
    })
}
// 形态转换-详情
export function detaInventorymodalShiftData(id) {
    return request({
        url: `/api/wms/stock/modal/shift/detail/${id}`,
        method: 'GET'
    })
}