/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-05 15:44:04
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-07-27 12:51:14
 * @FilePath: \os-web-zgt4.0\src\api\system\system.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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


//  sql 占位符 获取列表数据
export const getDocData = (data) => {
  return request({
    url: 'api/visualdev/Base/getDocData',
    method: 'post',
    data
  })
}
// 系统缓存-页面缓存-保存
export function saveWebCache(data) {
  return request({
    url: '/api/system/System/web/cache/save',
    method: 'POST',
    data
  })
}
// 系统缓存-页面缓存-查询
export function getWebCache() {
  return request({
    url: '/api/system/System/web/cache/get',
    method: 'GET'
  })
}
