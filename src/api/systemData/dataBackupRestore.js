/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-05-21 17:31:20
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-05-27 17:24:41
 * @FilePath: \os-web\src\api\systemData\dataBackupRestore.js
 * @Description: 备份还原接口
 */
import request from '@/utils/request'

// 备份还原列表
export function getBackupResList(data) {
  return request({
    url: `/api/crm/db/backup/list`,
    method: 'post',
    data
  })
}
// 备份还原列表 - 新增
export function addBackupRes(data) {
  return request({
    url: `/api/crm/db/backup/add`,
    method: 'post',
    data
  })
}
// 备份还原列表 - 删除
export function deleteBackupRes(id) {
  return request({
    url: `/api/crm/db/backup/remove/${id}`,
    method: 'delete',
  })
}

// 备份还原列表 - 还原
export function restoreBackupRes(id) {
  return request({
    url: `/api/crm/db/backup/restore?id=${id}`,
    method: 'put',
  })
}

// 删除指定数据 - 列表
export function tableBackupList(data) {
  return request({
    url: `/api/crm/db/backup/table/list`,
    method: 'post',
    data
  })
}
// 删除指定数据 - 删除
export function removeBackupRes(data) {
  return request({
    url: `/api/crm/db/backup/table/truncate`,
    method: 'delete',
    data
  })
}

// 定时备份系统-新增
export function addTask(data) {
  return request({
    url: `/api/crm/db/backup/task/add`,
    method: 'post',
    data
  })
}
// 定时备份系统-列表
export function getTaskList(data) {
  return request({
    url: `/api/crm/db/backup/task/list`,
    method: 'post',
    data
  })
}
// 定时备份系统-详情
export function detailTask(id) {
  return request({
    url: `/api/crm/db/backup/task/detail/${id}`,
    method: 'get',
  })
}
// 定时备份系统-修改
export function updateTask(data) {
  return request({
    url: `/api/crm/db/backup/task/modify`,
    method: 'put',
    data
  })
}
// 定时备份系统-删除
export function removeTask(id) {
  return request({
    url: `/api/crm/db/backup/task/remove/${id}`,
    method: 'delete',
  })
}

// 数据操作记录-列表
export function getOperateRecord(data) {
  return request({
    url: `/api/crm/db/backup/operate/record`,
    method: 'post',
    data
  })
}
// 下载
export function downloadTask(id) {
  return request({
    url: `/api/crm/db/backup/download/${id}`,
    method: 'get',
  })
}
// 定时备份系统-立即执行
export function executeTask(id) {
  return request({
    url: `/api/crm/db/backup/task/execute/${id}`,
    method: 'post',
  })
}