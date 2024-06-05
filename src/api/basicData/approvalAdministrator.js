import request from '@/utils/request'
// 审批管理员-列表
export function getApprovalAdministratorList(data) {
    return request({
        url: `/api/crm/approval/admin/list`,
        method: 'post',
        data
    })
}
// 审批管理员-新增
export function addApprovalAdministrator(data) {
        return request({
                url: `/api/crm/approval/admin/add`,
                method: 'post',
                data
        })
}
// 审批管理员-删除
export function deleteApprovalAdministrator(id) {
        return request({
                url: `/api/crm/approval/admin/del/${id}`,
                method: 'delete',
        })
}

// 审批模版
// 列表
export function getApprovalTemplate(data) {
  return request({
      url: `/api/crm/approval/template/list`,
      method: 'post',
      data
  })
}
// 新增
export function addApprovalTemplate(data) {
  return request({
      url: `/api/crm/approval/template/add`,
      method: 'post',
      data
  })
}
// 修改
export function updateApprovalTemplate(data) {
  return request({
      url: `/api/crm/approval/template/update`,
      method: 'put',
      data
  })
}

// 删除
export function deleteApprovalTemplate(id) {
  return request({
      url: `/api/crm/approval/template/del/${id}`,
      method: 'delete',
  })
}
// 模版详情

export const getApprovalDetail = (tempId) => {
  return request({
    url: `/api/crm/approval/template/detail/${tempId}`,
    method: 'get'
  })
}
// 检查审批模版编码

export const checkApprovalCode = (code, id) => {
  return request({
    url: `/api/crm/approval/template/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}
// 模版状态修改

export function updateTemplateState(data) {
  return request({
      url: `/api/crm/approval/template/update/state?id=${data.id}&state=${data.state}`,
      method: 'put',
      data
  })
}
// 重复编码列表
export function checkApprovallineCode(data) {
  return request({
      url: `/api/crm/approval/template/line/dup/code/list`,
      method: 'post',
      data
  })
}

// 审批模版流程 新增
export function addApprovalFlow(data) {
  return request({
      url: `/api/crm/approval/template/flow`,
      method: 'post',
      data
  })
}

// 审批模版流程树 详情
export const getApprovalDetailTree = (tempId) => {
  return request({
    url: `/api/crm/approval/template/detail/tree/${tempId}`,
    method: 'get'
  })
}
// 业务审批树详情
export function busApprovalFlowTree(data) {
  return request({
      url: `/api/crm/approval/template/detail`,
      method: 'post',
      data
  })
}

// 业务审批单 详情
export const getSaleBusDetail = (id) => {
  return request({
    url: `/api/crm/approval/form/detail/${id}`,
    method: 'get'
  })
}
// 审批中心 列表
export function approvalCenterList(data) {
  return request({
      url: `/api/crm/approval/form/list`,
      method: 'post',
      data
  })
}

// 业务状态修改

export function updateBusState(data) {
  return request({
      url: `/api/crm/approval/update/state`,
      method: 'put',
      data
  })
}

// 业务条件详情
export const getBusDetail = (code) => {
  return request({
    url: `/api/crm/approval/detail?code=${code}`,
    method: 'get'
  })
}

// 审批中心 审批

export function inspectApproval(data) {
  return request({
      url: `/api/crm/approval/form/inspect`,
      method: 'put',
      data
  })
}

// 审批业务 撤回功能

export function withdrawn(data) {
  return request({
      url: `/api/crm/approval/form/withdrawn?formId=${data.formId}`,
      method: 'put',
      // data
  })
}
// 审批业务  转审

export function transfer(data) {
  return request({
      url: `/api/crm/approval/form/transfer?formId=${data.formId}`,
      method: 'put',
      // data
  })
}
// 审批 流转记录

export function approvalTransferList(data) {
  return request({
      url: `/api/crm/transfer/records/list`,
      method: 'post',
      data
  })
}