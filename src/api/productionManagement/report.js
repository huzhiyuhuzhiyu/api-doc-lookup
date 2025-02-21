import request from '@/utils/request'
// 甬明套圈在制报表-列表
export function getRingList(data) {
  return request({
    url: `/api/report/data/ym/transit/ring/list`,
    method: 'post',
    data
  })
}
// 甬明套圈在制报表-导出
export function ringReport(data) {
  return request({
      url: `/api/report/data/ym/transit/ring/export`,
      method: 'POST',
      data
  })
}

// 中亚套圈在制报表-列表
export function getAssembleList(data) {
  return request({
    url: `/api/report/data/zy/transit/assemble/list`,
    method: 'post',
    data
  })
}
// 甬明套圈在制报表-导出
export function assembleReport(data) {
  return request({
      url: `/api/report/data/zy/transit/assemble/export`,
      method: 'POST',
      data
  })
}


