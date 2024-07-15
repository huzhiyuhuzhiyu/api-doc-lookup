import request from '@/utils/request'

// 获取菜单列表
export const getSystem = (data) => {
  return request({
    url: '/api/system/System',
    method: 'GET',
    data
  })
}


//新建菜单列表
export const create = (data) => {
  return request({
    url: '/api/system/System',
    method: 'post',
    data
  })
}

//修改菜单列表
export const update = (data) => {
  return request({
    url: `/api/system/System/${data.id}`,
    method: 'put',
    data
  })
}

//菜单详情
export const info = (id) => {
  return request({
    url: `/api/system/System/${id}`,
    method: 'get'
  })
}


//删除菜单
export const delSystem = (id) => {
  return request({
    url: `/api/system/System/${id}`,
    method: 'delete'
  })
}


//菜单详情
export const copy = (id) => {
    return request({
        url: `/api/system/System/copy/${id}`,
        method: 'GET'
    })
}

// 企业首页 更新说明
 export const updateInstructions = (data) => {
  return request({
    url: '/api/crm/bim/update/instructions/list',
    method: 'post',
    data
  })
}

// 检查功能菜单编码重复
 export const checkCode = (code,id) => {
  return request({
    url: `/api/visualdev/Base/check/code/exist?code=${code}&id=${id}`,
    method: 'get',
  })
}

// 获取功能信息
export function detailVisualDevInfo(code) {
  return request({
    url: `/api/visualdev/Base/detailByCode?code=${code}`,
    method: 'get'
  })
}
