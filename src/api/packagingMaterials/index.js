import request from '@/utils/request'

// 包装物料-分页
export function getBimPackagingMaterialsPage(data) {
  return request({
    url: '/api/erp/bimPackagingMaterials/page',
    method: 'post',
    data: data
  })
}

// 包装物料-详情
export function getBimPackagingMaterials(id) {
  return request({
    url: `/api/erp/bimPackagingMaterials/detail/${ id }`,
    method: 'get',
  })
}

// 包装物料-新增
export function addBimPackagingMaterials(data) {
  return request({
    url: '/api/erp/bimPackagingMaterials/add',
    method: 'post',
    data: data
  })
}

// 包装物料-修改
export function updateBimPackagingMaterials(data) {
  return request({
    url: '/api/erp/bimPackagingMaterials/edit',
    method: 'put',
    data: data
  })
}

// 包装物料-删除
export function deleteBimPackagingMaterials(id) {
  return request({
    url: `/api/erp/bimPackagingMaterials/del/${ id }`,
    method: 'delete',
  })
}
