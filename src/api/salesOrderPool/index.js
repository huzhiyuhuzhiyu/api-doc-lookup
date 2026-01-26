import request from '@/utils/request'

// 根据条件查询销售订单池
export function getSalesOrderPoolPage(data) {
  return request({
    url: '/api/erp/sale/orders/lineList',
    method: 'post',
    data: data
  })
}

// 销售订单池-交期反馈
export function feedbackDeliveryOrderPool(data) {
  return request({
    url: '/api/erp/sale/orders/feedbackDelivery',
    method: 'post',
    data: data
  })
}

// 采购和外协需求池-生成采购需求
export function addPurProcurementDemandPool(data) {
  return request({
    url: '/api/erp/purProcurementDemandPool/add',
    method: 'post',
    data: data
  })
}

// 销售需求池 转生产
export function saleTransferProduction(data) {
  return request({
    url: '/api/erp/sale/orders/line/transfer/production',
    method: 'post',
    data: data
  })
}
