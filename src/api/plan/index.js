import request from '@/utils/request'

// 库存管理明细-产品库存详情
export function getProductInventory(data) {
  return request({
    url: `/api/wms/stock/inventory/line/detailByCond`,
    method: 'post',
    data
  })
}
//计划管理 齐套查询
export function getTreeByDrawNo(data) {
  return request({
    url: `/api/mrp/material/demand/kit/treeByDrawNo`,
    method: 'get',
    data
  })
}
// 直接创建计划 批量新增

export function batchAddPlan(data) {
  return request({
    url: `/api/mrp/plan/add/batch`,
    method: 'post',
    data
  })
}