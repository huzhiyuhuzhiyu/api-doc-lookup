import request from '@/utils/request'
// 报价BOM
//  列表数据
export function getQuotationBOMList (data) {
  return request({
    url: `/api/erp/sale/quotation/bom/list`,
    method: 'post',
    data
  })
}
// BOM价格查询
export function getBOMPriceList (data) {
  return request({
    url: `/api/erp/sale/quotation/bom/list/bom`,
    method: 'post',
    data
  })
}
// 报价BOM-批量转生产BOM
export function batchBomTransfer (data) {
  return request({
    url: `/api/erp/sale/quotation/bom/batch/transfer`,
    method: 'post',
    data
  })
}

// 新增

export function addQuotationBOMData (data) {
  return request({
    url: `/api/erp/sale/quotation/bom/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteQuotationBOMData (id) {
  return request({
    url: `/api/erp/sale/quotation/bom/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editQuotationBOMData (data) {
  return request({
    url: `/api/erp/sale/quotation/bom/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getQuotationBOMInfo (id) {
  return request({
    url: `/api/erp/sale/quotation/bom/detail/${id}`,
    method: 'get',
  })
}
// 检查编码是否重复

export function checkQuotationBOMCode (code, id) {
  return request({
    url: `/api/erp/sale/quotation/bom/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}
// 校验图号是否重复

export function checkQuotationBOMDrawing (code, id) {
  return request({
    url: "/api/erp/sale/quotation/bom/check/customer/drawing/exist?customerDrawingNo=" + code + '&id=' + id,
    method: 'get',
  })
}
// 校验客户物料号是否重复

export function checkCustomerProductNo (code) {
  return request({
    url: "/api/erp/sale/quotation/bom/check/customer/product/exist?customerProductNo=" + code,
    method: 'get',
  })
}

// 销售报价

//金额计算
export function calculatequotationData (customerDrawingNumber) {
  return request({
    url: `/api/erp/sale/quotation/amountsCount?customerProductNo=${customerDrawingNumber}`,
    method: 'get',
  })
}

//金额计算(输入规格型号)
export function calculatequotationSpecData (customerDrawingNumber,spec) {
  return request({
    url: `/api/erp/sale/quotation/amountsCount?customerProductNo=${customerDrawingNumber}&spec=${spec}`,
    method: 'get',
  })
}

//  列表数据
export function getQuotationLists (data) {
  return request({
    url: `/api/erp/sale/quotation/list`,
    method: 'post',
    data
  })
}
//  明细列表数据
export function getQuotationmxLists (data) {
  return request({
    url: `/api/erp/sale/quotation/detail/list`,
    method: 'post',
    data
  })
}
// 新增
export function addQuotationData (data) {
  return request({
    url: `/api/erp/sale/quotation/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteQuotationData (id) {
  return request({
    url: `/api/erp/sale/quotation/remove/${id}`,
    method: 'delete',
  })
}
//生成客户产品
export function denerateQuotationMData (data) {
  return request({
    url: `/api/erp/sale/quotation/insertProduct`,
    method: 'put',
    data
  })
}
// 修改
export function editQuotationMData (data) {
  return request({
    url: `/api/erp/sale/quotation/modify`,
    method: 'put',
    data
  })
}
// 修改
export function editCooperativePartner (data) {
  return request({
    url: `/api/erp/sale/quotation/modify/cooperative`,
    method: 'put',
    data
  })
}
// 详情
export function getQuotationInfo (id) {
  return request({
    url: `/api/erp/sale/quotation/detail/${id}`,
    method: 'get',
  })
}
// 详情
export function getQuotationDetailMinimum (id) {
  return request({
    url: `/api/erp/sale/quotation/detail/minimum/${id}`,
    method: 'get',
  })
}
// 销售报价-提交
export function submitSaleQuotation (id) {
  return request({
    url: `/api/erp/sale/quotation/submit/${id}`,
    method: 'put',
  })
}
// 销售报价-重新询价
export function saleAgainQuotation (id) {
  return request({
    url: `/api/erp/sale/quotation/again/quotation/${id}`,
    method: 'get',
  })
}
// 销售报价-报价
export function quotationSale(data) {
  return request({
    url: '/api/erp/sale/quotation/quotation',
    method: 'PUT',
    data
  })
}
// 销售报价-导入产品
export function saleUploadData(data) {
  return request({
    url: `/api/erp/sale/quotation/upload/data`,
    method: 'post',
    data
  })
}
// 销售报价-导入产品
export function saleUploadProductData(data) {
  return request({
    url: `/api/erp/sale/quotation/upload/product/data`,
    method: 'post',
    data
  })
}
// 销售报价-导入获取牌价
export function saleUploadAmountsCount(data) {
  return request({
    url: `/api/erp/sale/quotation/upload/amountsCount`,
    method: 'post',
    data
  })
}

//销售合同

//  列表数据
export function getQuotationdatalist (data) {
  return request({
    url: `/api/erp/sale/contracts/list`,
    method: 'post',
    data
  })
}
//  明细列表数据
export function getQuotationdatamxlist (data) {
  return request({
    url: `/api/erp/sale/contracts/line/list`,
    method: 'post',
    data
  })
}
// 新增
export function addQuotationlist (data) {
  return request({
    url: `/api/erp/sale/contracts/add`,
    method: 'post',
    data
  })
}
// 删除
export function deleteQuotationlist (id) {
  return request({
    url: `/api/erp/sale/contracts/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editQuotationMlist (data) {
  return request({
    url: `/api/erp/sale/contracts/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getQuotationlist (id) {
  return request({
    url: `/api/erp/sale/contracts/detail/${id}`,
    method: 'get',
  })
}
// 检查编码是否重复
export function checkQuotationBOMCodelist (contractNo, id) {
  return request({
    url: `/api/erp/sale/contracts/check/contract/exist?contractNo=` + contractNo + '&id=' + id,
    method: 'get',
  })
}

//退发货通知单-列表
//明细列表
export function getQuotationdatasenddatalist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/line/list`,
    method: 'post',
    data
  })
}

//外协退发料通知单明细-列表
export function getOutlineDatalist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/out/line/list`,
    method: 'post',
    data
  })
}

//列表
export function getQuotationdatasendlist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/list`,
    method: 'post',
    data
  })
}
// 获取分类类型
export function getStockMoveList (data,warehouseCode) {
  return request({
    url: `/api/wms/stock/move/todo/list?warehouseCode=${warehouseCode}`,
    method: 'POST',
    data
  })
}

// 获取租户分类类型
export function getStockMoveTenantlist (data,projectId,warehouseCode,tenant) {
  let classAttributeList=data.classAttributeList
  return request({
    url: `/api/wms/stock/move/todo/tenant/list?projectId=${projectId}&warehouseCode=${warehouseCode}&tenant=${tenant}`,
    method: 'POST',
    data
  })
}
// 新增
export function addQuotationsendlist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/add`,
    method: 'post',
    data
  })
}
// 删除
export function deleteQuotationsendlist (id) {
  return request({
    url: `/api/erp/sale/orders/notice/del/${id}`,
    method: 'delete',
  })
}
// 修改
export function editQuotationMsendlist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/update`,
    method: 'put',
    data
  })
}
// 详情
export function getQuotationsendlist (id) {
  return request({
    url: `/api/erp/sale/orders/notice/detail/${id}`,
    method: 'get',
  })
}
//收货
export function editReceiptnoticelist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/receipt`,
    method: 'put',
    data
  })
}
// 报价单-导出
export function exportSaleQuotation (id,hasInclude) {
  return request({
    url: `/api/erp/sale/quotation/export/fill/${id}/${hasInclude}`,
    method: 'get',
  })
}
//批量取消发货
export function Cancelshipmentlist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/batch`,
    method: 'put',
    data
  })
}
//批量合并订单
export function mergelist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/merge`,
    method: 'put',
    data
  })
}
//批量拆分订单
export function splitlist (id) {
  return request({
    url: `/api/erp/sale/orders/notice/split/${id}`,
    method: 'put'
  })
}
//明细取消发货
export function Cancelshipmentlinelist (id) {
  return request({
    url: `/api/erp/sale/orders/notice/batch/line/${id}`,
    method: 'put'
  })
}

// 导出无价格
export function exportNoProduct (data) {
  return request({
    url: `/api/erp/sale/quotation/no/price/export`,
    method: 'post',
    data
  })
}

//明细取消发货
export function CancelshipmentlineOutlist (data) {
  return request({
    url: `/api/erp/sale/orders/notice/out/batch/`,
    method: 'put',
    data
  })
}
// 销售待发货撤回
export function withdrawApi (id) {
  return request({
    url: `/api/erp/sale/orders/notice/revoke/${id}`,
    method: 'post',

  })
}

// // 退发货通知单-仓库确认
// export function confirmOrdersNotice (data) {
//   return request({
//     url: `/api/erp/sale/orders/notice/confirm/${data.id}`,
//     method: 'get',
//   })
// }

// 退发货通知单-包装组、拣货组确认
export function confirmOrdersNotice (data) {
  return request({
    url: `/api/erp/sale/orders/notice/confirm`,
    method: 'post',
    data
  })
}

// 发货通知单-送货单确认
export function confirmSaleOrdersNotice (id) {
  return request({
    url: `/api/erp/sale/orders/notice/delivery/confirmation/${id}`,
    method: 'GET',
  })
}

// 根据产品id去查历史报价
export function getHistoricalQuotationByProductsId (productsId) {
  return request({
    url: `/api/erp/sale/quotation/historicalQuotation/${productsId}`,
    method: 'get',
  })
}

// 退发货通知单-批量批准
export function approveOrdersNotice (data) {
  return request({
    url: `/api/erp/sale/orders/notice/approve`,
    method: 'post',
    data
  })
}

// 退发货通知单-批量拒绝
export function refuseOrdersNotice (data) {
  return request({
    url: `/api/erp/sale/orders/notice/refuse`,
    method: 'post',
    data
  })
}
