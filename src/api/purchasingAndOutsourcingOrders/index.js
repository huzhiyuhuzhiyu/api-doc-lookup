import request from '@/utils/request'
// 采购 和 外协订单单 
// 采购订单 新增
export function insertPurchaseOrder(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/insertPurchaseOrder`,
      method: 'post',
      data
    })
  }
// 外协订单生成

export function insertOutOrder(data) {
  return request({
    url: `/api/erp/purPurchaseOrder/insertOutOrder`,
    method: 'post',
    data
  })
}
  // 列表
  export function purchaseOrderList(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/list/condition`,
      method: 'post',
      data
    })
  }
  //明细列表
  export function detailpurchaseOrderList(data) {
    return request({
      url: `/api/erp/purPurchaseOrderLine/list/condition`,
      method: 'post',
      data
    })
  }

    // 采购和外协订单明细
    export function purchaseOrderReport(data) {
      return request({
        url: `/api/erp/purPurchaseOrderLine/report`,
        method: 'post',
        data
      })
    }

  //详情
  export const purPurchaseOrderdetail = (id) => {
    return request({
      url: `/api/erp/purPurchaseOrder/detail/${id}`,
      method: 'get'
    })
  }

  //下载订货单
  export const purPurchaseOrderExport = (id) => {
    return request({
      url: `/api/erp/purPurchaseOrder/export/${id}`,
      method: 'get'
    })
  }

  // 新增 外协工序订单

  export function insertOutProcessOrder(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/insertExternalProcess`,
      method: 'post',
      data
    })
  }
  // 修改
  export function editProcessOrder(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/modifyExternalProcess`,
      method: 'put',
      data
    })
  }

  // 删除
  export const deleteProcessOrder = (id) => {
    return request({
      url: `/api/erp/purPurchaseOrder/removeExternalProcess/${id}`,
      method: 'delete'
    })
  }

  // 供应商产品单价
  export function partnerProductPrice(data) {
    return request({
      url: `/api/erp/purProcurementDemandPool/product/price`,
      method: 'post',
      data
    })
  }
  // 产品单价列表
 
  export const priceList = (id) => {
    return request({
      url: `/api/erp/purProcurementDemandPool/priceList/${id}`,
      method: 'get'
    })
  }


  // 批量完成
  export function purPurchaseBatch(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/batch`,
      method: 'put',
      data
    })
  }

  // 批量停止
  export function purPurchaseBatchLine(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/batch/line`,
      method: 'put',
      data
    })
  }

  // 进度跟踪
 
  export function orderSchedule(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/schedule/list`,
      method: 'post',
      data
    })
  }
