import request from '@/utils/request'
// 销售订单-根据条件查询 订单列表

export function getsaleOrderList(data) {
    return request({
      url: `/api/erp/sale/orders/list`,
      method: 'post',
      data
    })
  }
    // 订单详情
    export const getOrderDetail = (id) => {
        return request({
          url: `/api/erp/sale/orders/detail/${id}`,
          method: 'get'
        })
      }
    //   订单明细
      export function getsaleOrderLineList(data) {
        return request({
          url: `/api/erp/sale/orders/line/list`,
          method: 'post',
          data
        })
      }
      // 计划管理 列表
export function getPlanList(data) {
    return request({
      url: `/api/mrp/plan/list`,
      method: 'POST',
      data
    })
  }
//   采购
  export function purchaseOrderList(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/list/condition`,
      method: 'post',
      data
    })
  }
//   领料
  export function WithdrawalList(data) {
    return request({
      url: `/api/mrp/material/collect/list`,
      method: 'POST',
      data
    })
  }
  // 生产订单列表
export function getprodOrderList(data) {
    return request({
      url: `/api/mrp/prod/order/page`,
      method: 'post',
      data
    })
  }
  // 仓库出入库单 列表
export function getWarehouseList(data) {
  return request({
    url: `/api/wms/stock/move/list`,
    method: 'POST',
    data
  })
}
//发货列表
export function getQuotationdatasendlist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/list`,
    method: 'post',
    data
  })
}

// 对账收款
export function getfinAccountList(data) {
    return request({
      url: `/api/erp/finAccountsReceivableReconciliation/list/condition`,
      method: 'post',
      data
    })
  }