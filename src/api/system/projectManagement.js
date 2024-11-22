import request from '@/utils/request'

// 获取项目管理列表
export function getProjectList(data) {
  return request({
    url: `/api/zgt/project/list`,
    method: 'post',
    data
  })
}

// 项目管理-检查项目编码是否存在
export function checkProjectCode(data) {
  return request({
    url: `/api/zgt/project/check/code/exist`,
    method: 'get',
    data
  })
}

// 新增项目管理列表
export function addProjectList(data) {
  return request({
    url: `/api/zgt/project/add`,
    method: 'post',
    data
  })
}

// 编辑项目管理列表
export function updateProjectList(data) {
  return request({
    url: `/api/zgt/project/update`,
    method: 'put',
    data
  })
}

// 编辑项目管理列表
export function updateSortBatch(data) {
  return request({
    url: `/api/zgt/project/update/sort/batch`,
    method: 'put',
    data
  })
}

// 删除项目管理列表
export const delProject = (id) => {
  return request({
    url: `/api/zgt/project/del/${id}`,
    method: 'delete'
  })
}