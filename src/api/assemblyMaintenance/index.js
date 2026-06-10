import request from '@/utils/request'

// 根据条件查询组合件列表
export function getBusinessComponentPage(data) {
  return request({
    url: '/api/zgt/businessComponent/page',
    method: 'post',
    data: data
  })
}

// 组合件详情
export function getBusinessComponent(id) {
  return request({
    url: `/api/zgt/businessComponent/detail/${ id }`,
    method: 'get',
  })
}

// 新增组合件
export function addBusinessComponent(data) {
  return request({
    url: '/api/zgt/businessComponent/add',
    method: 'post',
    data: data
  })
}

// 修改组合件
export function updateBusinessComponent(data) {
  return request({
    url: '/api/zgt/businessComponent/edit',
    method: 'put',
    data: data
  })
}

// 删除组合件
export function removeBusinessComponent(id) {
  return request({
    url: `/api/zgt/businessComponent/del/${ id }`,
    method: 'delete',
  })
}
