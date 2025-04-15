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
/**
 * 批量撤回
 * @param data
 * @returns {*}
 */
export function batchRevokeOrder(data) {
    return request({
        url: `/api/erp/purPurchaseOrder/revoke`,
        method: 'POST',
        data
    })
}
export function insertOutOrder(data) {
  return request({
    url: `/api/erp/purPurchaseOrder/insertOutOrder`,
    method: 'post',
    data
  })
}

  // 外协订单修改
  export function editOutOrder(data) {
    return request({
      url: `/api/erp/purPurchaseOrder/modifyOutOrder`,
      method: 'put',
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
  // 删除
  export const deletePurPurchaseOrder = (id) => {
    return request({
      url: `/api/erp/purPurchaseOrder/remove/${id}`,
      method: 'delete'
    })
  }

    // 采购和外协订单明细-报表
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

    // 库存管理明细-列表
    export function inventoryList(data) {
      return request({
        url: `/api/wms/stock/inventory/line/list`,
        method: 'post',
        data
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

  export function purPurchaseReceiptReturnGoodsList(data) {
    return request({
      url: `/api/erp/purPurchaseReceiptReturnGoods/list`,
      method: 'post',
      data
    })
  }

  // 采购和外协订单明细-发料清单报表
  export function shipmentReport(data) {
    return request({
      url: `/api/erp/purPurchaseOrderLine/shipment/report`,
      method: 'post',
      data
    })
  }


  // 采购和外协订单明细-发料清单列表
  export function shipmentList(data) {
    return request({
      url: `/api/erp/purPurchaseOrderLine/shipment/list`,
      method: 'post',
      data
    })
  }

  // 采购和外协订单明细-获取最后一次记录

  export const purPurchaseOrderLineLast = (data) => {
    return request({
      url: `/api/erp/purPurchaseOrderLine/last`,
      method: 'post',
      data
    })
  }
  // 批量撤回收货单
  
  export const batchWithdrawalOrder = (data) => {
    return request({
      url: `/api/erp/purPurchaseReceiptReturnGoods/revoke`,
      method: 'post',
      data
    })
  }


  // 委外关联产品列表
  export const outRelatedProductList = (data) => {
    return request({
      url: `/api/zgt/purPurchaseRelatedOutProduct/list`,
      method: 'post',
      data
    })
  }

   // 委外关联产品列表——新增
  export const addOutRelatedProduct = (data) => {
    return request({
      url: `/api/zgt/purPurchaseRelatedOutProduct/add`,
      method: 'post',
      data
    })
  }
     // 委外关联产品列表——编辑
     export const editOutRelatedProduct = (data) => {
      return request({
        url: `/api/zgt/purPurchaseRelatedOutProduct/update`,
        method: 'put',
        data
      })
    }
      // 委外关联产品列表——删除
      export const delOutRelatedProduct = (id) => {
        return request({
          url: `/api/zgt/purPurchaseRelatedOutProduct/del/${id}`,
          method: 'delete',
          
        })
      }
      
