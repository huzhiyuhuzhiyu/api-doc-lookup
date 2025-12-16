import request from '@/utils/request'

// 检验单 列表
export function getInspectionList(data) {
  return request({
    url: `/api/wms/qc/inspection/list`,
    method: 'POST',
    data
  })
}
// 检验单 明细列表
export function getInspectionLinesList(data) {
  return request({
    url: `/api/wms/qc/inspection/line/list`,
    method: 'POST',
    data
  })
}
// 检验单 新建
export function addInspectionData(data) {
  return request({
    url: `/api/wms/qc/inspection/add`,
    method: 'POST',
    data
  })
}
// 检验单 修改
export function updateInspectionData(data) {
  return request({
    url: `/api/wms/qc/inspection/modify`,
    method: 'PUT',
    data
  })
}
// 检验单 删除
export function deleteInspectionData(id) {
  return request({
    url: `/api/wms/qc/inspection/remove/${id}`,
    method: 'DELETE'
  })
}
// 检验单 详情
export function detailInspectionData(id) {
  return request({
    url: `/api/wms/qc/inspection/detail/${id}`,
    method: 'GET'
  })
}
// 检验单 确认
export function confirmedInspection(id) {
  return request({
    url: `/api/wms/qc/inspection/confirmed/${id}`,
    method: 'GET'
  })
}
// 检验单 通过通知单获取检验单详情
export function detailInspectionDataByBizid(bizId) {
  return request({
    url: `/api/wms/qc/inspection/detail/by/${bizId}`,
    method: 'GET'
  })
}
// 检验单 查询检验项目
export function getInspectionItem(data) {
  return request({
    url: `/api/wms/qc/inspection/list/item?productsId=${data.id}&inspectionCategory=${data.inspectionCategory}`,
    method: 'GET'
  })
}

/**检验单 根据产品id获取默认抽检数量 */
export function getSamplingQuantityByProductId(data) {
  return request({
    url: `/api/erp/products/sampling/rules/batch/cal/num`,
    method: 'POST',
    data
  })
}

/**检验单 根据工序id获取默认抽检数量 */
export function getSamplingQuantityByProcessId(data) {
  return request({
    url: `/api/zgt/process/sampling/rules/cal/num?processId=${data.processId}&num=${data.num}`,
    method: 'GET',
  })
}

// 不合格品处理单 列表
export function getQcUnqualifiedList(data) {
  return request({
    url: `/api/wms/unqualified/list`,
    method: 'POST',
    data
  })
}
// 不合格品处理单 明细列表
export function getQcUnqualifiedLinesList(data) {
  return request({
    url: `/api/wms/unqualified/line/list`,
    method: 'POST',
    data
  })
}
// 不合格品处理单 新建
export function addQcUnqualifiedData(data) {
  return request({
    url: `/api/wms/unqualified/add`,
    method: 'POST',
    data
  })
}
// 不合格品处理单 新建
export function treatmentData(data) {
  return request({
    url: `/api/wms/qc/inspection/treatment`,
    method: 'POST',
    data
  })
}
// 不合格品处理单 修改
export function updateQcUnqualifiedData(data) {
  return request({
    url: `/api/wms/unqualified/modify`,
    method: 'PUT',
    data
  })
}
// 不合格品处理单 删除
export function deleteQcUnqualifiedData(id) {
  return request({
    url: `/api/wms/unqualified/remove/${id}`,
    method: 'DELETE'
  })
}
// 不合格品处理单 详情
export function detailQcUnqualifiedData(id) {
  return request({
    url: `/api/wms/unqualified/detail/${id}`,
    method: 'GET'
  })
}
// 不合格品处理单 报废列表
export function getQcUnqualifiedScrapList(data) {
  return request({
    url: `/api/wms/unqualified/scrap/list`,
    method: 'POST',
    data
  })
}
// 不合格品处理单 损失上报
export function lossQcUnqualifiedData(data) {
  return request({
    url: `/api/wms/unqualified/loss/escalation`,
    method: 'POST',
    data
  })
}

// 检验单-批量检验
export function batchInspectionData(data) {
  return request({
    url: `/api/wms/qc/inspection/batch/add`,
    method: 'POST',
    data
  })
}

// 检验单 新建
export function addReportWorkInspectionData(data) {
  return request({
    url: `/api/wms/qc/inspection/workReport/add`,
    method: 'POST',
    data
  })
}






// 质量报表
// 供应商货品质量概况

export function supplierProductReport(data) {
  return request({
    url: `/api/zgt/ZgtReport/supplier/product/quality`,
    method: 'POST',
    data
  })
}
// 检验员检验概况

export function inspectorReport(data) {
  return request({
    url: `/api/zgt/ZgtReport/inspector/inspection/overview`,
    method: 'POST',
    data
  })
}


// 检验单——撤回

export function inspectionRevoke(data) {
  return request({
    url: `/api/wms/qc/inspection/revoke`,
    method: 'POST',
    data
  })
}
