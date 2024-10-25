import request from '@/utils/request'

// 获取单据规则列表(带分页)
export function getProgressStatusList(data) {
  return request({
    url: '/api/zgt/order/progress/status/list',
    method: 'post',
    data
  })
}


// 修改单据规则
export function saveProgressStatus(data) {
  return request({
    url: `/api/zgt/order/progress/status/save`,
    method: 'PUT',
    data
  })
}

// 更新单据规则状态
export function updateBillRuleState(id) {
  return request({
    url: `/api/system/BillRule/${id}/Actions/State`,
    method: 'PUT'
  })
}

export function BillNumber(enCode) {
  return request({
    url: `/api/system/BillRule/BillNumber/${enCode}`,
    method: 'GET'
  })
}
// 导出
export function exportTpl(id) {
  return request({
    url: `/api/system/BillRule/${id}/Action/Export`,
    method: 'get'
  })
}

// 批量排序
export function updateSortBatch(data) {
  return request({
    url: `/api/system/BillRule/update/sort/batch`,
    method: 'PUT',
    data
  })
}
