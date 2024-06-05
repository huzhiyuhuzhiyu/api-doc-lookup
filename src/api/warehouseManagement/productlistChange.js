import request from '@/utils/request'
// 装卸单据-明细列表
export function InventoryDisassemblymxlist(data) {
    return request({
        url: `/api/wms/stock/transfer/line/list`,
        method: 'POST',
        data
    })
}
// 装卸单据-列表
export function InventoryDisassemblylist(data) {
    return request({
        url: `/api/wms/stock/transfer/list`,
        method: 'POST',
        data
    })
}
// 装卸单据-删除
export function InventoryDisassemblydele(id) {
    return request({
        url: `/api/wms/stock/transfer/del/${id}`,
        method: 'DELETE',
    })
}
// 组装单据-新增
export function InventoryDisassemblydata(data) {
    return request({
        url: `/api/wms/stock/transfer/merge/add`,
        method: 'POST',
        data
    })
}
// 组装单据-修改
export function updateInventoryDisassembly(data) {
    return request({
        url: `/api/wms/stock/transfer/merge/update`,
        method: 'PUT',
        data
    })
}
// 装卸单据-详情
export function detaDisassemblyData(id) {
    return request({
        url: `/api/wms/stock/transfer/detail/${id}`,
        method: 'GET'
    })
}
// 拆卸单据-新增
export function InventoryDisassemblydatacx(data) {
    return request({
        url: `/api/wms/stock/transfer/split/add`,
        method: 'POST',
        data
    })
}
// 拆卸单据-修改
export function updateInventoryDisassemblycx(data) {
    return request({
        url: `/api/wms/stock/transfer/split/update`,
        method: 'PUT',
        data
    })
}
//查询产品仓库
export function stockDisassembly(id) {
    return request({
        url: `/api/wms/stockProductWarehouseCompare/detail/${id}`,
        method: 'GET'
    })
}
//产品库位
export function stockDisassemblykw(data) {
    return request({
        url: `/api/wms/stockGoodsShelves/list/condition`,
        method: 'POST',
        data
    })
}