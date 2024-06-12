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



// 型号管理——列表
export function getbimProductsModelList(data) {
  return request({
      url: '/api/erp/bimProductsModel/list',
      method: 'post',
      data: data
  })
}
// 型号管理——新增
export function addBimProductsModel(data) {
  return request({
      url: '/api/erp/bimProductsModel/insert',
      method: 'post',
      data: data
  })
}
// 型号管理——删除
export function delBimProductsModel(id) {
  return request({
      url: '/api/erp/bimProductsModel/remove/'+id,
      method: 'delete',
  })
}
// 型号管理—修改
export function updataBimProductsModel(data) {
  return request({
      url: '/api/erp/bimProductsModel/modify',
      method: 'put',
      data: data
  })
}
// 型号管理—详情
export function getbimProductsModelInfo(id) {
  return request({
      url: '/api/erp/bimProductsModel/detail/'+id,
      method: 'get',
  })
}
// 型号管理——唯一性

export function updataBimProductsModelCheck(data) {
  return request({
      url: '/api/erp/bimProductsModel/check/model/exist?model='+data,
      method: 'get',
  })
}