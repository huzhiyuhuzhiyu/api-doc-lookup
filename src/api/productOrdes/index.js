import request from '@/utils/request'

// 工单管理列表
export function getWorkList(data) {
  return request({
    url: `/api/mrp/work/list`,
    method: 'POST',
    data
  })
}
// 工单管理列表
export function getWorkSimplePage(data) {
  return request({
    url: `/api/mrp/work/simple/page`,
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


// 追加生产数

export function addOrderNum(data) {
  return request({
    url: `/api/mrp/prod/order/append`,
    method: 'POST',
    data
  })
}
  // 扫码报工 获取数据
  
  export function getscanResultData(data) {
    return request({
      url: `/api/mrp/work/scan/getDocId`,
      method: 'get',
      data
    })
  }

  // 改派
  
export function changProdWork(data) {
  return request({
    url: `/api/mrp/prod/order/change`,
    method: 'POST',
    data
  })
}
  
// 报工记录撤回
export function revokeReport(id) {
  return request({
    url: `/api/mrp/work/report/revoke?id=${id}`,
    method: 'POST',
  })
}


// 进度
export function getPlanSchedule(id) {
  return request({
    url: `/api/zgt/prod/plan/schedule?id=${id}`,
    method: 'get',
  })
}

// 获取入库数据
export function getInboundWarehouseData(data) {
  return request({
    url: `/api/zgt/proWorkFinish/inbound/list`,
    method: 'get',
    data
  })
}

// 报工记录-修改
export function updateReport(data) {
  return request({
    url: `/api/mrp/work/report/update`,
    method: 'PUT',
    data
  })
}

// 产线产量表-列表
export function getProductionLineOutputData(data) {
  return request({
    url: `/api/erp/proProductionLineOutput/list/condition`,
    method: 'post',
    data
  })
}

// 产线产量表-详情
export function detailProductionLineOutput(id) {
  return request({
    url: `/api/erp/proProductionLineOutput/detail/${id}`,
    method: 'GET'
  })
}

// 产线产量表-列表
export function confirmProductionLineOutputData(data) {
  return request({
    url: `/api/erp/proProductionLineOutput/confirm`,
    method: 'post',
    data
  })
}

// 生产订单-拆单

export function splitOrderNum(data) {
  return request({
    url: `/api/mrp/prod/order/split`,
    method: 'POST',
    data
  })
}



// 修改生产订单信息
export function editProductOrder(data) {
  return request({
    url: `/api/mrp/prod/order/updateRemark`,
    method: 'put',
    data
  })
}

// 生产订单-改制

export function reformOrderNum(data) {
  return request({
    url: `/api/mrp/prod/order/reform`,
    method: 'POST',
    data
  })
}
/**工单管理-工单转外协详情 */
export function detailProductionToOutSouring(id) {
  return request({
    url: `/api/mrp/work/detail/out/souring/${id}`,
    method: 'GET'
  })
}
/**工单管理-工单转外协列表 */
export function workTodoOutSouringList(data) {
  return request({
    url: `/api/mrp/work/todo/out/souring/list`,
    method: 'POST',
    data
  })
}

// 生产日报表
// 每日生产

export function produceDataReport(data) {
  return request({
    url: `/api/report/data/produce/report`,
    method: 'POST',
    data
  })
}
// 每日生产入库

export function produceInboundReport(data) {
  return request({
    url: `/api/report/data/produce/inbound/report`,
    method: 'POST',
    data
  })
}
// 当日工单进度

export function produceWorkOrderReport(data) {
  return request({
    url: `/api/report/data/produce/work/order/report`,
    method: 'POST',
    data
  })
}
// 工序料合计
export function produceProcessReport(data) {
  return request({
    url: `/api/report/data/produce/process/materials/report`,
    method: 'POST',
    data
  })
}
