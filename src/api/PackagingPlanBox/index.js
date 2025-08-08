import request from '@/utils/request'
// 包装计划装箱-已装箱-列表
export function getPackagingPlanBoxInPage(data) {
  return request({
    url: '/api/wms/stock/plan/package/list',
    method: 'post',
    data: data
  })
}


// 包装计划装箱-新增
export function addPackagingPlanBox(data) {
  return request({
    url: '/api/wms/stock/plan/package/add',
    method: 'post',
    data: data
  })
}
