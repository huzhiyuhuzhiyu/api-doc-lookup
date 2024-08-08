import request from '@/utils/request'

// 库存管理明细-产品库存详情
export function getProductInventory(data) {
  return request({
    url: `/api/wms/stock/inventory/line/detailByCond`,
    method: 'post',
    data
  })
}