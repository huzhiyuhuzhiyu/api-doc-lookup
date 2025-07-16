import request from '@/utils/request'

// 根据条件查询公司信息列表
export function getCompanyPage(data) {
  return request({
    url: '/api/zgt/company/page',
    method: 'post',
    data: data
  })
}

// 公司信息详情
export function getCompany(id) {
  return request({
    url: `/api/zgt/company/detail/${ id }`,
    method: 'get',
  })
}

// 新增公司信息
export function addCompany(data) {
  return request({
    url: '/api/zgt/company/add',
    method: 'post',
    data: data
  })
}

// 修改公司信息
export function updateCompany(data) {
  return request({
    url: '/api/zgt/company/edit',
    method: 'put',
    data: data
  })
}

// 删除公司信息
export function removeCompany(id) {
  return request({
    url: `/api/zgt/company/remove/${ id }`,
    method: 'delete',
  })
}
