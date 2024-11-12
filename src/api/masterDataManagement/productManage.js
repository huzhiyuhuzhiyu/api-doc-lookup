/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-12 16:30:33
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-17 14:31:36
 * @FilePath: \os-web-zgt4.0\src\api\masterDataManagement\productManage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 产品 列表
export function getProductList(data) {
  return request({
    url: '/api/zgt/product/list',
    method: 'post',
    data: data
  })
}
// 产品 新增
export function addProduct(data) {
  return request({
    url: '/api/zgt/product/add',
    method: 'post',
    data: data
  })
}
// 成品 新增
export function cpAddProduct(data) {
  return request({
    url: '/api/zgt/product/cp/add',
    method: 'post',
    data: data
  })
}
// 成品 智能新增
export function cpAiAddProduct(data) {
  return request({
    url: '/api/zgt/product/ai/add',
    method: 'post',
    data: data
  })
}

// 产品档案 检查编码是否存在
export function checkCodeExist(data) {
  return request({
    url: `/api/zgt/product/check/code/exist?id=${data.id}&code=${data.code}`,
    method: 'GET'
  })
}
// 产品档案 检查编码是否存在
export function checkDrawExist(data) {
  return request({
    url: `/api/zgt/product/check/draw/exist?id=${data.id}&drawNo=${data.drawingNo}`,
    method: 'GET'
  })
}
// 产品档案 检查编码是否存在
export function checkModelExist(data) {
  return request({
    url: `/api/zgt/product/check/model/exist?id=${data.id}&model=${data.model}`,
    method: 'GET'
  })
}

// 产品档案 删除
export function deleteProduct(id) {
  return request({
    url: `/api/zgt/product/del/${id}`,
    method: 'DELETE'
  })
}
// 产品档案 详情
export function detailProduct(id) {
  return request({
    url: `/api/zgt/product/detail/${id}`,
    method: 'GET'
  })
}
// 产品档案设置 修改
export function updateProductData(data) {
  return request({
    url: `/api/zgt/product/update`,
    method: 'PUT',
    data
  })
}

// 产品价格设置 修改
export function updateProductPrice(data) {
  return request({
    url: `/api/zgt/product/update/price`,
    method: 'PUT',
    data
  })
}

// 成品 导入 
export function uploadCpProductData(data) {
  return request({
    url: `/api/zgt/product/cp/upload`,
    method: 'post',
    data
  })
}

// 成品(没有型号) 导入 
export function uploadUnCpProductData(data) {
  return request({
    url: `/api/zgt/product/un/cp/upload`,
    method: 'post',
    data
  })
}

// 产品管理 导入 
export function uploadProductData(data) {
  return request({
    url: `/api/zgt/product/upload`,
    method: 'post',
    data
  })
}