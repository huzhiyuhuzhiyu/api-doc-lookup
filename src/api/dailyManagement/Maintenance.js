import request from '@/utils/request'

// 保养和点检任务 列表
export function checkmaintenanceList(data) {
  return request({
    url: `/api/mes/equMaintenanceTask/list`,
    method: 'POST',
    data
  })
}
// 超期保养和点检任务 列表
export function chaocheckmaintenanceList(data) {
  return request({
    url: `/api/mes/equMaintenanceTask/overTime/list`,
    method: 'POST',
    data
  })
}
// 保养和点检任务 新增
export function addcheckmaintenance(data) {
  return request({
    url: `/api/mes/equMaintenanceTask/insert`,
    method: 'POST',
    data
  })
}
// 保养和点检任务 删除
export function deletecheckmaintenance(id) {
  return request({
    url: `/api/mes/equMaintenanceTask/remove/${id}`,
    method: 'DELETE'
  })
}
// 保养和点检任务 修改
export function updatecheckmaintenance(data) {
  return request({
    url: `/api/mes/equMaintenanceTask/modify`,
    method: 'PUT',
    data
  })
}

// 保养和点检任务 详情
export function detailcheckmaintenance(id) {
  return request({
    url: `/api/mes/equMaintenanceTask/detail/${id}`,
    method: 'GET'
  })
}
// 保养和点检任务 保养
export function equMaintenancemainte(data) {
  return request({
    url: `/api/mes/equMaintenanceTask/time/modify`,
    method: 'PUT',
    data
  })
}

//保养记录
//保养记录-列表
export function equMaintenanceList(data) {
  return request({
    url: `/api/mes/equMaintenance/list`,
    method: 'POST',
    data
  })
}
// 保养记录 新增
export function addequMaintenance(data) {
  return request({
    url: `/api/mes/equMaintenance/insert`,
    method: 'POST',
    data
  })
}
// 保养记录 删除
export function deleteequMaintenance(id) {
  return request({
    url: `/api/mes/equMaintenance/remove/${id}`,
    method: 'DELETE'
  })
}
// 保养记录 修改
export function updateequMaintenance(data) {
  return request({
    url: `/api/mes/equMaintenance/modify`,
    method: 'PUT',
    data
  })
}

// 保养记录 详情
export function detailequMaintenance(id) {
  return request({
    url: `/api/mes/equMaintenance/detail/${id}`,
    method: 'GET'
  })
}


//维修申请单
//维修申请单-列表
export function RepairRequestList(data) {
  return request({
    url: `/api/mes/equEquipmentRepair/list`,
    method: 'POST',
    data
  })
}
// 维修申请单 新增
export function addRepairRequest(data) {
  return request({
    url: `/api/mes/equEquipmentRepair/insert`,
    method: 'POST',
    data
  })
}
// 维修申请单 删除
export function deleteRepairRequest(id) {
  return request({
    url: `/api/mes/equEquipmentRepair/remove/${id}`,
    method: 'DELETE'
  })
}
// 维修申请单 修改
export function updateRepairRequest(data) {
  return request({
    url: `/api/mes/equEquipmentRepair/modify`,
    method: 'PUT',
    data
  })
}
// 维修申请单 批量修改
export function updatbatchequEquipmentRepair(data) {
  return request({
    url: `/api/mes/equEquipmentRepair/batch/modify`,
    method: 'PUT',
    data
  })
}
// 维修申请单 详情
export function detailRepairRequest(id) {
  return request({
    url: `/api/mes/equEquipmentRepair/detail/${id}`,
    method: 'GET'
  })
}

//检定任务
//检定任务-列表
export function verificationList(data) {
  return request({
    url: `/api/mes/equVerificationTask/list`,
    method: 'POST',
    data
  })
}
// 检定任务 新增
export function addverification(data) {
  return request({
    url: `/api/mes/equVerificationTask/insert`,
    method: 'POST',
    data
  })
}
// 检定任务 删除
export function deleteverification(id) {
  return request({
    url: `/api/mes/equVerificationTask/remove/${id}`,
    method: 'DELETE'
  })
}
// 检定任务 修改
export function updateverification(data) {
  return request({
    url: `/api/mes/equVerificationTask/modify`,
    method: 'PUT',
    data
  })
}

// 检定任务 详情
export function detailverification(id) {
  return request({
    url: `/api/mes/equVerificationTask/detail/${id}`,
    method: 'GET'
  })
}
// 检定任务 检定
export function equcemainterecords(data) {
  return request({
    url: `/api/mes/equVerificationTask/time/modify`,
    method: 'PUT',
    data
  })
}
//检定记录
//检定记录-列表
export function VerificationrecordsList(data) {
  return request({
    url: `/api/mes/equVerificationRecords/list`,
    method: 'POST',
    data
  })
}
// 检定记录 新增
export function addVerificationrecords(data) {
  return request({
    url: `/api/mes/equVerificationRecords/insert`,
    method: 'POST',
    data
  })
}
// 检定记录 删除
export function deleteVerificationrecords(id) {
  return request({
    url: `/api/mes/equVerificationRecords/remove/${id}`,
    method: 'DELETE'
  })
}
// 检定记录 归还
export function updateVerificationrecords(id) {
  return request({
    url: `/api/mes/equVerificationRecords/back/${id}`,
    method: 'PUT',
  })
}

// 检定记录 详情
export function detailVerificationrecords(id) {
  return request({
    url: `/api/mes/equVerificationRecords/detail/${id}`,
    method: 'GET'
  })
}

//报废申请单
//报废申请单-明细列表
export function ScrapApplicationFormListinfo(data) {
  return request({
    url: `/api/mes/equEquipmentScrapping/detail/list`,
    method: 'POST',
    data
  })
}
//报废申请单-列表
export function ScrapApplicationFormList(data) {
  return request({
    url: `/api/mes/equEquipmentScrapping/list`,
    method: 'POST',
    data
  })
}
// 报废申请单 新增
export function addScrapApplicationForm(data) {
  return request({
    url: `/api/mes/equEquipmentScrapping/insert`,
    method: 'POST',
    data
  })
}
// 报废申请单 删除
export function deleteScrapApplicationForm(id) {
  return request({
    url: `/api/mes/equEquipmentScrapping/remove/${id}`,
    method: 'DELETE'
  })
}
// 报废申请单 修改
export function updateScrapApplicationForm(data) {
  return request({
    url: `/api/mes/equEquipmentScrapping/modify`,
    method: 'PUT',
    data
  })
}
// 报废申请单 详情
export function detailScrapApplicationForm(id) {
  return request({
    url: `/api/mes/equEquipmentScrapping/detail/${id}`,
    method: 'GET'
  })
}

//领用归还
//领用归还-列表
export function CollectionandreturnList(data) {
  return request({
    url: `/api/mes/equRequisitionRecords/list`,
    method: 'POST',
    data
  })
}
// 领用归还 新增
export function addCollectionandreturn(data) {
  return request({
    url: `/api/mes/equRequisitionRecords/insert`,
    method: 'POST',
    data
  })
}
// 领用归还 修改
export function updateCollectionandreturn(data) {
  return request({
    url: `/api/mes/equRequisitionRecords/modify`,
    method: 'PUT',
    data
  })
}
// 领用归还 删除
export function deleteCollectionandreturn(id) {
  return request({
    url: `/api/mes/equRequisitionRecords/remove/${id}`,
    method: 'DELETE'
  })
}
// 领用归还 归还
export function guihuanCollectionandreturn(data) {
  return request({
    url: `/api/mes/equRequisitionRecords/back/`,
    method: 'put',
    data
  })
}
// 领用归还 详情
export function detailCollectionandreturn(id) {
  return request({
    url: `/api/mes/equRequisitionRecords/detail/${id}`,
    method: 'GET'
  })
}
// 更换零部件-新增
export function addCollectionandparts(data) {
  return request({
    url: `/api/mes/equReplaceComponents/insert`,
    method: 'POST',
    data
  })
}
// 更换零部件 修改
export function updateScrapApplicationparts(data) {
  return request({
    url: `/api/mes/equReplaceComponents/modify`,
    method: 'PUT',
    data
  })
}
// 更换零部件 详情
export function detailCollectionandparts(businessId) {
  return request({
    url: `/api/mes/equReplaceComponents/detail/${businessId}`,
    method: 'GET'
  })
}
//维修知识库-列表
export function equEquipmentRepairKnowledgeList(data) {
  return request({
    url: `/api/mes/equEquipmentRepairKnowledge/list`,
    method: 'POST',
    data
  })
}
// 维修知识库 新增
export function addequEquipmentRepairKnowledge(data) {
  return request({
    url: `/api/mes/equEquipmentRepairKnowledge/insert`,
    method: 'POST',
    data
  })
}
// 维修知识库 删除
export function deleteequEquipmentRepairKnowledge(id) {
  return request({
    url: `/api/mes/equEquipmentRepairKnowledge/remove/${id}`,
    method: 'DELETE'
  })
}
// 维修知识库 详情
export function detailequEquipmentRepairKnowledge(id) {
  return request({
    url: `/api/mes/equEquipmentRepairKnowledge/detail/${id}`,
    method: 'GET'
  })
}
// 维修知识库 修改
export function updateequEquipmentRepairKnowledge(data) {
  return request({
    url: `/api/mes/equEquipmentRepairKnowledge/modify`,
    method: 'PUT',
    data
  })
}
// 本月各设备点检次数
export function inspectionMonthTotalchart(data) {
  return request({
    url: `/api/mes/equReport/inspectionMonthTotal`,
    method: 'POST',
    data
  })
}
// 日常保养点检分布
export function dailyMaintenanceNum(data) {
  return request({
    url: `/api/mes/equReport/dailyMaintenanceNum`,
    method: 'POST',
    data
  })
}
// 日常设备保养点检次数
export function dailyEquMaintenanceNum(data) {
  return request({
    url: `/api/mes/equReport/dailyEquMaintenanceNum`,
    method: 'POST',
    data
  })
}
// 维修概况分析
export function totalRepairNum(data) {
  return request({
    url: `/api/mes/equReport/totalRepair`,
    method: 'POST',
    data
  })
}
// 维修分布
export function repairNum(data) {
  return request({
    url: `/api/mes/equReport/repairNum`,
    method: 'POST',
    data
  })
}
// 点检时间结果统计
export function equMaintenanceTime(data) {
  return request({
    url: `/api/mes/equReport/equMaintenanceTime`,
    method: 'POST',
    data
  })
}