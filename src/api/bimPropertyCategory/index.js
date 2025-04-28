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

 