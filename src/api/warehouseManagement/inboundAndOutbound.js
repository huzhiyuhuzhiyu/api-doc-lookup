import request from '@/utils/request'

// 仓库出入库单 列表
export function getWarehouseList(data) {
  return request({
    url: `/api/wms/stock/move/list`,
    method: 'POST',
    data
  })
}
// 获取仓库列表数据(树形)
export function getWarehouseTree(data) {
  return request({
    url: `/api/wms/stockWarehouse/tree`,
    method: 'post',
    data
  })
}
// 仓库出入库单 明细列表
export function getWarehouseLinesList(data) {
  return request({
    url: `/api/wms/stock/move/line/list`,
    method: 'POST',
    data
  })
}
// 仓库出入库单 新增
export function addWarehouseData(data) {
  return request({
    url: `/api/wms/stock/move/add`,
    method: 'POST',
    data
  })
}
// 仓库出入库单 删除
export function deleteWarehouseData(id) {
  return request({
    url: `/api/wms/stock/move/remove/${id}`,
    method: 'DELETE'
  })
}
// 仓库出入库单 修改
export function updateWarehouseData(data) {
  return request({
    url: `/api/wms/stock/move/modify`,
    method: 'PUT',
    data
  })
}
// 仓库出入库单 详情
export function detailWarehouseData(id) {
  return request({
    url: `/api/wms/stock/move/detail/${id}`,
    method: 'GET'
  })
}
// 仓库出入库单 根据产品选择当前的库存库位明细
export function getEffectWareLocation(data) {
  return request({
    url: `/api/wms/stock/move/stock/line`,
    method: 'POST',
    data
  })
}
// 仓库出入库单 产品工艺路线列表
export function getProductRoutingList(data) {
  return request({
    url: `/api/wms/stock/move/product/routing/list`,
    method: 'post',
    data
  })
}
// 仓库出入库单 发货清单导出
export function exportOutboundOrder(id) {
  return request({
    url: `/api/wms/stock/move/export/${id}`,
    method: 'get'
  })
}

// 仓库出入库操作 卡片列表
export function getStockOrdersCard(type) {
  return request({
    url: `/api/wms/stock/move/card/list?type=${type}`,
    method: 'GET'
  })
}
// 仓库出入库操作 卡片出库
export function cardOutbound(data) {
  let url = `/api/wms/stock/move/card/outbound`
  if (data.stockMove.sourceType === 'outbound_stock_up') { // 备货
    url = `/api/wms/stock/move/stock/up`
  }
  return request({
    url,
    method: 'POST',
    data
  })
}
// 仓库出入库操作 卡片入库
export function cardInbound(data) {
  return request({
    url: `/api/wms/stock/move/card/inbound`,
    method: 'POST',
    data
  })
}
// 仓库出入库单 自动分配
export function autoDistribute(data) {
  return request({
    url: `/api/wms/stock/move/auto/distribute`,
    method: 'post',
    data
  })
}
// 仓库出入库操作 记录-智能分配
export function recordsAutoDistribute(data) {
  return request({
    url: `/api/wms/stock/occupy/inventory/records/auto/distribute`,
    method: 'POST',
    data
  })
}
// 仓库出入库操作 调拨-自动分配
export function transferAutoDistribute(data) {
  return request({
    url: `/api/wms/stock/move/auto/distribute/by/condition`,
    method: 'POST',
    data
  })
}
// 仓库销售发货出库单 打印
export function WarehousePrintData(id) {
  return request({
    url: `/api/wms/stock/move/print/${id}`,
    method: 'GET'
  })
}
// 仓库销售发货出库单 修改打印状态
export function WarehousePrintFlag(id) {
  return request({
    url: `/api/wms/stock/move/print/flag/${id}`,
    method: 'PUT'
  })
}
// 备货单 列表
export function getStockUpList(data) {
  return request({
    url: `/api/wms/stock/up/list`,
    method: 'POST',
    data
  })
}
// 备货单 明细列表
export function getStockUpLinesList(data) {
  return request({
    url: `/api/wms/stock/up/line/list`,
    method: 'POST',
    data
  })
}
// 备货单 新增
export function addStockUpData(data) {
  return request({
    url: `/api/wms/stock/up/add`,
    method: 'POST',
    data
  })
}
// 备货单 删除
export function deleteStockUpData(id) {
  return request({
    url: `/api/wms/stock/up/remove/${id}`,
    method: 'DELETE'
  })
}
// 备货单 修改
export function updateStockUpData(data) {
  return request({
    url: `/api/wms/stock/up/modify`,
    method: 'PUT',
    data
  })
}
// 备货单 详情
export function detailStockUpData(data) {
  let url
  if (typeof data === 'string') url = `/api/wms/stock/up/detail/${data}`
  else {
    if (data.type === 'out') url = `/api/wms/stock/up/detail/out?sourceId=${data.sourceId}` // （对应出库时获取数据使用）
    else url = `/api/wms/stock/up/detail?sourceId=${data.sourceId}`
  }
  return request({
    url,
    method: 'GET'
  })
}

// 仓库销售发货出库单 装箱 打印
export function packPrintData(data) {
  return request({
    url: `/api/wms/stock/move/box/print?id=${data.id}&barcode=${data.barcode}`,
    method: 'GET',
  })
}
// 仓库销售发货出库单 装箱 导出
export function packExportData(data) {
  return request({
    url: `/api/wms/stock/move/box/export?id=${data.id}&barcode=${data.barcode}`,
    method: 'GET',
  })
}

//  仓库出入库单-箱条码列表 
export function packBarCodeData(id) {
  return request({
    url: `/api/wms/stock/move/barcode/list/${id}`,
    method: 'GET',
  })
}

//  仓库出入库单-直接出入库导入产品
export function ioBoundUpload(data, ioType) {
  return request({
    url: `/api/wms/stock/move/upload?inbound=${ioType === 'inbound'}`,
    method: 'POST',
    data
  })
}




// 获取  委外批次

export function getlistOutBatchStock(id) {
  return request({
    url: `/api/wms/stock/inventory/line/listOutBatchStock?ordersLineId=${id}`,
    method: 'get',
    
  })
}