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