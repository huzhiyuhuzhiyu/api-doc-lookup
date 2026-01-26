import request from '@/utils/request'

// 采购图纸确认-列表
export function getPurPurchaseDrawingPage(data) {
  return request({
    url: '/api/erp/purPurchaseDrawing/list/condition',
    method: 'post',
    data: data
  })
}


// 采购图纸确认-详情
export function getPurPurchaseDrawing(data) {
  return request({
    url: `/api/erp/purPurchaseDrawing/detail`,
    method: 'post',
    data
  })
}

// 新增公司信息
export function addPurPurchaseDrawing(data) {
  return request({
    url: '/api/erp/purPurchaseDrawing/insert',
    method: 'post',
    data: data
  })
}

// 采购图纸确认-变更记录列表
export function getChangeRecordListPage(data) {
  return request({
    url: '/api/erp/purPurchaseDrawing/changeRecordList/condition',
    method: 'post',
    data: data
  })
}

// 采购图纸历史确认
export function getHistoricalDrawings(productsId) {
  return request({
    url: `/api/erp/purPurchaseDrawing/historical/drawings/view/${productsId}`,
    method: 'GET',
  })
}

// 生产图纸确认-列表
export function getProductionDrawingPage(data) {
  return request({
    url: '/api/erp/purPurchaseDrawing/list/production/condition',
    method: 'post',
    data: data
  })
}

