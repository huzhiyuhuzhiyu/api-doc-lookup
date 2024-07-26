import request from '@/utils/request'
// 获取产品属性种类

export function getbimProductAttributes(id) {
  return request({
      url: '/api/system/DictionaryData/'+id,
      method: 'GET',
  })
}
// 产品属性列表
export function getbimProductAttributesList(data) {
    return request({
        url: '/api/erp/bimProductAttributes/list',
        method: 'post',
        data: data
    })
}
// 产品属性-检查编码是否存在
export function  checkAbnoramlTypeCode(typeCode,name,id) {
  return request({
    url: '/api/erp/bimProductAttributes/check/code/exist?typeCode='+typeCode+"&name="+name +"&id="+id,
    method: 'GET'
  })
}
// 产品属性——新增
export function addBimProductAttributes(data) {
  return request({
      url: '/api/erp/bimProductAttributes/insert',
      method: 'post',
      data: data
  })
}
// 产品属性——删除
export function delBimProductAttributes(id) {
  return request({
      url: '/api/erp/bimProductAttributes/remove/'+id,
      method: 'delete',
  })
}
// 产品属性——修改
export function updataBimProductAttributes(data) {
  return request({
      url: '/api/erp/bimProductAttributes/modify',
      method: 'put',
      data: data
  })
}
// 产品属性——详情
export function getBimProductAttributesInfo(id) {
  return request({
      url: '/api/erp/bimProductAttributes/detail/'+id,
      method: 'get',
  })
}



// 型号管理——列表
export function getbimProductsModelList(data) {
  return request({
      url: '/api/erp/bimProductsModel/list',
      method: 'post',
      data: data
  })
}
// 型号管理——新增
export function addBimProductsModel(data) {
  return request({
      url: '/api/erp/bimProductsModel/insert',
      method: 'post',
      data: data
  })
}
// 型号管理——删除
export function delBimProductsModel(id) {
  return request({
      url: '/api/erp/bimProductsModel/remove/'+id,
      method: 'delete',
  })
}
// 型号管理—修改
export function updataBimProductsModel(data) {
  return request({
      url: '/api/erp/bimProductsModel/modify',
      method: 'put',
      data: data
  })
}
// 型号管理—详情
export function getbimProductsModelInfo(id) {
  return request({
      url: '/api/erp/bimProductsModel/detail/'+id,
      method: 'get',
  })
}
// 型号管理——唯一性

export function updataBimProductsModelCheck(data) {
  return request({
      url: '/api/erp/bimProductsModel/check/model/exist?model='+data,
      method: 'get',
  })
}
// 型号管理——导入

export function uploadDimProductsModel(data) {
  return request({
      url: '/api/erp/bimProductsModel/upload/data',
      method: 'post',
      data: data
  })
}


// 产品列表——所有

export function getProducts(data) {
  return request({
      url: '/api/zgt/product/list',
      method: 'post',
      data: data
  })
}
// 根据规格型号 全匹配查产品

export function getDetailByDrawNo(drawingNo) {
  return request({
      url: '/api/zgt/product/detailByDrawNo?drawNo='+drawingNo,
      method: 'get',
  })
}


// 数据表分类(列表)
export function getDataCatogryList(data) {
  return request({
      url: '/api/erp/bimDataCategory/tree',
      method: 'post',
      data: data
  })
}
// 数据表分类(新增)

export function addDataCatogryList(data) {
  return request({
      url: '/api/erp/bimDataCategory/add',
      method: 'post',
      data: data
  })
}
// 数据表分类(编辑)

export function editDataCatogryList(data) {
  return request({
      url: '/api/erp/bimDataCategory/modify',
      method: 'put',
      data: data
  })
}

// 数据表分类(删除)

export function deleteDataCatogryList(id) {
  return request({
      url: '/api/erp/bimDataCategory/remove/'+id,
      method: 'delete',
  })
}
// 数据表分类(详情)
export function detailDataCatogryList(id) {
  return request({
      url: '/api/erp/bimDataCategory/detail/'+id,
      method: 'get',
  })
}


// 自定义表设置(列表)

export function getbimDataCustomTableList(data) {
  return request({
      url: '/api/erp/bimDataCustomTable/list',
      method: 'post',
      data: data
  })
}
// 自定义表设置(新增)

export function addbimDataCustomTableList(data) {
  return request({
      url: '/api/erp/bimDataCustomTable/add',
      method: 'post',
      data: data
  })
}
// 自定义表设置(编辑)
export function editbimDataCustomTableList(data) {
  return request({
      url: '/api/erp/bimDataCustomTable/modify',
      method: 'put',
      data: data
  })
}

// 自定义表设置(删除)

export function deletebimDataCustomTableList(id) {
  return request({
      url: '/api/erp/bimDataCustomTable/remove/'+id,
      method: 'delete',
  })
}
// 自定义表设置(详情)
export function detailbimDataCustomTableList(id) {
  return request({
      url: '/api/erp/bimDataCustomTable/detail/'+id,
      method: 'get',
  })
}





// 列表自定义(列表)

export function getColumnList(data) {
  return request({
      url: '/api/zgt/data/column/display/list',
      method: 'post',
      data: data
  })
}
// 列表自定义(修改名称)

export function editColumnList(data) {
  return request({
      url: '/api/zgt/data/column/display/update',
      method: 'put',
      data: data
  })
}
// 列表自定义(新增)

export function addColumnList(data) {
  return request({
      url: '/api/zgt/data/column/display/add',
      method: 'post',
      data: data
  })
}
// 列表自定义(校验属性名称是否唯一)

export function checkAttributeexist(data) {
  return request({
      url: '/api/zgt/data/column/display/check/attribute/exist?listCategoryId='+data.listCategoryId+"&attributeName="+data.attributeName+'&id='+data.id,
      method: 'get',
  })
}

// 列表自定义(详情)
export function detailColumnList(id) {
  return request({
      url: '/api/zgt/data/column/display/detail/'+id,
      method: 'get',
   
  })
}
// 列表自定义(批量更新排序)

export function batchAttributeSort(data) {
  return request({
      url: '/api/zgt/data/column/display/update/sort/batch',
      method: 'put',
      data: data
  })
}
// 列表自定义(修改显示状态)

export function editAttributState(data) {
  return request({
      url: '/api/zgt/data/column/display/update/state',
      method: 'put',
      data: data
  })
}


// 数据建模——列表
export function getDataModelList(data) {
  return request({
      url: '/api/crm/db/backup/table/list',
      method: 'post',
      data: data
  })
}
// 数据建模——批量设置分类
export function batchSetCategory(data) {
  return request({
      url: '/api/zgtdata/category/related/add/batch',
      method: 'POST',
      data: data
  })
}



// 业务列表分类——列表
export function getBusinessListCategoryAPI(data) {
  return request({
      url: '/api/erp/bimBusinessListCategory/tree',
      method: 'post',
      data: data
  })
}

// 业务列表分类——新增
export function addBusinessListCategoryAPI(data) {
  return request({
      url: '/api/erp/bimBusinessListCategory/add',
      method: 'post',
      data: data
  })
}
// 业务列表分类——修改
export function editBusinessListCategoryAPI(data) {
  return request({
      url: '/api/erp/bimBusinessListCategory/modify',
      method: 'put',
      data: data
  })
}
// 业务列表分类——删除
export function delBusinessListCategoryAPI(id) {
  return request({
      url: '/api/erp/bimBusinessListCategory/remove/'+id,
      method: 'delete',
  })
}
// 业务列表分类——详情
export function detailBusinessListCategoryAPI(id) {
  return request({
      url: '/api/erp/bimBusinessListCategory/detail/'+id,
      method: 'get',
  })
}
// 业务列表分类——校验编码唯一
export function checkBusinessListCategoryCode(data) {
  return request({
      url: '/api/erp/bimBusinessListCategory/check/code/exist?id='+data.id+"&code="+data.code,
      method: 'get',
  })
}



// 系统版本说明——列表
export function getInstructionsList(data) {
  return request({
      url: '/api/crm/bim/update/instructions/list',
      method: 'post',
      data: data
  })
}
// 系统版本说明——新增
export function addInstructionsList(data) {
  return request({
      url: '/api/crm/bim/update/instructions/add',
      method: 'post',
      data: data
  })
}
// 系统版本说明——修改
export function editInstructionsList(data) {
  return request({
      url: '/api/crm/bim/update/instructions/modify',
      method: 'pus',
      data: data
  })
}
// 系统版本说明——删除
export function deleteInstructionsList(id) {
  return request({
      url: '/api/crm/bim/update/instructions/remove/'+id,
      method: 'delete',
  })
}
// 系统版本说明——详情
export function  detailInstructionsList(id) {
  return request({
      url: '/api/crm/bim/update/instructions/detail/'+id,
      method: 'get',
  })
}

// 类别属性列表
export function getclassAttributeList(data) {
  return request({
      url: '/api/zgt/product/classAttribute/list',
      method: 'post',
      data: data
  })
}

// 类别属性-检查编码是否存在
export function  checkClassAttributeCode(code,id) {
  return request({
    url: '/api/zgt/product/classAttribute/check/code/exist?code='+code+"&id="+id,
    method: 'GET'
  })
}

// 类别属性——新增
export function addClassAttributes(data) {
  return request({
      url: '/api/zgt/product/classAttribute/add',
      method: 'post',
      data: data
  })
}

// 类别属性——详情
export function getClassAttributeInfo(id) {
  return request({
      url: '/api/zgt/product/classAttribute/detail/'+id,
      method: 'get',
  })
}

// 类别属性——修改
export function updataClassAttribute(data) {
  return request({
      url: '/api/zgt/product/classAttribute/update',
      method: 'put',
      data: data
  })
}