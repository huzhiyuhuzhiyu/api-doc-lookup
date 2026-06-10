import request from '@/utils/request'

// 采购收货记录报表
export function purchaseReceiveReport(data) {
  return request({
    url: '/api/report/data/purchase/receive/report',
    method: 'post',
    data
  })
}

// 在库重检 报表
export function prodOrderRecheckReport(data) {
  return request({
    url: '/api/mrp/prod/order/recheck/report',
    method: 'post',
    data
  })
}
