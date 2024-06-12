import request from '@/utils/request'

// 产品属性列表
export function getbimProductAttributesList(data) {
    return request({
        url: '/api/erp/bimProductAttributes/list',
        method: 'post',
        data: data
    })
}

// 产品属性——新增
export function addBimProductAttributes(data) {
  return request({
      url: '/api/erp/bimProductAttributes/insert',
      method: 'post',
      data: data
  })
}
// 产品属性——删除
export function delBimProductAttributes(id) {
  return request({
      url: '/api/erp/bimProductAttributes/remove/'+id,
      method: 'delete',
  })
}
// 产品属性——修改
export function updataBimProductAttributes(data) {
  return request({
      url: '/api/erp/bimProductAttributes/insert',
      method: 'put',
      data: data
  })
}
// 产品属性——详情
export function getBimProductAttributesInfo(id) {
  return request({
      url: '/api/erp/bimProductAttributes/detail/'+id,
      method: 'get',
  })
}