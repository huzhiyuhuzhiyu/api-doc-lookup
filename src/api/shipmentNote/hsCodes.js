import request from '@/utils/request'

// 根据条件查询海关产品列表
export function getHsProductsList(data) {
  return request({
    url: '/api/erp/hsProducts/list',
    method: 'post',
    data: data
  })
}

// 海关产品信息详情
export function getHsProducts(id) {
  return request({
    url: `/api/erp/hsProducts/detail/${ id }`,
    method: 'get',
  })
}

// 新增海关产品信息
export function addHsProducts(data) {
  return request({
    url: '/api/erp/hsProducts/insert',
    method: 'post',
    data: data
  })
}

// 修改海关产品信息
export function updateHsProducts(data) {
  return request({
    url: '/api/erp/hsProducts/modify',
    method: 'put',
    data: data
  })
}

// 删除海关产品信息
export function removeHsProducts(id) {
  return request({
    url: `/api/erp/hsProducts/remove/${ id }`,
    method: 'delete',
  })
}
