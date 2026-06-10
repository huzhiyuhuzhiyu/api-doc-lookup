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

// 项源钢球在制报表-列表
export function xyAssembleList(data) {
  return request({
    url: `/api/report/data/xy/transit/list`,
    method: 'post',
    data
  })
}
// 项源钢球在制报表-导出
export function xyAssembleReport(data) {
  return request({
      url: `/api/report/data/xy/transit/export`,
      method: 'POST',
      data
  })
}


