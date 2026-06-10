import request from '@/utils/request'

// 销售报表-销售接单-列表
export function getSaleReceiveList(data) {
  return request({
    url: `/api/report/data/sale/receive/list`,
    method: 'POST',
    data
  })
}
// 销售报表-销售接单-导出
export function exportSaleReceiveData(data) {
  return request({
    url: `/api/report/data/sale/receive/export`,
    method: 'POST',
    data
  })
}
// 销售报表-销售发货-列表
export function getSaleDeliveryList(data) {
  return request({
    url: `/api/report/data/sale/delivery/list`,
    method: 'POST',
    data
  })
}
// 销售报表-销售发货-导出
export function exportSaleDeliveryData(data) {
  return request({
    url: `/api/report/data/sale/delivery/export`,
    method: 'POST',
    data
  })
}

// 销售订单-明细查询

export function getSaleLineReport(data) {
  return request({
    url: `/api/report/data/sale/line/report`,
    method: 'POST',
    data
  })
}
// 销售订单-出库明细查询

export function getSaleOutboundReport(data) {
  return request({
    url: `/api/report/data/sale/outbound/line/report`,
    method: 'POST',
    data
  })
}
// 生产报表-报工记录查询
export function getWorkReportrecords(data) {
  return request({
    url: `/api/report/data/produce/work/report`,
    method: 'POST',
    data
  })
}
// 生产报表-用料跟踪报表
export function getMaterialtrackingreport(data) {
  return request({
    url: `/api/report/data/produce/material/list/report`,
    method: 'POST',
    data
  })
}
// 生产报表-派工单跟踪报表
export function getdispatchlist(data) {
  return request({
    url: `/api/report/data/produce/dispatch/list/report`,
    method: 'POST',
    data
  })
}
// 生产报表-总成分析报表
export function getmateriallist(data) {
  return request({
    url: `/api/report/data/produce/material/unpack/report`,
    method: 'POST',
    data
  })
}

// 销售报表-销售出库进度查询
export function saleOutboundSchedule(data) {
  return request({
    url: `/api/report/data/sale/outbound/schedule/report`,
    method: 'POST',
    data
  })
}
