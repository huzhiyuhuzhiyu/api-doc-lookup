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