import request from '@/utils/request'

// 装箱单 & 批次
export function getBatchPackingList(id) {
  return request({
    url: `/api/erp/sale/orders/notice/packing/list/${ id }`,
    method: 'get',
  })
}

// 装箱单 & 批次 自动和手动分配
export function allocationBatchPacking(data) {
  return request({
    url: '/api/erp/sale/orders/notice/packing/list/allocation',
    method: 'post',
    data
  })
}

// 装箱单-新增
export function addStockPackingList(data) {
  return request({
    url: '/api/wms/stockPackingList/insert',
    method: 'post',
    data
  })
}

// 装箱单-修改
export function updateStockPackingList(data) {
  return request({
    url: '/api/wms/stockPackingList/modify',
    method: 'post',
    data
  })
}

// 装箱单-详情
export function getStockPackingListNoticeDetail(id) {
  return request({
    url: `/api/wms/stockPackingList/detail/notice/${ id }`,
    method: 'get',
  })
}
