import request from '@/utils/request'

export function FlowMonitorList(data) {
  return request({
    url: `/api/workflow/Engine/FlowMonitor`,
    method: 'get',
    data
  })
}

export function getFlowMonitorList(data) {
  return request({
    url: `/api/workflow/Engine/FlowMonitor/list`,
    method: 'post',
    data
  })
}
// 批量删除流程监控
export function DeleteList(data) {
  return request({
    url: `/api/workflow/Engine/FlowMonitor`,
    method: 'DELETE',
    data
  })
}
