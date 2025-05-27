import request from '@/utils/request'
// 采购询价单 
// 采购列表
export function getbuyInquirySheetList(data) {
  return request({
    url: `/api/erp/buyInquirySheet/list/condition`,
    method: 'post',
    data
  })
}
// //   查询询价单列表
// export function getbuyInquirySheetDetailList(data) {
//     return request({
//       url: `/api/erp/buyInquirySheet/list/condition`,
//       method: 'post',
//       data
//     })
//   }
// 询价单详情
export const getbuyInquirySheetDetail = (id) => {
  return request({
    url: `/api/erp/buyInquirySheet/detail/${id}`,
    method: 'get'
  })
}
// 新增询价单
export function addbuyInquirySheet(data) {
  return request({
    url: `/api/erp/buyInquirySheet/insert`,
    method: 'post',
    data
  })
}
// 修改询价单
export function editbuyInquirySheet(data) {
  return request({
    url: `/api/erp/buyInquirySheet/modify`,
    method: 'put',
    data
  })
}
// 删除询价单
export const deletebuyInquirySheet = (id) => {
  return request({
    url: `/api/erp/buyInquirySheet/remove/${id}`,
    method: 'delete'
  })
}
// 检查物料有无牌价

export function checkbuyInquirySheet(data) {
  return request({
    url: `/api/erp/buyInquirySheet/check`,
    method: 'post',
    data
  })
}


// 定点定价
// 定点定价列表

export function getbuyFixedPointPricingList(data) {
  return request({
    url: `/api/erp/buyFixedPointPricing/list/condition`,
    method: 'post',
    data
  })
}
// 定点定价详情
export const getbuyFixedPointPricingDetail = (id) => {
  return request({
    url: `/api/erp/buyFixedPointPricing/detail/${id}`,
    method: 'get'
  })
}
//定点定价新增
export function addbuyFixedPointPricing(data) {
  return request({
    url: `/api/erp/buyFixedPointPricing/insert`,
    method: 'post',
    data
  })
}
// 定点定价修改
export function editbuyFixedPointPricing(data) {
  return request({
    url: `/api/erp/buyFixedPointPricing/modify`,
    method: 'put',
    data
  })
}

// 定点定价-导入产品
export function buyFixedPointPricingUploadData(data) {
  return request({
    url: `/api/erp/buyFixedPointPricing/upload/data`,
    method: 'post',
    data
  })
}
// 牌价设置 明细列表
export function buyFixedPointPricingDetailList(data) {
  return request({
    url: `/api/erp/buyFixedPointPricing/detail/list/condition`,
    method: 'post',
    data
  })
}
// 删除
export const deletebuyFixedPointPricing = (id) => {
  return request({
    url: `/api/erp/buyFixedPointPricing/remove/${id}`,
    method: 'delete'
  })
}

// 牌价修改
export function modifyListPrice(data) {
  return request({
    url: `/api/erp/buyFixedPointPricing/modifyListPrice`,
    method: 'put',
    data
  })
}

// 请购单
// 列表
export function getPurProcurementRequirementsList(data) {
  return request({
    url: `/api/erp/purProcurementRequirements/list`,
    method: 'post',
    data
  })
}

// 详情
export const getShipmentList = (data) => {
  return request({
    url: `/api/erp/purPurchaseOrder/getShipmentList`,
    method: 'get',
    data
  })
}

// 详情
export const getpurProcurementRequireDetail = (id) => {
  return request({
    url: `/api/erp/purProcurementRequirements/detail/${id}`,
    method: 'get'
  })
}

// 新增
export function addpurProcurementRequire(data) {
  return request({
    url: `/api/erp/purProcurementRequirements/insert`,
    method: 'post',
    data
  })
}
// 修改
export function editpurProcurementRequire(data) {
  return request({
    url: `/api/erp/purProcurementRequirements/modify`,
    method: 'put',
    data
  })
}

// 删除
export const deletepurProcurementRequire = (id) => {
  return request({
    url: `/api/erp/purProcurementRequirements/remove/${id}`,
    method: 'delete'
  })
}

// 明细
export const purProcurementRequirementsList = (id) => {
  return request({
    url: `/api/erp/purProcurementRequirements/detail/list/${id}`,
    method: 'get'
  })
}

//采购和外协需求池
// 采购列表
export function purProcurementDemandPoolList(data) {
  return request({
    url: `/api/erp/purProcurementDemandPool/procureList`,
    method: 'post',
    data
  })
}
// 外协列表

export function purexternalDemandPoolList(data) {
  return request({
    url: `/api/erp/purProcurementDemandPool/externalList`,
    method: 'post',
    data
  })
}


// 采购和外协收退货通知单-

// 采购收货通知单 列表
export function purPurchaseReceiptReturnGoodsList(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/list`,
    method: 'post',
    data
  })
}

// 采购和外协收退货通知单-明细列表
export function purPurchaseReceiptReturnGoodsDetailList(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/line/list`,
    method: 'post',
    data
  })
}

// 新增
export function addpurPurchaseReceiptReturnGoods(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/insert`,
    method: 'post',
    data
  })
}

// 修改
export function editpurPurchaseReceiptReturnGoods(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/modify`,
    method: 'put',
    data
  })
}

//删除
export const deletepurPurchaseReceiptReturnGoods = (id) => {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/remove/${id}`,
    method: 'delete'
  })
}

// 明细
export const detailpurPurchaseReceiptReturnGoods = (id) => {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/detail/list/${id}`,
    method: 'get'
  })
}
// 详情
export const getpurPurchaseReceiptReturnGoodsdetail = (id) => {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/detail/${id}`,
    method: 'get'
  })
}
// 发料清单列表

export const purProcurementDemandPoolexternal = (id) => {
  return request({
    url: `/api/erp/purProcurementDemandPool/external/${id}`,
    method: 'get'
  })
}

// 通过外协订单 id拿到发料明细列表

export const outPoolexternal = (id) => {
  return request({
    url: `/api/erp/purPurchaseOrder/getOutShipmentList/${id}`,
    method: 'get'
  })
}

// 外协发料清单 新增
export function addoutReceiptGoods(data) {
  return request({
    url: `/api/erp/sale/orders/notice/out/add`,
    method: 'post',
    data
  })
}
// 修改
export function updateoutReceiptGoods(data) {
  return request({
    url: `/api/erp/sale/orders/notice/out/update`,
    method: 'put',
    data
  })
}


// 外协发退料 发退货明细列表
export function linesReceiptGoods(data) {
  return request({
    url: `/api/erp/sale/orders/notice/line/list`,
    method: 'post',
    data
  })
}

// 请购单 明细列表
export function linesRequirements(data) {
  return request({
    url: `/api/erp/purProcurementRequirements/detail/list`,
    method: 'post',
    data
  })
}
// 询价单  明细列表
export function linesBuyInquirySheetLine(data) {
  return request({
    url: `/api/erp/buyInquirySheetLine/list/condition`,
    method: 'post',
    data
  })
}
// 询价-导入产品
export function linesBuyInquiryUploadData(data) {
  return request({
    url: `/api/erp/buyInquirySheet/upload/data`,
    method: 'post',
    data
  })
}

// 定点定价 明细列表
export function linesbuyFixedPointPricing(data) {
  return request({
    url: `/api/erp/buyFixedPointPricingLine/list/condition`,
    method: 'post',
    data
  })
}

// 采购和外协收退货明细列表接口
export function linesReceiptReturn(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/detail/list`,
    method: 'post',
    data
  })
}



// 外协采购需求池  来源明细

export function getPoolSourceList(data) {
  return request({
    url: `/api/mrp/demand/pool/source/list`,
    method: 'post',
    data
  })
}

// 收退货通知单 批量完成 停止
// 批量完成
export function purPurchaseGoodsBatch(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/batch`,
    method: 'put',
    data
  })
}

// 批量停止
export function purPurchaseGoodsBatchLine(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/batch/line`,
    method: 'put',
    data
  })
}

// 无价格 无bom 无工艺 查询
export function getProductWithOut(data) {
  return request({
    url: `/api/erp/products/without/list`,
    method: 'post',
    data
  })
}

// 批量处理质检退货单
export function batchReturnLine(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/batch/returnLine`,
    method: 'post',
    data
  })
}

// 钢管物料外协收货 合并提交

export function mergeOutOrderAdd(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/merge/out/add`,
    method: 'post',
    data
  })
}


// 采购分析报表
export function purchaseAnalysis(data) {
  return request({
    url: `/api/report/data/purchase/analysis`,
    method: 'post',
    data
  })
}


// 采购需求池撤回

export function purProcurementDemandPoolRevoke(id) {
  return request({
    url: `/api/erp/purProcurementDemandPool/revoke/${id}`,
    method: 'post',
  })
}