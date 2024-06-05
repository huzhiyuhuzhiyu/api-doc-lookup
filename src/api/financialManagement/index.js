import request from '@/utils/request'

// 金工产品 列表
export function getfinSelfMadePricing (data) {
  return request({
    url: `/api/erp/finSelfMadePricing/list/condition`,
    method: 'POST',
    data
  })
}

//  设置价格
export function addfinSelfMadePricing (data) {
  return request({
    url: `/api/erp/finSelfMadePricing/insert`,
    method: 'POST',
    data
  })
}

//  详情
export function detailfinSelfMadePricing (id) {
  return request({
    url: `/api/erp/finSelfMadePricing/detail/${id}`,
    method: 'GET'
  })
}

// 未完成对账单详情
export function detailfinSelfReceivable (id, reconciliationType) {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/statisticalDetail/${id}?reconciliationType=${reconciliationType}`,
    method: 'GET'
  })
}
//  未完成对账单统计列表

export function getfinSelfReceivable (data) {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/statisticalList/condition`,
    method: 'POST',
    data
  })
}

//  开票记录
export function getfinInvoiceRecords (data) {
  return request({
    url: `/api/erp/finInvoiceRecords/list/condition`,
    method: 'POST',
    data
  })
}

// 新增开票记录
export function addfinInvoiceRecords (data) {
  return request({
    url: `/api/erp/finInvoiceRecords/insert`,
    method: 'POST',
    data
  })
}

// 收-付款明细列表
export function getfinPaymentRecords (data) {
  return request({
    url: `/api/erp/finPaymentRecords/list/condition`,
    method: 'POST',
    data
  })
}

// 新增
export function addfinPaymentRecords (data) {
  return request({
    url: `/api/erp/finPaymentRecords/insert`,
    method: 'POST',
    data
  })
}




// 表面处理
// 新增
export function addSurfaceTreatment (data) {
  return request({
    url: `/api/erp/surface/treatment/add`,
    method: 'POST',
    data
  })
}
// 删除
export function delSurfaceTreatment (id) {
  return request({
    url: `/api/erp/surface/treatment/del/${id}`,
    method: 'DELETE',
  })
}
// 修改
export function updateSurfaceTreatment (data) {
  return request({
    url: `/api/erp/surface/treatment/update`,
    method: 'PUT',
    data
  })
}
// 列表
export function getSurfaceTreatmentList (data) {
  return request({
    url: `/api/erp/surface/treatment/list`,
    method: 'POST',
    data
  })
}
// 表面处理管理-检查编码是否存在
export function checkSurfaceTreatmentCode (code, id) {
  return request({
    url: `/api/erp/surface/treatment/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}

// 详情
export function getSurfaceTreatmentInfo (id) {
  return request({
    url: `/api/erp/surface/treatment/detail/${id}`,
    method: 'get',
  })
}



// 锻打价格设置新增
export function addForgingPrice (data) {
  return request({
    url: `/api/erp/forging/price/add`,
    method: 'POST',
    data
  })
}

// 删除
export function delForgingPrice (id) {
  return request({
    url: `/api/erp/forging/price/del/${id}`,
    method: 'DELETE',
  })
}
// 详情
export function getForgingPriceInfo (id) {
  return request({
    url: `/api/erp/forging/price/detail/${id}`,
    method: 'get',
  })
}
// 列表
export function getForgingPriceList (data) {
  return request({
    url: `/api/erp/forging/price/list`,
    method: 'POST',
    data
  })
}
// 修改

export function updatetForgingPrice (data) {
  return request({
    url: `/api/erp/forging/price/update`,
    method: 'PUT',
    data
  })
}


// 胶管内径标号区间管理
//新增
export function addIntervalmanagement (data) {
  return request({
    url: `/api/erp/hose/diameter/add`,
    method: 'POST',
    data
  })
}

// 删除
export function delIntervalmanagement (id) {
  return request({
    url: `/api/erp/hose/diameter/del/${id}`,
    method: 'DELETE',
  })
}
// 详情
export function getIntervalmanagementInfo (id) {
  return request({
    url: `/api/erp/hose/diameter/detail/${id}`,
    method: 'get',
  })
}
// 列表
export function getIntervalmanagementList (data) {
  return request({
    url: `/api/erp/hose/diameter/list`,
    method: 'POST',
    data
  })
}
// 修改

export function updatetIntervalmanagement (data) {
  return request({
    url: `/api/erp/hose/diameter/update`,
    method: 'PUT',
    data
  })
}
// 胶管长度区间管理
//新增
export function addRubberhoselength (data) {
  return request({
    url: `/api/erp/hose/length/add`,
    method: 'POST',
    data
  })
}

// 删除
export function delRubberhoselength (id) {
  return request({
    url: `/api/erp/hose/length/del/${id}`,
    method: 'DELETE',
  })
}
// 列表
export function getRubberhoselengthList (data) {
  return request({
    url: `/api/erp/hose/length/list`,
    method: 'POST',
    data
  })
}
// 胶管计件价格表设置
//新增
export function addRubberhoseprice (data) {
  return request({
    url: `/api/erp/hose/piece/add`,
    method: 'POST',
    data
  })
}
// 列表
export function getRubberhosepriceList (data) {
  return request({
    url: `/api/erp/hose/piece/list`,
    method: 'POST',
    data
  })
}
// 详情
export function getRubberhosepriceInfo (id) {
  return request({
    url: `/api/erp/hose/piece/detail/${id}`,
    method: 'get',
  })
}

// 自制成本价格设置  列表
export function getfinSelfMadePricingList(data) {
  return request({
    url: `/api/erp/finSelfMadePricing/list/condition`,
    method: 'POST',
    data
  })
}
// 批量设置价格

export function updatetfinSelfMadePricing(data) {
  return request({
    url: `/api/erp/finSelfMadePricing/update/price/batch`,
    method: 'PUT',
    data
  })
}
// 详情

export function getfinSelfMadePricingInfo(pid) {
  return request({
    url: `/api/erp/finSelfMadePricing/detail/${pid}`,
    method: 'get',
  })
}
// 批量设置牌价

export function updatetfinSelfListPrice(data) {
  return request({
    url: `/api/erp/finSelfMadePricing/update/listPrice/batch`,
    method: 'PUT',
    data
  })
}

// 收-付款明细列表 合计
export function getfinPaymentReport (data) {
  return request({
    url: `/api/erp/finPaymentRecords/report`,
    method: 'POST',
    data
  })
}
// 收-付款明细列表 删除
export function delfinPayment (id) {
  return request({
    url: `/api/erp/finPaymentRecords/del/${id}`,
    method: 'DELETE',
  })
}
// 开票明细列表 合计
export function getfinInvoiceReport (data) {
  return request({
    url: `/api/erp/finInvoiceRecords/report`,
    method: 'POST',
    data
  })
}
//组装系列单价设置
// 列表
export function assemblyseriesList (data) {
  return request({
    url: `/api/erp/assemble/manufacturing/price/list`,
    method: 'POST',
    data
  })
}
// 新增
export function addassemblyseries (data) {
  return request({
    url: `/api/erp/assemble/manufacturing/price/add`,
    method: 'POST',
    data
  })
}
// 详情
export function getassemblyseriesInfo(id) {
  return request({
    url: `/api/erp/assemble/manufacturing/price/detail/${id}`,
    method: 'get',
  })
}
// 修改
export function updatetassemblyseries (data) {
  return request({
    url: `/api/erp/assemble/manufacturing/price/update`,
    method: 'PUT',
    data
  })
}
// 组装系列单价设置-检查编码是否存在
export function assemblyseriesTreatmentCode (code, id) {
  return request({
    url: `/api/erp/assemble/manufacturing/price/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}