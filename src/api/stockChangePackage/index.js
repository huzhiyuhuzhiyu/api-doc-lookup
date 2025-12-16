import request from '@/utils/request'

// 生成重检单/换包装
export function addStockChangePackage(data) {
  return request({
    url: `/api/wms/stockChangePackage/insert`,
    method: 'POST',
    data
  })
}

// 提交重检单/换包装
export function submitStockChangePackage(id) {
  return request({
    url: `/api/wms/stockChangePackage/submit/${ id }`,
    method: 'GET',
  })
}

// 获取重检单记录/换包装记录
export function getStockChangePackageLineList(data) {
  return request({
    url: `/api/wms/stockChangePackage/line/list`,
    method: 'POST',
    data
  })
}

// 换包装-推荐库存
export function getRecommendedInventory(data) {
  return request({
    url: `/api/wms/stockChangePackage/recommendedInventory`,
    method: 'POST',
    data
  })
}
