import request from '@/utils/request'
// 资产分类 列表
export function getBimPropertyCategoryList(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/list/condition`,
    method: 'POST',
    data
  })
}
// 资产分类 新增
export function addBimPropertyCategoryList(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/insert`,
    method: 'POST',
    data
  })
}
// 资产分类 检查分类是否重复
export function checkBimPropertyCategoryCode(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/check/code/exist?id=${data.id}&code=${data.code}`,
    method: 'get',
  })
}
// 资产分类 编辑
export function editBimPropertyCategoryList(data) {

  return request({
    url: `/api/zgt/bimPropertyCategory/modify`,
    method: 'put',
    data
  })
}
// 资产分类 删除
export function delBimPropertyCategoryList(id) {

  return request({
    url: `/api/zgt/bimPropertyCategory/remove/${id}`,
    method: 'delete',
  })
}
// 资产分类 详情
export function bimPropertyCategoryDetail(id) {

  return request({
    url: `/api/zgt/bimPropertyCategory/detail/${id}`,
    method: 'get',
  })
}

// 资产基础信息 列表
export function bimPropertyList(data) {

  return request({
    url: `/api/zgt/bimProperty/list/condition`,
    method: 'POST',
    data
  })
}
// 资产基础信息 新增
export function addBimProperty(data) {

  return request({
    url: `/api/zgt/bimProperty/insert`,
    method: 'POST',
    data
  })
}
// 资产基础信息 修改
export function editBimProperty(data) {

  return request({
    url: `/api/zgt/bimProperty/modify`,
    method: 'put',
    data
  })
}
// 资产基础信息 删除
export function delBimProperty(id) { 

  return request({
    url: `/api/zgt/bimProperty/remove/${id}`,
    method: 'delete',
  })
}


// 资产基础信息 详情
export function bimPropertyDetail(id) {

  return request({
    url: `/api/zgt/bimProperty/detail/${id}`,
    method: 'get',
  })
}
// 资产基础信息 验证编码唯一性
export function checkBimPropertyCode(data) {

  return request({
    url: `/api/zgt/bimProperty/check/code/exist?id=${data.id}&code=${data.code}`,
    method: 'get',
  })
}






// 资产采购 列表

export function propertyPurchaseOrderList(data) {
  return request({
    url: `/api/zgt/propertyPurchaseOrder/list/condition`,
    method: 'POST',
    data
  })
}
// 资产采购  新增

export function addPropertyPurchaseOrder(data) {
  return request({
    url: `/api/zgt/propertyPurchaseOrder/insertPurchaseOrder`,
    method: 'POST',
    data
  })
}

// 资产采购  删除

export function delPropertyPurchaseOrder(id) {
  return request({
    url: `/api/zgt/propertyPurchaseOrder/remove/${id}`,
    method: 'delete',
     
  })
}

// 资产采购  编辑

export function editPropertyPurchaseOrder(data) {
  return request({
    url: `/api/zgt/propertyPurchaseOrder/modifyPurchaseOrder`,
    method: 'put',
     data
  })
}

// 资产采购  详情

export function propertyPurchaseOrderDetail(id) {
  return request({
    url: `/api/zgt/propertyPurchaseOrder/detail/${id}`,
    method: 'get',
  })
}
// 资产采购  编码唯一性

export function checkPropertyPurchaseOrderCode(data) {
  return request({
    url: `/api/zgt/propertyPurchaseOrder/check/code/exist?id=${data.id}&code=${data.code}`,
    method: 'get',
  })
}





// 资产调出 列表
export function propertyOutList(data) {
  return request({
    url: `/api/zgt/propertyOut/list/condition`,
    method: 'POST',
    data
  })
}

// 资产调出 新增

export function addPropertyOut(data) {
  return request({
    url: `/api/zgt/propertyOut/insertPurchaseOrder`,
    method: 'POST',
    data
  })
}
// 资产调出  删除
export function delPropertyOut(id) {
  return request({
    url: `/api/zgt/propertyOut/remove/${id}`,
    method: 'delete', 
  })
}

// 资产调出 编辑
export function editPropertyOut(data) {
  return request({
    url: `/api/zgt/propertyOut/modifyPurchaseOrder`,
    method: 'put',
    data
  })
}
// 资产调出  详情
export function propertyOutDetail(id) {
  return request({
    url: `/api/zgt/propertyOut/detail/${id}`,
    method: 'get', 
  })
}


// 资产报废 列表

export function propertyScrapList(data) {
  return request({
    url: `/api/zgt/propertyScrap/list/condition`,
    method: 'POST',
    data
  })
}
// 资产报废 删除

export function delPropertyScrap(id) {
  return request({
    url: `/api/zgt/propertyScrap/remove/${id}`,
    method: 'delete', 
  })
}
// 资产报废 新增

export function addPropertyScrapList(data) {
  return request({
    url: `/api/zgt/propertyScrap/insertPurchaseOrder`,
    method: 'post',
    data 
  })
}
// 资产报废 修改

export function editPropertyScrapList(data) {
  return request({
    url: `/api/zgt/propertyScrap/modifyPurchaseOrder`,
    method: 'put',
    data 
  })
}
// 资产报废 详情

export function propertyScrapDetail(id) {
  return request({
    url: `/api/zgt/propertyScrap/detail/${id}`,
    method: 'get', 
  })
}

//  资产出售  列表
export function propertySaleOrderList(data) {
  return request({
    url: `/api/zgt/propertySaleOrder/list/condition`,
    method: 'post',
    data 
  })
}

//  资产出售  新增
export function addPropertySaleOrder(data) {
  return request({
    url: `/api/zgt/propertySaleOrder/insertPurchaseOrder`,
    method: 'post',
    data 
  })
}


// 资产出售 删除

export function delPropertySaleOrder(id) {
  return request({
    url: `/api/zgt/propertySaleOrder/remove/${id}`,
    method: 'delete', 
  })
}

// 资产出售 修改

export function editPropertySaleOrder(data) {
  return request({
    url: `/api/zgt/propertySaleOrder/modifyPurchaseOrder`,
    method: 'put',
    data 
  })
}
// 资产出售 详情

export function propertySaleOrderDeatil(id) {
  return request({
    url: `/api/zgt/propertySaleOrder/detail/${id}`,
    method: 'get', 
  })
}


// 资产盘点 列表

export function propertyStocktakingList(data) {
  return request({
    url: `/api/zgt/propertyStocktaking/list/condition`,
    method: 'post',
    data 
  })
}
// 资产盘点 详情

export function propertyStocktakingDeatil(id) {
  return request({
    url: `/api/zgt/propertyStocktaking/detail/${id}`,
    method: 'get', 
  })
}


// 资产对账单 列表(报表) 
export function propertyAccountReconciliationListReport(data) {
  return request({
    url: `/api/zgt/propertyAccountReconciliation/report`,
    method: 'post',
    data 
  })
}
// 资产对账单 列表
export function propertyAccountReconciliationList(data) {
  return request({
    url: `/api/zgt/propertyAccountReconciliation/list/condition`,
    method: 'post',
    data 
  })
}

// 资产对账单 明细列表
export function propertyAccountReconciliationLineList(data) {
  return request({
    url: `/api/zgt/propertyAccountReconciliation/line/list`,
    method: 'post',
    data 
  })
}
// 资产对账单 详情
export function propertyAccountReconciliationDetail(id) {
  return request({
    url: `/api/zgt/propertyAccountReconciliation/detail/${id}`,
    method: 'get',
  })
}
// 资产对账单 新增
export function addPropertyAccountReconciliation(data) {
  return request({
    url: `/api/zgt/propertyAccountReconciliation/insert`,
    method: 'post',
    data 
  })
}







// 设备内容
// 列表

export function equContentSettingsList(data) {
  return request({
    url: `/api/zgt/equContentSettings/list`,
    method: 'post',
    data 
  })
}
// 新增

export function addEquContentSettings(data) {
  return request({
    url: `/api/zgt/equContentSettings/add`,
    method: 'post',
    data 
  })
}
// 删除

export function delEquContentSettings(id) {
  return request({
    url: `/api/zgt/equContentSettings/del/${id}`,
    method: 'delete', 
  })
}
// 修改
export function editEquContentSettings(data) {
  return request({
    url: `/api/zgt/equContentSettings/update`,
    method: 'put',
    data 
  })
}
// 详情

export function equContentSettingsDetail(id) {
  return request({
    url: `/api/zgt/equContentSettings/detail/${id}`,
    method: 'get', 
  })
}


// 设备  查看异常

export function equAbnormalReportingList(data) {
  return request({
    url: `/api/zgt/equAbnormalReporting/list`,
    method: 'post',
    data 
  })
}

// 设备 查看保养和点检

export function equTaskMaintenanceList(data) {
  return request({
    url: `/api/zgt/equTaskMaintenance/list`,
    method: 'post',
    data 
  })
}






// 配件
// 批量标记为配件

export function batchAccessory(data) {
  return request({
    url: `/api/zgt/product/classAttribute/batch/accessory`,
    method: 'put',
    data 
  })
}
// 领用 归还记录表
export function equAccessoryRequisitionList(data) {
  return request({
    url: `/api/zgt/equAccessoryRequisition/list`,
    method: 'post',
    data 
  })
}

// 领用——撤回

export function equAccessoryRequisitionRevoke(id) {
  return request({
    url: `api/zgt/equAccessoryRequisition/revoke/${id}`,
    method: 'put',
  })
}

// 设置配件关联设备
export function batchAccessoryEquipment(data) {
  return request({
    url: `/api/zgt/product/batch/accessory/equipment`,
    method: 'post',
    data 
  })
}
 
// 批量设置配件是否归还
export function batchAccessoryReturnState(data) {
  return request({
    url: `/api/zgt/product/batch/accessory`,
    method: 'put',
    data 
  })
}



// 工具  批量设置归还

export function equEquipmentBatchReturn(data) {
  return request({
    url: `/api/mes/equEquipment/batch/accessory`,
    method: 'post',
    data 
  })
}