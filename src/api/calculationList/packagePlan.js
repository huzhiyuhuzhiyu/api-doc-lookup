import request from '@/utils/request'

// 包装计划 列表
export function getPackplanList(data) {

  return request({
    url: `/api/mrp/pack/plan/list`,
    method: 'POST',
    data
  })
}

// 包装计划 新增
export function addPackplan(data) {

  return request({
    url: `/api/mrp/pack/plan/add`,
    method: 'POST',
    data
  })
}
// 包装计划 删
export function delPackplan(id) {
  return request({
    url: `/api/mrp/pack/plan/del/${id}`,
    method: 'delete'
  })
}
// 包装计划 改
export function updatePackplan(data) {

  return request({
    url: `/api/mrp/pack/plan/update`,
    method: 'PUT',
    data
  })
}



// 包装计划 查(详情)
export function packPlabDetail(id) {
  return request({
    url: `/api/mrp/pack/plan/detail/${id}`,
    method: 'get'
  })
}

// 下载包装计划

export function packPlabExport(id) {
  return request({
    url: `/api/mrp/pack/plan/export/${id}`,
    method: 'get'
  })
}

// 车型对照表 列表
export function getVehicleList(data) {
  return request({
    url: `/api/mrp/mrpVehicleModelWorkstationTable/list`,
    method: 'POST',
    data
  })
}
// 车型对照表 新增
export function addVehicle(data) {
  return request({
    url: `/api/mrp/mrpVehicleModelWorkstationTable/insert`,
    method: 'POST',
    data
  })
}
// 车型对照表 改
export function updateVehicle(data) {
  return request({
    url: `/api/mrp/mrpVehicleModelWorkstationTable/modify`,
    method: 'PUT',
    data
  })
}
// 车型对照表 删
export function delVehicle(id) {
  return request({
    url: `/api/mrp/mrpVehicleModelWorkstationTable/remove/${id}`,
    method: 'delete'
  })
}
// 车型对照表 查(详情)
export function packVehicle(id) {
  return request({
    url: `/api/mrp/mrpVehicleModelWorkstationTable/detail/${id}`,
    method: 'get'
  })
}
// 车型对照表-导入
export function saleUploadVehicleModel(data) {
  return request({
    url: `/api/mrp/mrpVehicleModelWorkstationTable/upload/data`,
    method: 'post',
    data
  })
}

// 包装计划 销售订单明细
export function packSaleLineList(data) {
  return request({
    url: `/api/erp/sale/orders/line/pack/list`,
    method: 'post',
    data
  })
}