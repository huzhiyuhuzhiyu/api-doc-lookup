import request from '@/utils/request'

// 生产资源

// 新增
export function addStockGoodsShelves(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/add`,
    method: 'post',
    data
  })
}
// 详情

export function detailProductionResourceData(id) {
  return request({
    url: `/api/wms/stockGoodsShelves/detail/${id}`,
    method: 'get',
  })
}
// 删除
export function deleteStockGoodsShelves(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/del/batch`,
    method: 'delete',
    data
  })
}

// 修改

export function editStockGoodsShelves(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/modify`,
    method: 'put',
    data
  })
}
//  列表 
export function getList(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/list`,
    method: 'post',
    data
  })
}
export function getListTree(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/tree`,
    method: 'post',
    data
  })
}