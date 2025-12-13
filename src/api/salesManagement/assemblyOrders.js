import request from '@/utils/request'
// 销售订单-根据条件查询 订单列表

export function batchRevokeSaleOrder(data) {
    return request({
        url: `/api/erp/sale/orders/revoke`,
        method: 'POST',
        data
    })
}


export function getsaleOrderList(data) {
    return request({
      url: `/api/erp/sale/orders/list`,
      method: 'post',
      data
    })
  }
  // 关单
  export function closeOrders(id) {
    return request({
      url: `/api/erp/sale/orders/close?id=`+id,
      method: 'put',
    })
  }

//   明细列表
export function getsaleOrderDetailList(data) {
    return request({
      url: `/api/erp/sale/orders/line/list`,
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
  // 销售订单-详情bom列表
  export const getbomOrderDetail = (id) => {
    return request({
      url: `/api/erp/sale/orders/bom/${id}`,
      method: 'get'
    })
  }
  // 新增订单
  export function addOrders(data) {
    return request({
      url: `/api/erp/sale/orders/insert`,
      method: 'post',
      data
    })
  }
  // 修改订单
  export function editOrders(data) {
    return request({
      url: `/api/erp/sale/orders/modify`,
      method: 'put',
      data
    })
  }
// 删除订单
export const deleteOrders = (id) => {
  return request({
    url: `/api/erp/sale/orders/remove/${id}`,
    method: 'delete'
  })
}

// 销售订单明细-下达需求池
export function issuePoolSaleLines(data) {
  return request({
    url: `/api/erp/sale/orders/line/issue/pool`,
    method: 'post',
    data
  })
}

// 获取订单类型的编排属性
export const getAttributeline = (type) => {
  return request({
    url: `/api/erp/arrange/attribute/line/all/order?businessCode=`+type,
    method: 'get'
  })
}
export function getcategoryTrees(data) {
  return request({
    url: `/api/erp/partner/category/tree`,
    method: 'post',
    data: data
  })
}
// 获取客户产品列表数据
export function getcooperativeProduct(data) {
  return request({
    url: `/api/erp/cooperative/partner/product/list`,
    method: 'post',
    data: data
  })
}

// 订单分配

export function allocateOrders(data) {
  return request({
    url: `/api/erp/sale/orders/distribute`,
    method: 'post',
    data: data
  })
}
// 复制订单
export const getCopyOrders = (id) => {
  return request({
    url: `/api/erp/sale/orders/copy/${id}`,
    method: 'get'
  })
}

// 销售订单获取工作令号
export const getWorkOrderNo = (type) => {
  return request({
    url: `/api/erp/sale/orders/generate/work/no?type=`+type,
    method: 'get'
  })
}
// 导入产品
export function uploadProduct(data) {
  return request({
    url: `/api/erp/sale/orders/upload/data`,
    method: 'post',
    data: data
  })
}
// 导入金工产品
export function uploadmetalworkProduct(data) {
  return request({
    url: `/api/erp/sale/orders/upload/metalworking/data`,
    method: 'post',
    data: data
  })
}

// 明细列表汇总


export function getSaleordersTotal(data) {
  return request({
    url: `/api/erp/sale/orders/line/total`,
    method: 'post',
    data: data
  })
}



// 一键分配
export function distribute(data) {
  return request({
    url: `/api/erp/sale/orders/distribute/oneKey`,
    method: 'post',
    data: data
  })
}


// 一键分配转计划

export function distributeTransferPlan(data) {
  return request({
    url: `/api/erp/sale/orders/distributeTransferPlan/oneKey`,
    method: 'post',
    data: data
  })
}

// 销售订单明细-报表

export function getOrderLineReport(data) {
  return request({
    url: `/api/erp/sale/orders/line/report`,
    method: 'post',
    data: data
  })
}


// 销售订单  新增订单时 保存所选的产品属性
export function addBimProductAttributesRecord(data) {
  return request({
    url: `/api/zgt/bimProductAttributesRecord/batchAdd`,
    method: 'post',
    data: data
  })
}
// 获取历史属性数据
export function getBimProductAttributesRecordList(data) {
  return request({
    url: `/api/zgt/bimProductAttributesRecord/list`,
    method: 'post',
    data: data
  })
}
// 删除历史属性

export const delBimProductAttributesRecord = (id) => {
  return request({
    url: `/api/zgt/bimProductAttributesRecord/del/${id}`,
    method: 'delete'
  })
}
// 销售发货报表

export const saleDeliveryReport = (data) => {
  return request({
    url: `/api/report/data/sale/delivery/report`,
    method: 'post',
    data
  })
}
// 产品汇总报表
export const saleProductReport = (data) => {
  return request({
    url: `/api/report/data/sale/product/report`,
    method: 'post',
    data
  })
}
// 客户销售汇总报表
export const saleCustomerReport = (data) => {
  return request({
    url: `/api/report/data/sale/customer/report`,
    method: 'post',
    data
  })
}
// 获取中亚备注
export const getSaleHistoryRemark = (data) => {
  return request({
    url: `/api/erp/sale/orders/ordersRemark`,
    method: 'post',
    data
  })
}


// 部分关单
export const closeSaleOrderLine = (data) => {
  return request({
    url: `/api/erp/sale/orders/line/close`,
    method: 'put',
    data
  })
}
// 删除中亚备注
export const delSaleHistoryRemark = (id) => {
  return request({
    url: `/api/erp/sale/orders/ordersRemark/remove/${id}`,
    method: 'delete',
  })
}
// 附件上传
export const attachmentsUpdate = (data) => {
  return request({
    url: `/api/erp/attachments/insetOrUpdate`,
    method: 'put',
    data
  })
}
