import request from '@/utils/request'

// 派工单管理 列表
export function getDispatchList(data) {
  return request({
    url: `/api/mrp/dispatch/list`,
    method: 'POST',
    data
  })
}
// 派工单管理 详情
export function detailDispatchData(id) {
  return request({
    url: `/api/mrp/dispatch/detail/${id}`,
    method: 'GET'
  })
}
// 派工单管理 批量操作
export function batchDispatchData(data) {
  let url, method
  if (data.batchType === 'startWork') {
    url = `/api/mrp/dispatch/up`
    method = 'POST'
  } // 批量开工
  else if (data.batchType === 'stopWork') {
    url = `/api/mrp/dispatch/down`
    method = 'POST'
  } // 批量下工
  else if (data.batchType === 'suspend') {
    url = `/api/mrp/dispatch/suspend`
    method = 'PUT'
  } // 批量暂停
  // else if (data.batchType === 'start') {
  //   url = `/api/mrp/dispatch/start`
  //   method = 'PUT'
  // } // 批量开启
  else if (data.batchType === 'closed') {
    url = `/api/mrp/dispatch/close`
    method = 'PUT'
  } // 批量关闭
  else if (data.batchType === 'finished') {
    url = `/api/mrp/dispatch/finished`
    method = 'PUT'
  } // 批量完成
  return request({ url, method, data: data.list })
}


// 批量开启
export function DispatchStart(data) {
  return request({
    url: `/api/mrp/dispatch/start`,
    method: 'PUT',
    data
  })
}

// 改派

export function reassignment(data) {
  return request({
    url: `/api/mrp/dispatch/update`,
    method: 'PUT',
    data
  })
}