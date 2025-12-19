import request from '@/utils/request'

// 采购收货记录报表
export function purchaseReceiveReport(data) {
  return request({
    url: '/api/report/data/purchase/receive/report',
    method: 'post',
    data
  })
}
