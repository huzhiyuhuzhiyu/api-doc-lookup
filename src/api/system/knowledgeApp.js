import request from '@/utils/request'

// 获取app更新列表
export function getAppList(data) {
  return request({
    url: `/api/knowledge/appUpgrade/list/condition`,
    method: 'post',
    data
  })
}

// 新增App更新
export function insertApp(data) {
  return request({
    url: '/api/knowledge/appUpgrade/insert',
    method: 'POST',
    data
  })
}
