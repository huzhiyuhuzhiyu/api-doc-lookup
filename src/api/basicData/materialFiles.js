import request from '@/utils/request'

// 产品档案 查询
export function getProductList(data) {
  return request({
    url: `/api/zgt/product/list`,
    method: 'POST',
    data
  })
}
// 产品档案库存 查询
export function getProductkcList(data) {
  return request({
    url: `/api/erp/products/inventory/list`,
    method: 'POST',
    data
  })
}
// 产品档案 新增
export function addProductData(data) {
  return request({
    url: `/api/erp/products/insert`,
    method: 'POST',
    data
  })
}

// 产品档案 修改
export function updateProductData(data) {
  return request({
    url: `/api/erp/products/modify`,
    method: 'PUT',
    data
  })
}
// 产品档案设置 修改
export function updateProductkcData(data) {
  return request({
    url: `/api/erp/products/inventory/modify`,
    method: 'PUT',
    data
  })
}
// 产品档案 删除
export function deleteProductData(id) {
  return request({
    url: `/api/erp/products/remove/${id}`,
    method: 'DELETE'
  })
}

// 产品档案 详情
export function detailProductData(id) {
  return request({
    url: `/api/erp/products/detail/${id}`,
    method: 'GET'
  })
}

// 产品档案 检查编码是否存在
export function checkCodeExist(data) {
  return request({
    url: `/api/erp/products/check/code/exist?classAttribute=${data.classAttribute}&code=${data.code}`,
    method: 'GET'
  })
}

// 产品档案 检查图号是否存在
export function checkDrawExist(drawNo) {
  return request({
    url: `/api/erp/products/check/draw/exist?drawNo=${drawNo}`,
    method: 'GET'
  })
}

// 动态条件(列表flag、订单flag、查询条件flag)
export function getDynamicConditions(data) {
  return request({
    url: `/api/erp/arrange/attribute/line/list`,
    method: 'POST',
    data
  })
}

// 产品档案 毛重系数计算
export function productsCalculateGross(data) {
  return request({
    url: `/api/erp/products/calculate/gross`,
    method: 'POST',
    data
  })
}

// 产品档案 毛重系数计算
export function batchSetProductPrice(data) {
  return request({
    url: `/api/erp/products/batch/set/price`,
    method: 'POST',
    data
  })
}

// 钢管物料 查询
export function getSteelList(data) {
  return request({
    url: `/api/erp/steel/materials/list`,
    method: 'POST',
    data
  })
}

// 钢管物料 新增
export function addSteelData(data) {
  return request({
    url: `/api/erp/steel/materials/add`,
    method: 'POST',
    data
  })
}

// 钢管物料 修改
export function updateSteelData(data) {
  return request({
    url: `/api/erp/steel/materials/modify`,
    method: 'PUT',
    data
  })
}

// 钢管物料 删除
export function deleteSteelData(id) {
  return request({
    url: `/api/erp/steel/materials/remove/${id}`,
    method: 'DELETE'
  })
}

// 钢管物料 详情
export function detailSteelData(id) {
  return request({
    url: `/api/erp/steel/materials/detail/${id}`,
    method: 'GET'
  })
}

// 钢管物料 检查编码是否存在
export function checkSteelCodeExist(data) {
  return request({
    url: `/api/erp/steel/materials/check/code/exist?code=${data.code}`,
    method: 'GET'
  })
}

// 产品档案 批量设置检验方式
export function batchSetInspectionMethod(data) {
  return request({
    url: `/api/erp/products/batch/set/inspect`,
    method: 'POST',
    data
  })
}

// 产品档案 查看bom引用
export function bomProductData(data) {
  return request({
    url: `/api/erp/products/bom`,
    method: 'post',
    data
  })
}

// 产品 批量设置检验方式
export function batchSetProducts(data) {
  return request({
    url: `/api/erp/products/sampling/rules/batch/set`,
    method: 'POST',
    data
  })
}

// 工序 批量设置检验方式
export function batchSetProcesses(data) {
  return request({
    url: `/api/zgt/process/sampling/rules/batch/set`,
    method: 'POST',
    data
  })
}