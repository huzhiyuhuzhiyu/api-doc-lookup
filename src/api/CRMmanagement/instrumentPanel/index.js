import request from '@/utils/request'
//商机管理-列表
export function getsaleskitList(data) {
  return request({
    url: `/api/zgt/crm/report/data/sale/receive/list`,
    method: 'POST',
    data
  })
}