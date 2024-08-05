import request from '@/utils/request'
//商机管理-列表
export function getcrmBusinessList(data) {
  return request({
    url: `/api/zgt/crmBusiness/list`,
    method: 'POST',
    data
  })
}
//商机管理-删除
export function deletecrmBusiness(id) {
  return request({
    url: `/api/zgt/crmBusiness/del/${id}`,
    method: 'DELETE'
  })
}
// 商机管理 新增
export function addcrmBusiness(data) {
  return request({
    url: `/api/zgt/crmBusiness/add`,
    method: 'POST',
    data
  })
}
// 商机管理 编辑
export function updatecrmBusiness(data) {
  return request({
    url: `/api/zgt/crmBusiness/update`,
    method: 'PUT',
    data
  })
}
// 商机管理 详情
export function detailcrmBusiness(id) {
  return request({
    url: `/api/zgt/crmBusiness/detail/${id}`,
    method: 'GET'
  })
}
// 客户联系人 新增
export function addcustomercontact(data) {
  return request({
    url: `/api/erp/contacts/add`,
    method: 'POST',
    data
  })
}
// 客户联系人 详情
export function detailcustomercontact(id) {
  return request({
    url: `/api/erp/contacts/detail/${id}`,
    method: 'GET'
  })
}
//客户联系人-删除
export function deletecustomercontact(id) {
  return request({
    url: `/api/erp/contacts/remove/${id}`,
    method: 'DELETE'
  })
}
// 客户联系人 编辑
export function updatecustomercontact(data) {
  return request({
    url: `/api/erp/contacts/modify`,
    method: 'PUT',
    data
  })
}

//回访管理
//回访管理-列表
export function getcrmReturnVisit(data) {
  return request({
    url: `/api/zgt/crmReturnVisit/list`,
    method: 'POST',
    data
  })
}
// 回访管理 新增
export function addcrmReturnVisit(data) {
  return request({
    url: `/api/zgt/crmReturnVisit/add`,
    method: 'POST',
    data
  })
}
// 回访管理 详情
export function detailcrmReturnVisit(id) {
  return request({
    url: `/api/zgt/crmReturnVisit/detail/${id}`,
    method: 'GET'
  })
}
//回访管理-删除
export function deletecrmReturnVisit(id) {
  return request({
    url: `/api/zgt/crmReturnVisit/del/${id}`,
    method: 'DELETE'
  })
}
// 回访管理 编辑
export function updatecrmReturnVisit(data) {
  return request({
    url: `/api/zgt/crmReturnVisit/update`,
    method: 'PUT',
    data
  })
}
//合同管理
//合同管理-列表
export function getcrmContractlist(data) {
  return request({
    url: `/api/zgt/crmContract/list`,
    method: 'POST',
    data
  })
}
// 合同管理 新增
export function addcrmContract(data) {
  return request({
    url: `/api/zgt/crmContract/add`,
    method: 'POST',
    data
  })
}
// 合同管理 详情
export function detailcrmContract(id) {
  return request({
    url: `/api/zgt/crmContract/detail/${id}`,
    method: 'GET'
  })
}
//合同管理-删除
export function deletecrmContract(id) {
  return request({
    url: `/api/zgt/crmContract/del/${id}`,
    method: 'DELETE'
  })
}
// 合同管理 编辑
export function updatecrmContract(data) {
  return request({
    url: `/api/zgt/crmContract/update`,
    method: 'PUT',
    data
  })
}
//回款计划
//回款计划-列表
export function getcrmReceivablesPlanlist(data) {
  return request({
    url: `/api/zgt/crmReceivablesPlan/list`,
    method: 'POST',
    data
  })
}
// 回款计划 新增
export function addcrmReceivablesPlan(data) {
  return request({
    url: `/api/zgt/crmReceivablesPlan/add`,
    method: 'POST',
    data
  })
}
// 回款计划 详情
export function detailcrmReceivablesPlan(id) {
  return request({
    url: `/api/zgt/crmReceivablesPlan/detail/${id}`,
    method: 'GET'
  })
}
//回款计划-删除
export function deletecrmReceivablesPlan(id) {
  return request({
    url: `/api/zgt/crmReceivablesPlan/del/${id}`,
    method: 'DELETE'
  })
}
// 回款计划 编辑
export function updatecrmReceivablesPlan(data) {
  return request({
    url: `/api/zgt/crmReceivablesPlan/update`,
    method: 'PUT',
    data
  })
}
//回款管理
//回款管理-列表
export function getcrmReceivableslist(data) {
  return request({
    url: `/api/zgt/crmReceivables/list`,
    method: 'POST',
    data
  })
}
// 回款管理 新增
export function addcrmReceivables(data) {
  return request({
    url: `/api/zgt/crmReceivables/add`,
    method: 'POST',
    data
  })
}
// 回款管理 详情
export function detailcrmReceivables(id) {
  return request({
    url: `/api/zgt/crmReceivables/detail/${id}`,
    method: 'GET'
  })
}
//回款管理-删除
export function deletecrmReceivables(id) {
  return request({
    url: `/api/zgt/crmReceivables/del/${id}`,
    method: 'DELETE'
  })
}
// 回款管理 编辑
export function updatecrmReceivables(data) {
  return request({
    url: `/api/zgt/crmReceivables/update`,
    method: 'PUT',
    data
  })
}
//拜访计划
//拜访计划-列表
export function getcrmVisitlist(data) {
  return request({
    url: `/api/zgt/crmVisit/list`,
    method: 'POST',
    data
  })
}
// 拜访计划 新增
export function addcrmVisit(data) {
  return request({
    url: `/api/zgt/crmVisit/add`,
    method: 'POST',
    data
  })
}
// 拜访计划 详情
export function detailcrmVisit(id) {
  return request({
    url: `/api/zgt/crmVisit/detail/${id}`,
    method: 'GET'
  })
}
//拜访计划-删除
export function deletecrmVisit(id) {
  return request({
    url: `/api/zgt/crmVisit/del/${id}`,
    method: 'DELETE'
  })
}
// 拜访计划 编辑
export function updatecrmVisit(data) {
  return request({
    url: `/api/zgt/crmVisit/update`,
    method: 'PUT',
    data
  })
}
//发票管理
//发票管理-列表
export function getcrmInvoicelist(data) {
  return request({
    url: `/api/zgt/crmInvoice/list`,
    method: 'POST',
    data
  })
}
// 发票管理 新增
export function addcrmInvoice(data) {
  return request({
    url: `/api/zgt/crmInvoice/add`,
    method: 'POST',
    data
  })
}
// 发票管理 详情
export function detailcrmInvoice(id) {
  return request({
    url: `/api/zgt/crmInvoice/detail/${id}`,
    method: 'GET'
  })
}
//发票管理-删除
export function deletecrmInvoice(id) {
  return request({
    url: `/api/zgt/crmInvoice/del/${id}`,
    method: 'DELETE'
  })
}
// 发票管理 编辑
export function updatecrmInvoice(data) {
  return request({
    url: `/api/zgt/crmInvoice/update`,
    method: 'PUT',
    data
  })
}
// 发票信息 新增
export function addcrmInvoiceInfo(data) {
  return request({
    url: `/api/zgt/crmInvoiceInfo/add`,
    method: 'POST',
    data
  })
}
// 发票信息 详情
export function detailcrmInvoiceInfo(id) {
  return request({
    url: `/api/zgt/crmInvoiceInfo/detail/${id}`,
    method: 'GET'
  })
}