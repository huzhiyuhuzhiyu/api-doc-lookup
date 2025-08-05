import request from '@/utils/request'

// 装箱单 & 批次
export function getBatchPackingList(id, combined) {
  return request({
    url: `/api/erp/sale/orders/notice/packing/list/${ id }?combined=${ combined }`,
    method: 'get',
  })
}

// 装箱单 & 批次 自动和手动分配
export function allocationPacking(data) {
  return request({
    url: '/api/erp/sale/orders/notice/packing/list/allocation',
    method: 'post',
    data
  })
}

// 批次 自动和手动分配
export function allocationBatch(data) {
  return request({
    url: '/api/erp/sale/orders/notice/batch/recommendation/allocation',
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
    method: 'put',
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

// 根据条件查询拣货单列表
export function getStockPickedPage(data) {
  return request({
    url: `/api/wms/stockPicked/list/condition`,
    method: 'post',
    data
  })
}

// 推荐批次-新增（拣货单）
export function addStockedList(data) {
  return request({
    url: '/api/wms/stockPicked/insert',
    method: 'post',
    data
  })
}
