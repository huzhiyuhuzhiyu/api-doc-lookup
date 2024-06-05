import request from '@/utils/request'
// 采购报表-采购订单明细查询
export function getPurchaseline(data) {
  return request({
    url: `/api/report/data/purchase/line/report`,
    method: 'POST',
    data
  })
}

