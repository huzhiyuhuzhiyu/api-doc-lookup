import request from '@/utils/request'
// 服务单 
// 列表
export function finServiceTicketList (data) {
  return request({
    url: `/api/zgt/finServiceTicket/page`,
    method: 'post',
    data
  })
}
// 新增
export function addFinServiceTicket (data) {
  return request({
    url: `/api/zgt/finServiceTicket/add`,
    method: 'post',
    data
  })
}
// 修改
export function editFinServiceTicket (data) {
  return request({
    url: `/api/zgt/finServiceTicket/update`,
    method: 'put',
    data
  })
}
// 删除

export function delFinServiceTicket (id) {
  return request({
    url: `/api/zgt/finServiceTicket/del/${id}`,
    method: 'delete',
  })
} 