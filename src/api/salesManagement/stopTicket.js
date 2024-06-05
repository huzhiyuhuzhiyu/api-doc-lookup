import request from '@/utils/request'
// 申请停止订单

  //  列表数据
  export function getQuotationList(data) {
    return request({
      url: `/api/erp/sale/orders/apply/stop/list`,
      method: 'post',
      data
    })
  }
  // 新增
 
  export function addApplyStopOrders(data) {
    return request({
      url: `/api/erp/sale/orders/apply/stop/add`,
      method: 'post',
      data
    })
  }
  // 删除
  export function deleteApplyStopOrders(id) {
    return request({
      url: `/api/erp/sale/orders/apply/stop/remove/${id}`,
      method: 'delete',
    })
  }
  // 修改
  export function editApplyStopOrders(data) {
    return request({
      url: `/api/erp/sale/orders/apply/stop/modify`,
      method: 'put',
      data
    })
  }
  // 详情
  export function getApplyStopOrders(id) {
    return request({
      url: `/api/erp/sale/orders/apply/stop/detail/${id}`,
      method: 'get',
    })
  }


  // 明细列表
  
  export function ordersStopLineList(data) {
    return request({
      url: `/api/erp/sale/orders/apply/stop/line/list`,
      method: 'post',
      data
    })
  }