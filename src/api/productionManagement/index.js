import request from '@/utils/request'
// 生产计划列表
export function getProductionPlanList(data) {
  return request({
    url: `/api/zgt/prod/plan/list`,
    method: 'post',
    data
  })
}