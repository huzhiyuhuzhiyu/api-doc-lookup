import request from '@/utils/request'

// 生产首检 列表
export function getPFIList(data) {
  return request({
    url: `/api/crm/qcFirstInspectionRecord/list`,
    method: 'POST',
    data
  })
}
// 生产首检 新建
export function addPFIData(data) {
  return request({
    url: `/api/crm/qcFirstInspectionRecord/insert`,
    method: 'POST',
    data
  })
}
// 生产首检 修改
export function updatePFIData(data) {
  return request({
    url: `/api/crm/qcFirstInspectionRecord/modify`,
    method: 'PUT',
    data
  })
}
// 生产首检 删除
export function deletePFIData(id) {
  return request({
    url: `/api/crm/qcFirstInspectionRecord/remove/${id}`,
    method: 'DELETE'
  })
}
// 生产首检 详情
export function detailPFIDatalist(id) {
  return request({
    url: `/api/crm/qcFirstInspectionRecord/detail/${id}`,
    method: 'GET'
  })
}