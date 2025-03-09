import request from '@/utils/request'

// 获取用户列表
export const getUserList = (data) => {
  return request({
    url: '/api/permission/Users',
    method: 'GET',
    data
  })
}

// 获取所有用户列表
export const UserListAll = (data) => {
  return request({
    url: '/api/permission/Users/All',
    method: 'GET',
    data
  })
}

// 获取用户下拉框列表(公司+部门+用户)
export const getUserSelector = () => {
  return request({
    url: '/api/permission/Users/Selector',
    method: 'GET'
  })
}

// 新建用户
export const createUser = (data) => {
  return request({
    url: '/api/permission/Users',
    method: 'POST',
    data
  })
}

// 修改用户
export const updateUser = (data) => {
  return request({
    url: `/api/permission/Users/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取用户信息
export const getUserInfo = (id) => {
  return request({
    url: `/api/permission/Users/${id}`,
    method: 'GET'
  })
}

// 删除用户
export const delUser = (id) => {
  return request({
    url: `/api/permission/Users/${id}`,
    method: 'DELETE'
  })
}

// 修改用户密码
export const resetUserPassword = (data) => {
  return request({
    url: `/api/permission/Users/${data.id}/Actions/ResetPassword`,
    method: 'POST',
    data
  })
}
// 批量修改用户密码
export const plresetUserPassword = (data) => {
  return request({
    url: `/api/permission/Users/ResetPassword/batch`,
    method: 'POST',
    data
  })
}
// 更新用户状态
export const updateUserState = (id) => {
  return request({
    url: `/api/permission/Users/${id}/Actions/State`,
    method: 'PUT'
  })
}

// 解除锁定
export const unlockUser = (id) => {
  return request({
    url: `/api/permission/Users/${id}/Actions/unlock`,
    method: 'PUT'
  })
}

// IM通讯获取用户
export const getImUser = data => {
  return request({
    url: '/api/permission/Users/ImUser',
    method: 'GET',
    data
  })
}

// 获取用户下拉框列表
export const getImUserSelector = (organizeId, keyword, projectId) => {
  return request({
    url: `/api/permission/Users/ImUser/Selector/${organizeId}`,
    method: 'post',
    data: { keyword, projectId }
  })
}

// 获取用户基本信息
export const getUserInfoList = userId => {
  return request({
    url: '/api/permission/Users/getUserList',
    method: 'post',
    data: { userId }
  })
}

// 获取我的下属
export const getSubordinates = (keyword, projectId) => {
  return request({
    url: '/api/permission/Users/getSubordinates',
    method: 'post',
    data: { keyword, projectId }
  })
}
// 获取当前组织用户
export const getOrganization = (data) => {
  return request({
    url: '/api/permission/Users/getOrganization',
    method: 'get',
    data
  })
}
// 通过岗位id获取用户树
export const getUsersByPositionId = (data) => {
  return request({
    url: '/api/permission/Users/GetUsersByPositionId',
    method: 'get',
    data
  })
}
// 通过角色id获取用户列表
export const getUsersByRoleId = (data) => {
  return request({
    url: '/api/permission/Users/getUsersByRoleId',
    method: 'get',
    data
  })
}
// 通过角色id获取组织下的用户列表
export const getUsersByRoleOrgId = (data) => {
  return request({
    url: `/api/permission/Users/GetUsersByRoleOrgId`,
    method: 'get',
    data
  })
}
// 通过部门id,岗位id,角色id,分组id,用户id获取用户列表(带分页)
export const getUsersByUserCondition = (data) => {
  return request({
    url: '/api/permission/Users/UserCondition',
    method: 'post',
    data
  })
}
// 导出Excel
export function ExportExcel(data) {
  return request({
    url: '/api/permission/Users/ExportExcel',
    method: 'get',
    data
  })
}
// 模板下载
export function TemplateDownload(data) {
  return request({
    url: '/api/permission/Users/TemplateDownload',
    method: 'get',
    data
  })
}
// 导入
export function ImportData(data) {
  return request({
    url: '/api/permission/Users/ImportData',
    method: 'post',
    data
  })
}
// 导入预览
export function ImportPreview(data) {
  return request({
    url: '/api/permission/Users/ImportPreview',
    method: 'get',
    data
  })
}
// 导出错误数据
export function ExportExceptionData(data) {
  return request({
    url: '/api/permission/Users/ExportExceptionData',
    method: 'post',
    data
  })
}


// 获取用户下拉框列表
export const getListByAuthorize = (organizeId, keyword) => {
  return request({
    url: `/api/permission/Users/GetListByAuthorize/${organizeId}`,
    method: 'post',
    data: { keyword }
  })
}

// 根据条件获取用户列表
export const getUserListPost = (data) => {
  return request({
    url: `/api/permission/Users/list/condition`,
    method: 'post',
    data
  })
}

// 岗位调动
export const userTransfer = (data) => {
  return request({
    url: `/api/permission/Users/user/Change`,
    method: 'post',
    data
  })
}

// 办理离职
export const userQuit = (data) => {
  return request({
    url: `/api/permission/Users/user/Resination`,
    method: 'post',
    data
  })
}

// 重新入职
export const userReHired = (data) => {
  return request({
    url: `/api/permission/Users/user/reHired`,
    method: 'post',
    data
  })
}
// 员工信息-新增
export const addbaseEmployee = (data) => {
  return request({
    url: `/api/crm/baseEmployee/insert`,
    method: 'post',
    data
  })
}
// 员工信息详情
export const getbaseEmployeeInfo = (id) => {
  return request({
    url: `/api/crm/baseEmployee/detail/${id}`,
    method: 'GET'
  })
}
// 员工信息-列表
export const getbaseEmployee = (data) => {
  return request({
    url: `/api/crm/baseEmployee/list`,
    method: 'post',
    data
  })
}
// 员工信息-修改
export const updatebaseEmployee = (data) => {
  return request({
    url: `/api/crm/baseEmployee/modify`,
    method: 'put',
    data
  })
}
// 删除用户
export const delbaseEmployee = (id) => {
  return request({
    url: `/api/crm/baseEmployee/remove/${id}`,
    method: 'DELETE'
  })
}
// 员工信息-调岗
export const baseEmployeemove = (data) => {
  return request({
    url: `/api/crm/baseEmployee/move/post`,
    method: 'post',
    data
  })
}
// 员工信息-离职
export const Resination = (data) => {
  return request({
    url: `/api/crm/baseEmployee/user/Resination`,
    method: 'post',
    data
  })
}
// 调岗记录详情
export const getrecordInfo = (id) => {
  return request({
    url: `/api/crm/baseEmployee/change/record/${id}`,
    method: 'GET'
  })
}

// 用户主页收藏-新增
export const addUserFavorites = (data) => {
  return request({
    url: `/api/zgt/bimUserFavorites/add`,
    method: 'post',
    data
  })
}

// 用户主页收藏-列表
export const getUserFavorites = (data) => {
  return request({
    url: `/api/zgt/bimUserFavorites/list`,
    method: 'post',
    data
  })
}

// 用户主页收藏-修改
export const updateUserFavorites = (data) => {
  return request({
    url: `/api/zgt/bimUserFavorites/update`,
    method: 'put',
    data
  })
}

// 用户主页收藏-删除
export const delUserFavorites = (id) => {
  return request({
    url: `/api/zgt/bimUserFavorites/del/${id}`,
    method: 'DELETE'
  })
}

// 获取用户下拉框列表
export const getListBySys = () => {
  return request({
    url: `/api/permission/Users/getListBySys`,
    method: 'GET'
  })
}
