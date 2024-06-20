/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-19 15:09:11
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-19 15:55:32
 * @FilePath: \os-web-zgt4.0\src\api\customerManagement\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 我的客户 列表
export function getPartnerList(data) {
  return request({
    url: '/api/erp/cooperative/partner/potential/list/condition',
    method: 'post',
    data
  })
}
// 我的联系人 列表
export function getMyContactsList(data) {
  return request({
    url: '/api/erp/contacts/list',
    method: 'post',
    data
  })
}
// 服务记录 列表
export function getServiceRecordList(data) {
  return request({
    url: '/api/erp/bimCustomerServiceRecords/list',
    method: 'post',
    data
  })
}
// 服务记录 新增
export function addServiceRecord(data) {
  return request({
    url: '/api/erp/bimCustomerServiceRecords/add',
    method: 'post',
    data
  })
}
// 服务记录 修改
export function updateServiceRecord(data) {
  return request({
    url: '/api/erp/bimCustomerServiceRecords/modify',
    method: 'put',
    data
  })
}
// 服务记录 详情
export function detailServiceRecord(id) {
  return request({
    url: `/api/erp/bimCustomerServiceRecords/detail/${id}`,
    method: 'get',
  })
}
// 服务记录 删除
export function deleteServiceRecord(id) {
  return request({
    url: `/api/erp/bimCustomerServiceRecords/remove/${id}`,
    method: 'delete',
  })
}