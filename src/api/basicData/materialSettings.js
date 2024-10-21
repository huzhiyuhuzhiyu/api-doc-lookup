import request from '@/utils/request'



// 计量单位 查询
export function getUnitData(data) {
  return request({
    url: `/api/erp/unit/list/condition`,
    method: 'POST',
    data
  })
}

// 计量单位 新增
export function addUnitData(data) {
  return request({
    url: `/api/erp/unit/insert`,
    method: 'POST',
    data
  })
}

// 计量单位 修改
export function updateUnitData(data) {
  return request({
    url: `/api/erp/unit/modify`,
    method: 'PUT',
    data
  })
}

// 计量单位 删除
export function deleteUnitData(id) {
  return request({
    url: `/api/erp/unit/remove/${id}`,
    method: 'DELETE'
  })
}

// 计量单位 详情
export function detailUnitData(name) {
  return request({
    url: `/api/erp/unit/detailByName?name=${name}`,
    method: 'GET',   
  })
}

// 计量单位 获取有效计量单位
export function getEffectUnitList(id) {
  return request({
    url: `/api/erp/unit/getAllUnits`,
    method: 'GET'
  })
}

// 计量单位 检查编码是否存在
export function checkUnitCodeExist(code) {
  return request({
    url: `/api/erp/unit/check/code/exist?unitCode=${code}`,
    method: 'GET'
  })
}

// 计量单位 检查编码是否存在
export function checkUnitNameExist(name,id) {
  return request({
    url: `/api/erp/unit/check/name/exist?name=${name}&id=${id}`,
    method: 'GET'
  })
}

// ---------------------------------------------------------------------- //
// 产品类别 树形结构
export function getcategoryTree(data) {
  return request({
    url: `/api/erp/product/category/tree`,
    method: 'POST',
    data
  })
}

// 产品类别 查询
export function getcategoryList(data) {
  return request({
    url: `/api/erp/product/category/list/condition`,
    method: 'POST',
    data
  })
}

// 产品类别 修改
export function updateCategory(data) {
  return request({
    url: `/api/erp/product/category/modify`,
    method: 'PUT',
    data
  })
}

// 产品类别 新增
export function addCategory(data) {
  return request({
    url: `/api/erp/product/category/insert`,
    method: 'POST',
    data
  })
}

// 产品类别 删除
export function deleteCategory(id) {
  return request({
    url: `/api/erp/product/category/remove/${id}`,
    method: 'DELETE'
  })
}

// 产品类别 详情
export function detailCategory(id) {
  return request({
    url: `/api/erp/product/category/detail/${id}`,
    method: 'GET'
  })
}
// 产品类别 检验编码重复
export function checkCategoryCode(data) {
  return request({
    url: `/api/erp/product/category/check/code/exist?code=` + data.code + '&parentId=' + data.parentId + '&classAttribute=' + data.classAttribute,
    method: 'get',
  })
}
// 产品类别 同步PLM
export function productPlmSync(id, data = {}) {
  return request({
    url: `/api/erp/product/category/plm/sync/${id}`,
    method: 'POST',
    data
  })
}

// ---------------------------------------------------------------------- //
// 属性库 查询
export function getattribute(data) {
  return request({
    url: `/api/erp/attribute/library/list`,
    method: 'POST',
    data
  })
}

// 属性库 修改
export function updateattribute(data) {
  return request({
    url: `/api/erp/attribute/library/modify`,
    method: 'PUT',
    data
  })
}

// 属性库 新增
export function addattribute(data) {
  return request({
    url: `/api/erp/attribute/library/insert`,
    method: 'POST',
    data
  })
}

// 属性库 删除
export function deleteattribute(id) {
  return request({
    url: `/api/erp/attribute/library/remove/${id}`,
    method: 'DELETE'
  })
}

// 属性库 详情
export function detailattribute(id) {
  return request({
    url: `/api/erp/attribute/library/detail/${id}`,
    method: 'GET'
  })
}

// 属性库 检查编码唯一性
export function checkAttributeCode({ code, businessCode }) {
  return request({
    url: `/api/erp/attribute/library/check/code/exist?businessCode=${businessCode}&code=${code}`,
    method: 'GET'
  })
}

// ---------------------------------------------------------------------- //
// 产品属性编排 查询
export function getArrange(data) {
  return request({
    url: `/api/erp/arrange/attribute/list`,
    method: 'POST',
    data
  })
}

// 产品属性编排 修改
export function updateArrange(data) {
  return request({
    url: `/api/erp/arrange/attribute/modify`,
    method: 'PUT',
    data
  })
}

// 产品属性编排 新增
export function addArrange(data) {
  return request({
    url: `/api/erp/arrange/attribute/insert`,
    method: 'POST',
    data
  })
}

// 产品属性编排 删除
export function deleteArrange(id) {
  return request({
    url: `/api/erp/arrange/attribute/remove/${id}`,
    method: 'DELETE'
  })
}

// 产品属性编排 详情
export function detailArrange(id) {
  return request({
    url: `/api/erp/arrange/attribute/detail/${id}/product`,
    method: 'GET'
  })
}

// 产品属性编排 检查编排编码是否存在
export function checkArrange({ code, id, classAttribute }) {
  return request({
    url: `/api/erp/arrange/attribute/check/code/exist?id=${id}&code=${code}&classAttribute=${classAttribute}`,
    method: 'GET'
  })
}
// 产品属性编排 批量检查编码是否存在
export function checkArrangeArr(data) {
  return request({
    url: `/api/erp/arrange/attribute/line/batch/check/code/exist`,
    method: 'POST',
    data
  })
}





// 设置成品安全库存和最高库存

export function batchUpdataProductIncentory(data) {
  return request({
    url: `/api/erp/products/inventory/modify/batch`,
    method: 'put',
    data
  })
}
// 保养等级-列表
export function getequMaintenanceLevel(data) {
  return request({
    url: `/api/zgt/equMaintenanceLevel/list`,
    method: 'POST',
    data
  })
}
// 保养等级 新增
export function addequMaintenanceLevel(data) {
  return request({
    url: `/api/zgt/equMaintenanceLevel/add`,
    method: 'POST',
    data
  })
}

// 保养等级 删除
export function deleteequMaintenanceLevel(id) {
  return request({
    url: `/api/zgt/equMaintenanceLevel/del/${id}`,
    method: 'DELETE'
  })
}
// 保养等级 详情
export function detailequMaintenanceLevel(id) {
  return request({
    url: `/api/zgt/equMaintenanceLevel/detail/${id}`,
    method: 'GET'
  })
}
// 保养等级 修改
export function updateequMaintenanceLevel(data) {
  return request({
    url: `/api/zgt/equMaintenanceLevel/update`,
    method: 'PUT',
    data
  })
}



// 设备安装地点-列表
export function getequMountedPlaces(data) {
  return request({
    url: `/api/zgt/equMountedPlaces/list`,
    method: 'POST',
    data
  })
}
// 设备安装地点 新增
export function addequMountedPlaces(data) {
  return request({
    url: `/api/zgt/equMountedPlaces/add`,
    method: 'POST',
    data
  })
}

// 设备安装地点 删除
export function deleteequMountedPlaces(id) {
  return request({
    url: `/api/zgt/equMountedPlaces/del/${id}`,
    method: 'DELETE'
  })
}
// 设备安装地点 详情
export function detaileequMountedPlaces(id) {
  return request({
    url: `/api/zgt/equMountedPlaces/detail/${id}`,
    method: 'GET'
  })
}
// 设备安装地点 修改
export function updateequMountedPlaces(data) {
  return request({
    url: `/api/zgt/equMountedPlaces/update`,
    method: 'PUT',
    data
  })
}

// 设备履历-列表
export function getequLifeCyclelist(data) {
  return request({
    url: `/api/mes/equLifeCycle/list`,
    method: 'POST',
    data
  })
}
// 设备概况分析
export function gettotalOverview(data) {
  return request({
    url: `/api/mes/equReport/totalOverview`,
    method: 'POST',
    data
  })
}
// 设备状态分析
export function gettotalEquStats(data) {
  return request({
    url: `/api/mes/equReport/totalEquStats`,
    method: 'POST',
    data
  })
}
// 设备状态次数分析
export function getequReporttotalNum(data) {
  return request({
    url: `/api/mes/equReport/totalNum`,
    method: 'POST',
    data
  })
}
// 日常点检次数
export function getdailyInspectionNum(data) {
  return request({
    url: `/api/mes/equReport/dailyInspectionNum`,
    method: 'POST',
    data
  })
}
// 月点检次数
export function getdailyInspectionMonthTotal(data) {
  return request({
    url: `/api/mes/equReport/dailyInspectionMonthTotal`,
    method: 'POST',
    data
  })
}