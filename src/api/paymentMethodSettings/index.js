import request from '@/utils/request'

// 付款方式-分页
export function getPaymentMethodPage(data) {
  return request({
    url: '/api/erp/payment/method/page',
    method: 'post',
    data
  })
}

// 付款方式-详情
export function getPaymentMethod(id) {
  return request({
    url: `/api/erp/payment/method/detail/${ id }`,
    method: 'get',
  })
}

// 付款方式-新增
export function addPaymentMethod(data) {
  return request({
    url: '/api/erp/payment/method/add',
    method: 'post',
    data
  })
}

// 付款方式-修改
export function updatePaymentMethod(data) {
  return request({
    url: '/api/erp/payment/method/edit',
    method: 'put',
    data
  })
}

// 付款方式-删除
export function deletePaymentMethod(id) {
  return request({
    url: `/api/erp/payment/method/del/${ id }`,
    method: 'delete',
  })
}
