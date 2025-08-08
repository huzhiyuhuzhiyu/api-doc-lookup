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
