import request from '@/utils/request'

// 条款管理-分页
export function getBankPage(data) {
  return request({
    url: '/api/erp/bank/page',
    method: 'post',
    data
  })
}

// 条款管理-详情
export function getBank(id) {
  return request({
    url: `/api/erp/bank/detail/${ id }`,
    method: 'get',
  })
}

// 条款管理-新增
export function addBank(data) {
  return request({
    url: '/api/erp/bank/add',
    method: 'post',
    data
  })
}

// 条款管理-修改
export function updateBank(data) {
  return request({
    url: '/api/erp/bank/edit',
    method: 'put',
    data
  })
}

// 条款管理-删除
export function deleteBank(id) {
  return request({
    url: `/api/erp/bank/del/${ id }`,
    method: 'delete',
  })
}
