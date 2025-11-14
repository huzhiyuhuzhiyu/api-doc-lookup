import request from '@/utils/request'

// 条款管理-分页
export function getTermsPage(data) {
  return request({
    url: '/api/erp/terms/page',
    method: 'post',
    data
  })
}

// 条款管理-详情
export function getTerms(id) {
  return request({
    url: `/api/erp/terms/detail/${ id }`,
    method: 'get',
  })
}

// 条款管理-新增
export function addTerms(data) {
  return request({
    url: '/api/erp/terms/add',
    method: 'post',
    data
  })
}

// 条款管理-修改
export function updateTerms(data) {
  return request({
    url: '/api/erp/terms/edit',
    method: 'put',
    data
  })
}

// 条款管理-删除
export function deleteTerms(id) {
  return request({
    url: `/api/erp/terms/del/${ id }`,
    method: 'delete',
  })
}
