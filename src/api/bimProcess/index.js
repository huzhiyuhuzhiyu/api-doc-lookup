import request from '@/utils/request'

// 获取工序分页
export function getBimProcessList (data) {
  return request({
    url: '/api/mes/bimProcess/list/condition',
    method: 'post',
    data
  })
}

// 获取工序详情
export function getBimProcessDetail (id) {
  return request({
    url: `/api/mes/bimProcess/detail/${id}`,
    method: 'get',
  })
}

// 获取下道工序详情
export function getNextBimProcess (productsId,processId) {
  return request({
    url: `/api/mes/bimProcess/next/detail?productsId=` + productsId + '&processId=' + processId,
    method: 'post',
  })
}

// 新增工序
export function addBimProcess (data) {
  return request({
    url: '/api/mes/bimProcess/insert',
    method: 'post',
    data
  })
}
// 编辑工序
export function updateBimProcess (data) {
  return request({
    url: '/api/mes/bimProcess/modify',
    method: 'put',
    data
  })
}
// 删除工序
export function deleteBimProcess (id) {
  return request({
    url: `/api/mes/bimProcess/remove/${id}`,
    method: 'delete',
  })
}
// 校验编码唯一性

export function checkBimProcessCode (code, id) {
  return request({
    url: `/api/mes/bimProcess/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}
// 产品设置工序单价  列表
export function priceResourceLine (data) {
  return request({
    url: '/api/mes/production/resourceLine/list/price',
    method: 'post',
    data
  })
}
// 设置价格
export function updatePriceResourceLine (data) {
  return request({
    url: '/api/mes/production/resourceLine/price/modify',
    method: 'put',
    data
  })
}
// 生产资源配置明细-自动更新价格
export function autoUpdatePriceitem (data) {
  return request({
    url: `/api/mes/production/resourceLine/autoUpdatePrice`,
    method: 'put',
    data
  })
}
// 工序管理-批量设置单价
export function updatebimProcessPrice (data) {
  return request({
    url: '/api/mes/bimProcess/batchUpdatePrice',
    method: 'put',
    data
  })
}

// 获取工序分页
export function importProcessList (data) {
  return request({
    url: '/api/mes/bimProcess/import',
    method: 'post',
    data
  })
}

// 产品工序价格API-列表
export function getBimProductProcessPrice (data) {
  return request({
    url: '/api/zgt/bimProductProcessPrice/page',
    method: 'post',
    data
  })
}

// 产品工序价格API-删除
export function deleteBimProductProcessPrice (id) {
  return request({
    url: `/api/zgt/bimProductProcessPrice/remove/${id}`,
    method: 'delete',
  })
}

// 产品工序价格API-批量设置
export function batchAddBimProductProcessPrice (data) {
  return request({
    url: '/api/zgt/bimProductProcessPrice/batchAdd',
    method: 'post',
    data
  })
}

// 产品包装价格

// 产品包装价格-导入
export function uploadBimProductProcessPrice (data) {
  return request({
    url: '/api/zgt/bimProductProcessPrice/upload',
    method: 'post',
    data
  })
}

// 产品包装价格-列表
export function getBimProductPackagingPrice (data) {
  return request({
    url: '/api/zgt/bimProductPackagingPrice/page',
    method: 'post',
    data
  })
}

// 产品包装价格-批量新增
export function batchAddBimProductPackagingPrice (data) {
  return request({
    url: '/api/zgt/bimProductPackagingPrice/batchAdd',
    method: 'post',
    data
  })
}

// 产品包装价格-导入
export function uploadBimProductPackagingPrice (data) {
  return request({
    url: '/api/zgt/bimProductPackagingPrice/upload',
    method: 'post',
    data
  })
}

// 产品属性价格

// 产品属性价格-列表
export function getBimProductAttributePrice (data) {
  return request({
    url: '/api/zgt/productAttributePrice/page',
    method: 'post',
    data
  })
}

// 产品属性价格-删除
export function deleteBimProductAttributePrice (id) {
  return request({
    url: `/api/zgt/productAttributePrice/remove/${id}`,
    method: 'delete',
  })
}

// 产品属性价格-批量设置
export function batchAddBimProductAttributePrice (data) {
  return request({
    url: '/api/zgt/productAttributePrice/batchAdd',
    method: 'post',
    data
  })
}

// 产品属性价格-导入
export function uploadBimProductAttributePrice (data) {
  return request({
    url: '/api/zgt/productAttributePrice/upload',
    method: 'post',
    data
  })
}

// 产品工序重量 列表
export function productProcessWeightList (data) {
  return request({
    url: '/api/zgt/bimProductProcessWeight/page',
    method: 'post',
    data
  })
}
// 产品工序重量 新增
export function batchAddProductProcessWeight (data) {
  return request({
    url: '/api/zgt/bimProductProcessWeight/batchAdd',
    method: 'post',
    data
  })
}
// 删除
export function deleteProductProcessWeight (id) {
    return request({
        url: `/api/zgt/bimProductProcessWeight/remove/${id}`,
        method: 'delete',
    })
}
export function uploadProductProcess (data) {
    return request({
        url: '/api/zgt/bimProductProcessWeight/upload',
        method: 'post',
        data
    })
}
