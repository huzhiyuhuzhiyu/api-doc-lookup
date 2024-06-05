import request from '@/utils/request'

// 应用设置 列表
export function getAppList(data) {
  return request({
    url: `/api/crm/bimApplicationManagement/list`,
    method: 'POST',
    data: data
  })
}
// 应用设置 新建
export function addAppData(data) {
  return request({
    url: `/api/crm/bimApplicationManagement/insert`,
    method: 'POST',
    data: data
  })
}
// 应用设置 修改
export function updateAppData(data) {
  return request({
    url: `/api/crm/bimApplicationManagement/modify`,
    method: 'PUT',
    data: data
  })
}
// 应用设置 删除
export function deleteAppData(id) {
  return request({
    url: `/api/crm/bimApplicationManagement/remove/${id}`,
    method: 'DELETE'
  })
}
// 应用设置 生成uuid
export function generateUuid() {
  return request({
    url: `/api/crm/bimApplicationManagement/uid`,
    method: 'GET'
  })
}
// 应用设置 详情
export function detailAppData(id) {
  return request({
    url: `/api/crm/bimApplicationManagement/detail/${id}`,
    method: 'GET'
  })
}
