import request from '@/utils/request'
// 金工生产进度跟踪报表
export function getMetalworkingtrackList (data) {
  return request({
    url: `/api/report/data/produce/dispatch/list/report`,
    method: 'post',
    data
  })
}
//生产报表-报工记录查询-日报表
export function getreportList (data) {
  return request({
    url: `/api/report/data/produce/work/report`,
    method: 'post',
    data
  })
}