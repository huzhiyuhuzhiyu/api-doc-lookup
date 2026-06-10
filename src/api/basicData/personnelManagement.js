import request from '@/utils/request'

// 调岗记录 查询
export function getTransferData(data) {
  return request({
    url: `/api/permission/ChangeRecord/list/condition/change`,
    method: 'POST',
    data
  })
}

// 离职记录 查询
export function getQuitData(data) {
  return request({
    url: `/api/permission/ChangeRecord/list/condition/resignation`,
    method: 'POST',
    data
  })
}