import request from '@/utils/request'

// 生产资源

// 新增
export function addProductionResourceData(data) {
  return request({
    url: `/api/mes/production/resource/add`,
    method: 'post',
    data
  })
}
// 详情

export function detailProductionResourceData(id) {
  return request({
    url: `/api/mes/production/resource/detail/${id}`,
    method: 'get',
  })
}
// 删除
export function deleteProductionResource(id) {
  return request({
    url: `/api/mes/production/resource/del/${id}`,
    method: 'delete',
  })
}

// 修改

export function editProductionResource(data) {
  return request({
    url: `/api/mes/production/resource/update`,
    method: 'put',
    data
  })
}
//  列表 1
export function getProductionResource(data) {
  return request({
    url: `/api/mes/production/resource/list`,
    method: 'post',
    data
  })
}
// 导入
export function batchProductionResource(data) {
  return request({
    url: `/api/mes/production/resource/setting/batch`,
    method: 'post',
    data
  })
}
// 导入
export function saleUploadroutingModel(data) {
  return request({
    url: `/api/mes/production/resource/upload/data`,
    method: 'post',
    data
  })
}

// 导入
export function importRoutingModel(data) {
  return request({
    url: `/api/mes/bimRouting/setting/import`,
    method: 'post',
    data
  })
}

export function errordatalist(data) {
  return request({
    url: `/api/mes/production/resource/export/error`,
    method: 'post',
    data
  })
}

//批量清空工艺
export function deleteresourcebatch(data) {
  return request({
    url: `/api/mes/production/resource/del/batch`,
    method: 'put',
    data
  })
}