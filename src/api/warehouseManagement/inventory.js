import request from '@/utils/request'

// 库存查询 列表
export function inventoryList(data) {
  return request({
    url: `/api/wms/stock/inventory/list`,
    method: 'POST',
    data
  })
}

// 库存库位查询 列表
export function inventorySpaceList(data) {
  return request({
    url: `/api/wms/stock/inventory/space/list`,
    method: 'POST',
    data
  })
}

// 仓库库存查询 列表
export function inventoryWarehouseList(data) {
  return request({
    url: `/api/wms/stock/inventory/warehouse/list`,
    method: 'POST',
    data
  })
}

// 占用库存查询

export function occupyStockList(data) {
  return request({
    url: `/api/wms/stock/occupy/inventory/total/list`,
    method: 'POST',
    data
  })
}

// 解除占用

export function occupyRestore(data) {
  return request({
    url: `/api/wms/stock/occupy/inventory/total/batch/restore`,
    method: 'POST',
    data
  })
}



// 出入库明细——列表

export function getInventoryDetailList(data) {
  return request({
    url: `/api/wms/stock/move/line/list`,
    method: 'POST',
    data
  })
}
// 出入库明细——列表汇总
export function getInventorySummaryData(data) {
  return request({
    url: `/api/wms/stock/move/line/report`,
    method: 'POST',
    data
  })
}
// 出入库——新增
export function addInboundOutbound(data) {
  return request({
    url: `/api/wms/stock/move/addInboundOutbound`,
    method: 'POST',
    data
  })
}
// 出入库——修改

export function updateInboundOutbound(data) {
  return request({
    url: `/api/wms/stock/move/modifyInboundOutbound`,
    method: 'put',
    data
  })
}
// 出入库导入明细

export function warehouseUploadLine(data) {
  return request({
    url: `/api/wms/stock/move/upload/line`,
    method: 'POST',
    data
  })
}

export function getLocationList(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/list`,
    method: 'POST',
    data
  })
}

//  批量检验

export function batchInspect(data) {
  return request({
    url: `/api/wms/stock/inventory/line/inspect/batch`,
    method: 'POST',
    data
  })
}

// 直接出入库撤回功能
export function withdrawApi(id) {
  return request({
    url: `/api/wms/stock/move/revoke/${id}`,
    method: 'get',
    
  })
}

// 中亚生产在制库存报表-列表
export function inventoryWarehouseReport(data) {
  return request({
    url: `/api/report/data/zy/transit/list`,
    method: 'POST',
    data
  })
}

// 中亚生产在制库存报表-导出
export function inventoryWarehouseExport(data) {
  return request({
    url: `/api/report/data/zy/transit/export`,
    method: 'POST',
    data
  })
}

// 倍宁- 常规报表
export function inventoryWarehouseTotalRoutineReport(data) {
  return request({
    url: `/api/wms/stock/inventory/line/total/routine/report`,
    method: 'POST',
    data
  })
}

// 倍宁- 角接触报表
export function inventoryWarehouseTotalReport(data) {
  return request({
    url: `/api/wms/stock/inventory/line/total/report`,
    method: 'POST',
    data
  })
}

// 倍宁- 角接触报表
export function innerOuterRingReport(data) {
  return request({
    url: `/api/wms/stock/inventory/line/innerOuterRingReport`,
    method: 'POST',
    data
  })
}



// 结存报表

export function stockBalanceMergePage(data) {
  return request({
    url: `/api/wms/stock/balance/query/merge/page`,
    method: 'POST',
    data
  })
}
