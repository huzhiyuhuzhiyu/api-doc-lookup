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
export function getPurPurchaseDrawing(id) {
  return request({
    url: `/api/erp/purPurchaseDrawing/detail/${ id }`,
    method: 'get',
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
