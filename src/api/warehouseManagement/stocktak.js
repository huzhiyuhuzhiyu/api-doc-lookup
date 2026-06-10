import request from '@/utils/request'
// 盘点单 列表
export function getStocktak(data) {
  return request({
    url: `/api/zgt/stockTaking/list/condition`,
    method: 'POST',
    data
  })
}

// 盘点单新建——选择产品

export function getInventProduct(data) {
  return request({
    url: `/api/zgt/stockTaking/products/list`,
    method: 'POST',
    data
  })
}

// 盘点单——新增
export function addStocktak(data) {
  return request({
    url: `/api/zgt/stockTaking/insert`,
    method: 'post',
    data
  })
}
// 盘点单——详情

export function detailStocktak(id) {
  return request({
    url: `/api/zgt/stockTaking/detail/`+id,
    method: 'get',
    
  })
}
// 盘点单——修改

export function editStocktak(data) {
  return request({
    url: `/api/zgt/stockTaking/modify`,
    method: 'put',
    data
  })
}

// 盘点单——删除

export function deleteStocktak(id) {
  return request({
    url: `/api/zgt/stockTaking/remove/${id}`,
    method: 'delete',
    data
  })
}
// 盘点单详情页面——导出

export function productExport(data) {
  return request({
    url: `/api/zgt/stockTaking/products/export`,
    method: 'post',
    data
  })
}
// 盘点单详情页面——导入

export function productImport(data) {
  return request({
    url: `/api/zgt/stockTaking/products/upload`,
    method: 'post',
    data
  })
}








// 调整单列表

export function getstockTakingAdjustList(data) {
  return request({
    url: `/api/zgt/stockTakingAdjust/list/condition`,
    method: 'POST',
    data
  })
}
// 调整单详情

export function getstockTakingAdjustDetail(id) {
  return request({
    url: `/api/zgt/stockTakingAdjust/detail/${id}`,
    method: 'get',
  })
}

// 盘点单转调整单

export function stockTakingToAdjus(id) {
  return request({
    url: `/api/zgt/stockTaking/toAdjust/${id}`,
    method: 'get',
  })
}
export function addstockTakingAdjustList(data) {
  return request({
    url: `/api/zgt/stockTakingAdjust/insert`,
    method: 'POST',
    data
  })
}
