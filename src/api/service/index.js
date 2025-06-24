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


// 服务类型——列表
export function finServiceTicketCategoryList (data) {
  return request({
    url: `/api/zgt/finServiceTicketCategory/page`,
    method: 'post',
    data
  })
}
// 服务类型——删除
export function finServiceTicketCategoryDel (id) {
  return request({
    url: `/api/zgt/finServiceTicketCategory/del/${id}`,
    method: 'delete',
  })
}

// 服务类型——校验编码是否重复
export function finServiceTicketCategoryExist (data) {
  return request({
    url: `/api/zgt/finServiceTicketCategory/check/code/exist`,
    method: 'get',
    data
  })
}
// 服务类型——新增
export function finServiceTicketCategoryAdd (data) {
  return request({
    url: `/api/zgt/finServiceTicketCategory/add`,
    method: 'post',
    data
  })
}

export function finServiceTicketCategorEdit (data) {
  return request({
    url: `/api/zgt/finServiceTicketCategory/update`,
    method: 'put',
    data
  })
}