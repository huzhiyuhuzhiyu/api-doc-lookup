import request from '@/utils/request'

// 调拨管理 列表
export function getTransferList(data) {
  return request({
    url: `/api/wms/stock/picking/list`,
    method: 'POST',
    data
  })
}
// 调拨管理 明细列表
export function getTransferLinesList(data) {
  return request({
    url: `/api/wms/stock/picking/line/list`,
    method: 'POST',
    data
  })
}
// 调拨管理 新增
export function addTransferData(data) {
  return request({
    url: `/api/wms/stock/picking/add`,
    method: 'POST',
    data
  })
}
// 调拨管理 删除
export function deleteTransferData(id) {
  return request({
    url: `/api/wms/stock/picking/remove/${id}`,
    method: 'DELETE'
  })
}
// 调拨管理 修改
export function updateTransferData(data) {
  return request({
    url: `/api/wms/stock/picking/modify`,
    method: 'PUT',
    data
  })
}
// 调拨管理 详情
export function detailTransferData(id) {
  return request({
    url: `/api/wms/stock/picking/detail/${id}`,
    method: 'GET'
  })
}
// 调拨管理 接收
export function receiptConfirm(id) {
  return request({
    url: `/api/wms/stock/picking/receive/${id}`,
    method: 'POST',
    data: {}
  })
}

// 出入库箱条码

export function TransferBarCode(data) {
  return request({
    url: `/api/wms/stock/move/shelf/space/box/bar/code/list?removeShelfSpaceId=${data.removeShelfSpaceId}&isTarget=${data.isTarget}&productsId=${data.productsId}&routingLineId=${data.routingLineId}&barcode=${data.barcode}`,
    method: 'GET'
  })
}

// 投料清单-生产待领料
export function getWaitMaterialList(data) {
  return request({
    url: `/api/mrp/prod/order/material/wait/page`,
    method: 'POST',
    data
  })
}

// 投料清单-生产待领料
export function finishWaitMaterialList(data) {
  return request({
    url: `/api/mrp/prod/order/material/finish`,
    method: 'POST',
    data
  })
}