import request from '@/utils/request'

// 其他收付款-分页
export function getOtherTransactionsPage(data) {
  return request({
    url: '/api/erp/other/payment/page',
    method: 'post',
    data
  })
}

// 其他收付款-详情
export function getOtherTransactions(id) {
  return request({
    url: `/api/erp/other/payment/detail/${ id }`,
    method: 'get',
  })
}

// 其他收付款-新增
export function addOtherTransactions(data) {
  return request({
    url: '/api/erp/other/payment/add',
    method: 'post',
    data
  })
}

// 其他收付款-修改
export function updateOtherTransactions(data) {
  return request({
    url: '/api/erp/other/payment/edit',
    method: 'put',
    data
  })
}

// 其他收付款-删除
export function deleteOtherTransactions(id) {
  return request({
    url: `/api/erp/other/payment/del/${ id }`,
    method: 'delete',
  })
}
