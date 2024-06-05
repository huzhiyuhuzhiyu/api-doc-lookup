import request from '@/utils/request'

// 工单管理列表
export function getWorkList(data) {
  return request({
    url: `/api/mrp/work/list`,
    method: 'POST',
    data
  })
}
// 工单管理列表2
export function getWorkPage(data) {
  return request({
    url: `/api/mrp/work/page`,
    method: 'POST',
    data
  })
}
// 工单详情
export function detailWorkData(id) {
  return request({
    url: `/api/mrp/work/detail/${id}`,
    method: 'GET'
  })
}



// 报工列表

export function getWorkReportList(data) {
  return request({
    url: `/api/mrp/work/report/list`,
    method: 'POST',
    data
  })
}

// 新增报工数据

export function addWorkReport(data) {
  return request({
    url: `/api/mrp/work/report/add`,
    method: 'POST',
    data
  })
}
//领退换料
//领退换料-列表
export function WithdrawalList(data) {
  return request({
    url: `/api/mrp/material/collect/list`,
    method: 'POST',
    data
  })
}
//领退换料-列表
export function WithdrawalmxList(data) {
  return request({
    url: `/api/mrp/material/collect/line/list`,
    method: 'POST',
    data
  })
}
// 领退换料 新增
export function addWithdrawal(data) {
  return request({
    url: `/api/mrp/material/collect/add`,
    method: 'POST',
    data
  })
}
// 领退换料 删除
export function deleteWithdrawal(id) {
  return request({
    url: `/api/mrp/material/collect/del/${id}`,
    method: 'DELETE'
  })
}
// 领退换料 修改
export function updateWithdrawal(data) {
  return request({
    url: `/api/mrp/material/collect/update`,
    method: 'PUT',
    data
  })
}
// 获取订单物料数据

export function getMaterialList(data) {
  return request({
    url: `/api/mrp/prod/order/material/page`,
    method: 'POST',
    data
  })
}
// 领退换料 详情
export function detailWithdrawal(id) {
  return request({
    url: `/api/mrp/material/collect/detail/${id}`,
    method: 'GET'
  })
}
// 领退换料 领料类型详情
export function detailCollectType(id) {
  return request({
    url: `/api/mrp/material/collect/type/detail/${id}`,
    method: 'GET'
  })
}
//生产订单-列表
export function ordershengchanList(data) {
  return request({
    url: `/api/mrp/prod/order/list`,
    method: 'POST',
    data
  })
}
//生产订单-详情
export function detailordershengchan(id) {
  return request({
    url: `/api/mrp/prod/order/detail/${id}`,
    method: 'GET'
  })
}

// 成品变更流程卡  列表
export function finishChangeList(data) {
  return request({
    url: `/api/mrp/flow/card/change/list`,
    method: 'POST',
    data
  })
}
// 增加
export function addFinishChange(data) {
  return request({
    url: `/api/mrp/flow/card/change/add`,
    method: 'POST',
    data
  })
}
// 修改
export function updateFinishChange(data) {
  return request({
    url: `/api/mrp/flow/card/change/update`,
    method: 'PUT',
    data
  })
}
// 详情
export function detailFinishChange(id) {
  return request({
    url: `/api/mrp/flow/card/change/detail/${id}`,
    method: 'GET'
  })
}
// 删除
export function delFinishChange(id) {
  return request({
    url: `/api/mrp/flow/card/change/del/${id}`,
    method: 'DELETE'
  })
}

// 选择流程卡 列表

export function flowCardList(data) {
  return request({
    url: `/api/mrp/flow/card/list`,
    method: 'POST',
    data
  })
}
//领退料通知单-用料清单
export function ordermaterialList(data) {
  return request({
    url: `/api/mrp/material/collect/material/list`,
    method: 'POST',
    data
  })
}
//领退料通知单-工序物料
export function ordercollectlList(data) {
  return request({
    url: `/api/mrp/material/collect/process/list`,
    method: 'POST',
    data
  })
}
//设备程序查询
export function conditionlList(data) {
  return request({
    url: `/api/mes/equEquipment/deviceProgram/query`,
    method: 'POST',
    data
  })
}
//程序下发参数
export function programIssuesParametersList(data) {
  return request({
    url: `/api/mes/equEquipment/gateway/list/condition`,
    method: 'POST',
    data
  })
}

//程序下发参数修改
export function modifyProgramIssuesParameters(data) {
  return request({
    url: `/api/mes/equEquipment/gateway/modify`,
    method: 'put',
    data
  })
}