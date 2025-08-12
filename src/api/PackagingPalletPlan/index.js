import request from '@/utils/request'

// 包装计划装托-列表 待装托
export function getStockPlanWaitPalletPage(data) {
  return request({
    url: '/api/wms/stock/plan/package/wait/storage/list',
    method: 'post',
    data: data
  })
}


// 包装计划装托-新增
export function addStockPlanPallet(data) {
  return request({
    url: '/api/wms/stock/plan/pallet/add',
    method: 'post',
    data: data
  })
}

// 包装计划装托-明细列表-已装托
export function getStockPlanPalletLinePage(data) {
  return request({
    url: '/api/wms/stock/plan/pallet/line/list',
    method: 'post',
    data: data
  })
}
