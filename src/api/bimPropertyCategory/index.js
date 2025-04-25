import request from '@/utils/request'
// 资产分类 列表
export function getBimPropertyCategoryList(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/list/condition`,
    method: 'POST',
    data
  })
}
// 资产分类 新增
export function addBimPropertyCategoryList(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/insert`,
    method: 'POST',
    data
  })
}
// 资产分类 检查分类是否重复
export function checkBimPropertyCategoryCode(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/check/code/exist?id=${data.id}&code=${data.code}`,
    method: 'get',
  })
}
// 资产分类 编辑
export function editBimPropertyCategoryList(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/modify`,
    method: 'put',
    data
  })
}
// 资产分类 删除
export function delBimPropertyCategoryList(id) {

  return request({
    url: `/api/zgt/bimPropertyCategory/remove/${id}`,
    method: 'delete',
  })
}
// 资产分类 详情
export function bimPropertyCategoryDetail(id) {

  return request({
    url: `/api/zgt/bimPropertyCategory/detail/${id}`,
    method: 'get',
  })
}

// 资产基础信息 列表
export function bimPropertyList(data) {

  return request({
    url: `/api/zgt/bimProperty/list/condition`,
    method: 'POST',
    data
  })
}
// 资产基础信息 新增
export function addBimProperty(data) {

  return request({
    url: `/api/zgt/bimProperty/insert`,
    method: 'POST',
    data
  })
}
// 资产基础信息 修改
export function editBimProperty(data) {

  return request({
    url: `/api/zgt/bimProperty/modify`,
    method: 'put',
    data
  })
}
// 资产基础信息 删除
export function delBimProperty(id) { 

  return request({
    url: `/api/zgt/bimProperty/remove/${id}`,
    method: 'delete',
  })
}


// 资产基础信息 详情
export function bimPropertyDetail(id) {

  return request({
    url: `/api/zgt/bimProperty/detail/${id}`,
    method: 'get',
  })
}
// 资产基础信息 验证编码唯一性
export function checkBimPropertyCode(data) {

  return request({
    url: `/api/zgt/bimProperty/check/code/exist?id=${data.id}&code=${data.code}`,
    method: 'get',
  })
}

