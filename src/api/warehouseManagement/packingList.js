import request from '@/utils/request'

// 装箱单 列表
export function salePackingList(data) {
  return request({
    url: `/api/wms/stockPackingList/list/condition`,
    method: 'POST',
    data
  })
}

// 新增
export function addSalePackingList(data) {
  return request({
    url: `/api/wms/stockPackingList/insert`,
    method: 'POST',
    data
  })
}

// 修改
export function updateSalePackingList(data) {
  return request({
    url: `/api/wms/stockPackingList/modify`,
    method: 'PUT',
    data
  })
}

// 删除
export function deteleSalePackingList(id) {
  return request({
    url: `/api/wms/stockPackingList/remove/${id}`,
    method: 'DELETE',
  })
}

// 详情
export function detailSalePackingList(id) {
  return request({
    url: `/api/wms/stockPackingList/detail/${id}`,
    method: 'GET'
  })
}
// 导入产品
export function uploadstockPackingList(data) {
  return request({
    url: `/api/wms/stockPackingList/upload/directPacking/data`,
    method: 'post',
    data: data
  })
}
// 明细列表
export function lineSalePackingList(data) {
  return request({
    url: `/api/wms/stockPackingList/lineList/condition`,
    method: 'POST',
    data
  })
}



// 装箱条码管理
// 列表
export function stockBoxBarcodeList(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/list/condition`,
    method: 'POST',
    data
  })
}

// 明细列表

export function lineStockBoxBarcode(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/lineList/condition`,
    method: 'POST',
    data
  })
}

// 拆箱
export function splitBox(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/splitBox`,
    method: 'PUT',
    data
  })
}

// 更换条码
export function modifyBarcode(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/modifyBarcode`,
    method: 'PUT',
    data
  })
}
// 详情
export function detailStockBoxBarcode(id) {
  return request({
    url: `/api/wms/stockBoxBarcode/detail/${id}`,
    method: 'GET'
  })
}

// 空箱

export function emtyeStockBoxBarcode(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/insert`,
    method: 'POST',
    data
  })
}

// 空箱装箱
export function emptyModifyBarcode(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/modify`,
    method: 'PUT',
    data
  })
}

// 通过条码获取装箱条码详情
export function detailByBarCodes(data) {
  return request({
    url: `/api/wms/stockBoxBarcode/detailByBarCodes`,
    method: 'POST',
    data
  })
}

// 通过销售订单或者计划查 生产订单列表
export function prodOrderPackingList(data) {
	return request({
		url: `/api/mrp/prod/order/packing/list`,
		method: 'POST',
		data
	})
}

// 生产人列表

export function producePersonList(id) {
  return request({
    url: `/api/mrp/work/producer/list?workOrderId=${id}`,
    method: 'GET'
  })
}