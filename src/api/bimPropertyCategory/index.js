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
    method: 'POST',
    data
  })
}
// 资产分类 删除
export function delBimPropertyCategoryList(id) {

  return request({
    url: `/api/zgt/bimPropertyCategory/remove/{id}`,
    method: 'delete',
  })
}


