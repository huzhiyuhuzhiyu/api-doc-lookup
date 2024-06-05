import request from '@/utils/request'
// 结存
// 库存结存列表
export function stockBalanceList(data) {
    return request({
      url: `/api/wms/stock/balance/list`,
      method: 'post',
      data
    })
  }
// 库存结存 报表
export function stockBalanceReport(data) {
    return request({
      url: `/api/wms/stock/balance/report`,
      method: 'post',
      data
    })
  }
// 库存结存出入库数量明细列表
export function stockBalanceLineList(data) {
    return request({
      url: `/api/wms/stock/balance/line/list`,
      method: 'post',
      data
    })
  }


// 库存结存-可结存账期
export const canStockBalance = () => {
  return request({
    url: `/api/wms/stock/balance/can`,
    method: 'get'
  })
}
// 库存结存 结存
export function stockBalance(data) {
  return request({
    url: `/api/wms/stock/balance?accountPeriod=${data.accountPeriod}`,
    method: 'post',
    data
  })
}


// 销售 采购 外协 收付款结存
//  报表
export function paymentBalanceReport(data) {
  return request({
    url: `/api/erp/payment/balance/report`,
    method: 'post',
    data
  })
}

// 可结存账期
export const paymentBalanceCan = (reconciliationType) => {
  return request({
    url: `/api/erp/payment/balance/can?reconciliationType=${reconciliationType}`,
    method: 'get'
  })
}
//  结存
export function paymentBalance(data) {
  return request({
    url: `/api/erp/payment/balance?accountPeriod=${data.accountPeriod}&reconciliationType=${data.reconciliationType}`,
    method: 'post',
    data
  })
}

// 出入库明细列表
export function paymentStockLine(data) {
  return request({
    url: `/api/erp/payment/balance/stock/line/list`,
    method: 'post',
    data
  })
}

// 实际成本列表
export function actualCostList(data) {
  return request({
    url: `/api/wms/self/made/actual/batches/cost/report`,
    method: 'post',
    data
  })
}
// 详情

export const costDetail = (id) => {
  return request({
    url: `/api/wms/self/made/actual/batches/cost/detail/${id}`,
    method: 'get'
  })
}