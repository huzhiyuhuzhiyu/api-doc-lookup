import request from '@/utils/request'


export function getProdMethodList(data) {
  return request({
    url: '/api/zgt/bimProductionMethod/list',
    method: 'post',
    data: data
  })
}

export function changeProdMethod(id) {
  return request({
    url: `/api/zgt/bimProductionMethod/change/${id}`,
    method: 'get',
  })
}