import request from '@/utils/request'

// 异常类型-列表
export function  getAbnoramlTypeData(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/list',
    method: 'POST',
    data
  })
}
// 异常类型-新增
export function  addAbnoramlTypeData(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/add',
    method: 'POST',
    data
  })
}
// 异常类型-修改
export function  updateAbnoramlTypeData(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/update',
    method: 'PUT',
    data
  })
}
// 异常类型-详情
export function  detailAbnoramlTypeData(id) {
  return request({
    url: `/api/mes/ab/abnormal/type/detail/${id}`,
    method: 'GET'
  })
}
// 异常类型-删除
export function  deleteAbnoramlTypeData(id) {
  return request({
    url: `/api/mes/ab/abnormal/type/del/${id}`,
    method: 'DELETE'
  })
}
// 异常类型-检查编码是否存在
export function  checkAbnoramlTypeCode(code,id) {
  return request({
    url: `/api/mes/ab/abnormal/type/check/code/exist?code=${code}&id=${id}`,
    method: 'GET'
  })
}

// 异常申请记录-列表
export function  getAbnoramlData(data) {
  return request({
    url: '/api/mes/ab/apply/record/list',
    method: 'POST',
    data
  })
}
// 异常申请记录-工具
export function  getAbnoramlModule(data) {
  return request({
    url: '/api/mes/ab/apply/record/stats/module',
    method: 'GET',
    data
  })
}
// 异常申请记录-新增
export function  addAbnoramlData(data) {
  return request({
    url: '/api/mes/ab/apply/record/add',
    method: 'POST',
    data
  })
}
// 异常申请记录-修改
export function  updateAbnoramlData(data) {
  return request({
    url: '/api/mes/ab/apply/record/update',
    method: 'PUT',
    data
  })
}
// 异常申请记录-详情
export function  detailAbnoramlData(id) {
  return request({
    url: `/api/mes/ab/apply/record/detail/${id}`,
    method: 'GET'
  })
}
// 异常申请记录-删除
export function  deleteAbnoramlData(id) {
  return request({
    url: `/api/mes/ab/apply/record/del/${id}`,
    method: 'DELETE'
  })
}