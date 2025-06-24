import request from '@/utils/request'
// 申请停止订单

  //  列表数据
  export function getOrdersChangeList(data) {
    return request({
      url: `/api/erp/sale/orders/change/page`,
      method: 'post',
      data
    })
  }
  // 新增

  export function addOrdersChange(data) {
    return request({
      url: `/api/erp/sale/orders/change/add`,
      method: 'post',
      data
    })
  }
  // 删除
  export function deleteOrdersChange(id) {
    return request({
      url: `/api/erp/sale/orders/change/del/${id}`,
      method: 'delete',
    })
  }
  // 修改
  export function editOrdersChange(data) {
    return request({
      url: `/api/erp/sale/orders/change/update`,
      method: 'put',
      data
    })
  }
  // 详情
  export function getOrdersChangeInfo(id) {
    return request({
      url: `/api/erp/sale/orders/change/detail/${id}`,
      method: 'get',
    })
  }



    // 详情
    export function getOrdersChangeLineList(data) {
      return request({
        url: `/api/erp/sale/orders/change/line/list`,
        method: 'post',
        data
      })
    }
 // 采购订单变更-新增
export function addPurchaseChange(data) {
  return request({
    url: `/api/erp/purchaseChange/add`,
    method: 'post',
    data
  })
}
// 删除
export function deletePurchaseChange(id) {
  return request({
    url: `/api/erp/purchaseChange/del/${id}`,
    method: 'delete',
  })
}
// 修改
export function editPurchaseChange(data) {
  return request({
    url: `/api/erp/purchaseChange/update`,
    method: 'put',
    data
  })
}
// 详情
export function getPurchaseChangeDetail(id) {
  return request({
    url: `/api/erp/purchaseChange/detail/${id}`,
    method: 'get',
  })
}
//明细
export function getPurchaseChangeLineList(data) {
  return request({
    url: `/api/erp/purchaseChange/line/list`,
    method: 'post',
    data
  })
}
//列表
export function getPurchaseChangeList(data) {
  return request({
    url: `/api/erp/purchaseChange/page`,
    method: 'post',
    data
  })
}
