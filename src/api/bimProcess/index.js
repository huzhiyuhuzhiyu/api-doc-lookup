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