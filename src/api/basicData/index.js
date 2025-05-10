import request from '@/utils/request'
//设备档案-设置维修人
export const editbatchequEquipment = (data) => {
  return request({
    url: `/api/mes/equEquipment/batch/modify`,
    method: 'put',
    data: data
  })
}
// 胶管制造费单价设置-设置单价
export function setManufacturingPrice(data) {
  return request({
    url: `/api/erp/finHoseManufacturingPrice/setPrice`,
    method: 'post',
    data: data
  })
}
// 胶管制造费单价设置-默认单价
export function ManufacturingupdataPrice() {
  return request({
    url: `/api/erp/finHoseManufacturingPrice/lastPrice`,
    method: 'post',
  })
}
// 供应商、客户、外协、承运商类别  表格查询

// export function getCooperativeData(data) {
//     return request({
//       url: `/api/erp/partner/category/list/condition`,
//       method: 'post',
//       data:data
//     })
//   }
export function getCooperativeData(data) {
  return request({
    url: `/api/erp/cooperative/partner/list/condition`,
    method: 'post',
    data: data
  })
}
// 修改发货状态

export function editShipmentfreeze(data) {
  return request({
    url: `/api/erp/cooperative/partner/modify/shipment/freeze`,
    method: 'post',
    data: data
  })
}
export function getProductionLotList1(data) {
  return request({
    url: `/api/wms/stock/production/lot/list`,
    method: 'post',
    data: data
  })
}
// 检验单 查询检验项目
export function getbimInspectionTypelist(data) {
  return request({
    url: `/api/mes/bimInspectionType/list/item?inspectionCategory=${data.inspectionCategory}&productCategoryId=${data.productCategoryId}`,
    method: 'GET'
  })
}
// 供应商、客户、外协、承运商类别  新建级别
export function addCategory(data) {
  return request({
    url: `/api/erp/partner/category/insert`,
    method: 'post',
    data: data
  })
}

// 供应商、客户、外协、承运商类别  属树形图
export function getcategoryTree(data) {
  return request({
    url: `/api/erp/partner/category/tree`,
    method: 'post',
    data: data
  })
}

// 供应商、客户、外协等待 分类列表检查子节点

export function checkCategorychildNode(data) {
  return request({
    url: `/api/erp/partner/category/check/child/node`,
    method: 'post',
    data: data
  })
}
//供应商、客户、外协、承运商  删除类别


export const deleteCategory = (id) => {
  return request({
    url: `/api/erp/partner/category/remove/${id}`,
    method: 'DELETE'
  })
}


//供应商、客户、外协、承运商  获取详情
export const getCategoryInfo = (id) => {
  return request({
    url: `/api/erp/partner/category/detail/${id}`,
    method: 'get'
  })
}

//供应商、客户、外协、承运商 修改类别

export const editCategory = (data) => {
  return request({
    url: `/api/erp/partner/category/modify`,
    method: 'put',
    data: data
  })
}
//  编辑合作伙伴
export const editPartner = (data) => {
  return request({
    url: `/api/erp/cooperative/partner/modify`,
    method: 'put',
    data: data
  })
}

//  新建合作伙伴
export const addPartner = (data) => {
  return request({
    url: `/api/erp/cooperative/partner/insert`,
    method: 'POST',
    data: data
  })
}

// 获取合作伙伴的详情
export const getCooperativeInfo = (id) => {
  return request({
    url: `/api/erp/cooperative/partner/detail/${id}`,
    method: 'get'
  })
}
// 删除合作伙伴
export const deleteCooperative = (id) => {
  return request({
    url: `/api/erp/cooperative/partner/remove/${id}`,
    method: 'DELETE'
  })
}
// 获取国家数据
export const getCounryData = (data) => {
  return request({
    url: `/api/erp/country/list`,
    method: "post",
    data: data
  })
}
// 供应商系列模块  新建或编辑时  校验编码是否是唯一性
export const checkCode = (code, id, type) => {
  return request({
    url: `/api/erp/cooperative/partner/check/code/exist?code=` + code + '&id=' + id + '&type=' + type,
    method: 'get',
  })
}
// 收货地址列表
// 新增收货地址
export const addPartnerAddress = (data) => {
  return request({
    url: `/api/erp/delivery/address/insert`,
    method: 'POST',
    data: data
  })
}
// 修改收货地址
export const editaddress = (data) => {
  return request({
    url: `/api/erp/delivery/address/modify`,
    method: 'put',
    data: data
  })
}
// 详情
export const getAddressInfo = (partnerId) => {
  return request({
    url: `/api/erp/delivery/address/List/${partnerId}`,
    method: 'get'
  })
}
//
export const detailAddress = (id) => {
  return request({
    url: `/api/erp/delivery/address/detail/${id}`,
    method: 'get'
  })
}
// 删除
export const deleteAddress = (id) => {
  return request({
    url: `/api/erp/delivery/address/remove/${id}`,
    method: 'DELETE'
  })
}

// 意向客户列表

export const getPrivateList = (data) => {
  return request({
    url: `/api/erp/public/private/sea/list`,
    method: 'post',
    data: data
  })
}
// 新增意向客户

export const addPrivate = (data) => {
  return request({
    url: `/api/erp/public/private/sea/insert`,
    method: 'post',
    data: data
  })
}
// 编辑意向客户

export const editPrivate = (data) => {
  return request({
    url: `/api/erp/public/private/sea/modify`,
    method: 'put',
    data: data
  })
}
// 查看意向客户
export const privateDetail = (id) => {
  return request({
    url: `/api/erp/public/private/sea/detail/${id}`,
    method: 'get'
  })
}
// 删除意向客户
export const deletePrivate = (id) => {
  return request({
    url: `/api/erp/public/private/sea/remove/${id}`,
    method: 'delete'
  })
}
// 获取设备信息列表分页
export function getEquEquipmentList(data) {
  return request({
    url: `/api/mes/equEquipment/list/condition`,
    method: 'post',
    data
  })
}
// 批量设置任务
export function batchEquTaskSettings(data) {
  return request({
    url: `/api/zgt/equTaskSettings/settings`,
    method: 'put',
    data
  })
}
// 设备档案设置获取字典
export function getCategoryTrees(data) {
  return request({
    url: `/api/erp/product/category/tree`,
    method: 'post',
    data
  })
}


// 保存设备信息
export const saveEquEquipment = (data) => {
  return request({
    url: `/api/mes/equEquipment/insert`,
    method: 'post',
    data: data
  })
}
// 编辑设备信息
export const editEquEquipment = (data) => {
  return request({
    url: `/api/mes/equEquipment/modify`,
    method: 'put',
    data: data
  })
}
// 所有设备
export const editEquEquipmentAll = (data) => {
  return request({
    url: `/api/mes/equEquipment/all/condition`,
    method: 'post',
    data
  })
}
// 校验设备编码唯一性
export const checkEquEquipmentCode = (code, id, classAttribute) => {
  return request({
    url: `/api/mes/equEquipment/check/code/exist?code=` + code + '&id=' + id + '&classAttribute=' + classAttribute,
    method: 'get'
  })
}
// 获取设备信息详情
export const getEquEquipmentInfo = (id) => {
  return request({
    url: `/api/mes/equEquipment/detail/${id}`,
    method: 'get'
  })
}
// 去掉设备 工具等状态为报废的数据列表

export const stateEquEquipment = (data) => {
  return request({
    url: `/api/mes/equEquipment/list/condition`,
    method: 'post',
    data
  })
}
// 同步plm信息接口
export const plmsync = (id) => {
  return request({
    url: `/api/mes/equEquipment/plm/sync/${id}`,
    method: 'post',
    id
  })
}
// 获取用户
export function getUserList(data) {
  return request({
    url: `/api/permission/Users/All`,
    method: 'get',
    data
  })
}


// 仓库管理模块

// 获取仓库列表数据(树形)
export function getWarehouseList(data) {
  return request({
    url: `/api/wms/stockWarehouse/tree`,
    method: 'post',
    data
  })
}
// 新增仓库
export function addWarehouse(data) {
  return request({
    url: `/api/wms/stockWarehouse/insert`,
    method: 'post',
    data
  })
}
// 删除仓库
export const deleteWarehouse = (id) => {
  return request({
    url: `/api/wms/stockWarehouse/remove/${id}`,
    method: 'DELETE'
  })
}
// 修改仓库
export const editWarehouse = (data) => {
  return request({
    url: `/api/wms/stockWarehouse/modify`,
    method: 'put',
    data: data
  })
}

// 修改仓库
export const editWarehouseState = (data) => {
  return request({
    url: `/api/wms/stockWarehouse/modify/state`,
    method: 'put',
    data: data
  })
}

// 仓库详情数据
export const getWarehouseInfo = (id) => {
  return request({
    url: `/api/wms/stockWarehouse/detail/${id}`,
    method: 'get'
  })
}
// 验证编码唯一性

export function checWarehouseCode(code, id) {
  return request({
    url: `/api/wms/stockWarehouse/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}



// 货架货位 列表
export function getStockGoodsShelvesList(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/list/condition`,
    method: 'post',
    data
  })
}
// 货架货位   树形结构
export function getStockGoodsShelves(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/tree`,
    method: 'post',
    data
  })
}
// 新增货架货位

export function addstockGoodsShelves(data) {
  return request({
    url: `/api/wms/stockGoodsShelves/insert`,
    method: 'post',
    data
  })
}
// 删除货架货位
export const deleteStockGoodsShelves = (id) => {
  return request({
    url: `/api/wms/stockGoodsShelves/remove/${id}`,
    method: 'DELETE'
  })
}
// 修改货架货位
export const editStockGoodsShelves = (data) => {
  return request({
    url: `/api/wms/stockGoodsShelves/modify`,
    method: 'put',
    data: data
  })
}
// 货架货位详情
export const getStockGoodsShelvesInfo = (id) => {
  return request({
    url: `/api/wms/stockGoodsShelves/detail/${id}`,
    method: 'get'
  })
}
// 校验编码唯一性
export function checStockGoodsCode(code, id) {
  return request({
    url: `/api/wms/stockGoodsShelves/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}


// 设备基础参数-列表
export function parametersShelveslist(data) {
  return request({
    url: `/api/mes/equEquipmentParameters/list`,
    method: 'post',
    data
  })
}

// 设备基础参数-新增
export function addparametersShelves(data) {
  return request({
    url: `/api/mes/equEquipmentParameters/insert`,
    method: 'post',
    data
  })
}
// 设备基础参数-删除
export const deleteparametersShelves = (id) => {
  return request({
    url: `/api/mes/equEquipmentParameters/remove/${id}`,
    method: 'DELETE'
  })
}
// 设备基础参数-修改
export const editparametersShelves = (data) => {
  return request({
    url: `/api/mes/equEquipmentParameters/modify`,
    method: 'put',
    data: data
  })
}
// 设备基础参数-详情
export const getparametersInfo = (id) => {
  return request({
    url: `/api/mes/equEquipmentParameters/detail/${id}`,
    method: 'get'
  })
}
// 设备基础参数-校验编码唯一性
export function checparametersCode(code, typeCode, id) {
  return request({
    url: `/api/mes/equEquipmentParameters/check/code/exist?code=` + code + '&typeCode=' + typeCode + '&id=' + id,
    method: 'get',
  })
}


// 保养周期设置-列表
export function maintenanceShelveslist(data) {
  return request({
    url: `/api/mes/bimEquipmentMaintenanceCycle/list`,
    method: 'post',
    data
  })
}

// 保养周期设置-新增
export function addmaintenanceShelves(data) {
  return request({
    url: `/api/mes/bimEquipmentMaintenanceCycle/insert`,
    method: 'post',
    data
  })
}
// 保养周期设置-删除
export const deletemaintenanceShelves = (id) => {
  return request({
    url: `/api/mes/bimEquipmentMaintenanceCycle/remove/${id}`,
    method: 'DELETE'
  })
}
// 保养周期设置-修改
export const editmaintenanceShelves = (data) => {
  return request({
    url: `/api/mes/bimEquipmentMaintenanceCycle/modify`,
    method: 'put',
    data: data
  })
}
// 保养周期设置-详情
export const getmaintenanceInfo = (id) => {
  return request({
    url: `/api/mes/bimEquipmentMaintenanceCycle/detail/${id}`,
    method: 'get'
  })
}
// 保养周期设置-校验编码唯一性
export function checmaintenanceCode(code, id) {
  return request({
    url: `/api/mes/bimEquipmentMaintenanceCycle/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}

// 检查客户图号是否重复
export function checkCustomerCode({ customerName, code }) {
  return request({
    url: `/api/erp/quotation/basic/data/check/customer/material/code?customerName=` + customerName + '&code=' + code,
    method: 'get',
  })
}

// 新增销售报价基础数据

export function addBasicData(data) {
  return request({
    url: `/api/erp/quotation/basic/data/insert`,
    method: 'post',
    data
  })
}
// 删除销售报价基础数据
export const deleteBasicData = (id) => {
  return request({
    url: `/api/erp/quotation/basic/data/remove/${id}`,
    method: 'DELETE'
  })
}
// 修改销售报价基础数据
export const editBasicData = (data) => {
  return request({
    url: `/api/erp/quotation/basic/data/modify`,
    method: 'put',
    data: data
  })
}
// 销售报价基础数据-列表数据
export function getBasicDataList(data) {
  return request({
    url: `/api/erp/quotation/basic/data/list`,
    method: 'post',
    data
  })
}
// 销售报价基础数据-详情数据
export const getBasicDataInfo = (id) => {
  return request({
    url: `/api/erp/quotation/basic/data/detail/${id}`,
    method: 'get'
  })
}
// 销售报价基础数据-导入
export const uploadQuotationBasicData = (data) => {
  return request({
    url: `/api/erp/quotation/basic/data/upload`,
    method: 'post',
    data
  })
}
// 销售订单-进度跟踪
export function getscheduleList(data) {
  return request({
    url: `/api/erp/sale/orders/schedule/list`,
    method: 'post',
    data
  })
}

// 公式管理

// 获取列表数据
export function getFormulaList(data) {
  return request({
    url: `/api/erp/formula/list`,
    method: 'post',
    data
  })
}
// 新增公式数据
export function addFormulaList(data) {
  return request({
    url: `/api/erp/formula/insert`,
    method: 'post',
    data
  })
}
// 删除公式数据
export function deleteFormulaData(id) {
  return request({
    url: `/api/erp/formula/remove/${id}`,
    method: 'delete',
  })
}
// 修改公式数据
export function editFormulaList(data) {
  return request({
    url: `/api/erp/formula/modify`,
    method: 'put',
    data
  })
}
// 获取公式详情
export function getFormulaData(id) {
  return request({
    url: `/api/erp/formula/detail/${id}`,
    method: 'get',
  })
}
// 检查公式编号是否重复

export function checkFormulaNum(value, id) {
  return request({
    url: `/api/erp/formula/check/formula/number?formulaNumber=` + value + '&id=' + id,
    method: 'get',
  })
}

// 批量校验公式明细中  公式代码项是否重复
export function batchCheckformula(data) {
  return request({
    url: `/api/erp/formula/line/batch/check/formula/item/code`,
    method: 'post',
    data
  })
}



// 图号规则
// 表格数据
export function getRuleList(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/list`,
    method: 'post',
    data
  })
}
// 新增图号规则
export function addRuleData(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/insert`,
    method: 'post',
    data
  })
}
// 删除图号规则
export function deleteRuleData(id) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/remove/${id}`,
    method: 'delete',
  })
}
// 批量删除图号规则
export function BatchdeleteRuleData(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/delBatch`,
    method: 'delete',
    data
  })
}
// 修改图号规则
export function editRuleData(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/modify`,
    method: 'put',
    data
  })
}
// 图号规则详情数据
export function getRuleDataInfo(id) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/detail/${id}`,
    method: 'get',
  })
}
// 图号规则  检查图号是否重复
export function checRulesCode(code, id) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}
// 图号规则 上传批量翻译
export function uploadCalculate(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/line/upload/calculate`,
    method: 'post',
    data
  })
}
// 生成BOM

export function generateData(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/generate/bom/batch`,
    method: 'post',
    data
  })
}

// 图号规则-通过公式ID获取明细
export function getLineList(id) {
  return request({
    url: `/api/erp/formula/line/list/${id}`,
    method: 'get',
  })
}
// 图号计算

export function calculate(data) {
  return request({
    url: `/api/erp/customer/drawing/number/rules/line/calculate`,
    method: 'post',
    data
  })
}




// 材质管理
// 列表数据
export function getMaterialList(data) {
  return request({
    url: `/api/erp/material/quality/list`,
    method: 'post',
    data
  })
}
// 新增

export function addMaterialList(data) {
  return request({
    url: `/api/erp/material/quality/insert`,
    method: 'post',
    data
  })
}
// 删除

export function deleteMaterialList(id) {
  return request({
    url: `/api/erp/material/quality/remove/${id}`,
    method: 'delete',

  })
}
// 修改

export function editMaterialList(data) {
  return request({
    url: `/api/erp/material/quality/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getMaterialInfo(id) {
  return request({
    url: `/api/erp/material/quality/detail/${id}`,
    method: 'get',

  })
}
// 校验材质编码是否唯一
export function checkMaterialCode(code, id) {
  return request({
    url: `/api/erp/material/quality/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}



// 班组管理
//  列表数据
export function getGroupList(data) {
  return request({
    url: `/api/mes/work/group/list`,
    method: 'post',
    data
  })
}
// 新增

export function addGroupData(data) {
  return request({
    url: `/api/mes/work/group/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteGroupData(id) {
  return request({
    url: `/api/mes/work/group/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editGroupData(data) {
  return request({
    url: `/api/mes/work/group/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getGroupDataInfo(id) {
  return request({
    url: `/api/mes/work/group/detail/${id}`,
    method: 'get',
  })
}
// 检查编码是否重复

export function checkGroupCode(code, id) {
  return request({
    url: `/api/mes/work/group/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}





// 产线管理
//  列表数据
export function getProductionLineList(data) {
  return request({
    url: `/api/mes/production/line/list`,
    method: 'post',
    data
  })
}
// 新增
export function addProductionLineData(data) {
  return request({
    url: `/api/mes/production/line/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteProductionLineData(id) {
  return request({
    url: `/api/mes/production/line/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editProductionLineData(data) {
  return request({
    url: `/api/mes/production/line/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getProductionLineInfo(id) {
  return request({
    url: `/api/mes/production/line/detail/${id}`,
    method: 'get',
  })
}
// 检查编码是否重复

export function checkProductionLineCode(code, id) {
  return request({
    url: `/api/mes/production/line/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}

// 工位终端管理
//  列表数据
export function getTerminalList(data) {
  return request({
    url: `/api/mes/equStationTerminal/list`,
    method: 'post',
    data
  })
}
// 新增
export function addTerminalData(data) {
  return request({
    url: `/api/mes/equStationTerminal/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteTerminalData(id) {
  return request({
    url: `/api/mes/equStationTerminal/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editTerminalData(data) {
  return request({
    url: `/api/mes/equStationTerminal/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getTerminalInfo(id) {
  return request({
    url: `/api/mes/equStationTerminal/detail/${id}`,
    method: 'get',
  })
}
// 检查终端编码是否重复

export function checkTerminalCode(code, id) {
  return request({
    url: `/api/mes/equStationTerminal/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}


// 不良原因

//  列表数据
export function getAdverseCausesList(data) {
  return request({
    url: `/api/mes/adverseCauses/list`,
    method: 'post',
    data
  })
}
// 新增
export function addAdverseCausesData(data) {
  return request({
    url: `/api/mes/adverseCauses/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteAdverseCausesData(id) {
  return request({
    url: `/api/mes/adverseCauses/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editAdverseCausesData(data) {
  return request({
    url: `/api/mes/adverseCauses/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getAdverseCausesInfo(id) {
  return request({
    url: `/api/mes/adverseCauses/detail/${id}`,
    method: 'get',
  })
}
// 检查编码是否重复

export function checkadverseCausesCode(code, id) {
  return request({
    url: `/api/mes/adverseCauses/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}

// 不良原因

//  列表数据
export function getScrapCategoryList(data) {
  return request({
    url: `/api/zgt/bimScrapCategory/list`,
    method: 'post',
    data
  })
}
// // 新增
export function addScrapCategoryData(data) {
  return request({
    url: `/api/zgt/bimScrapCategory/add`,
    method: 'post',
    data
  })
}
// // 删除
export function deleteScrapCategoryData(id) {
  return request({
    url: `/api/zgt/bimScrapCategory/del/${id}`,
    method: 'delete',
  })
}
// // 修改
export function editScrapCategoryData(data) {
  return request({
    url: `/api/zgt/bimScrapCategory/update`,
    method: 'put',
    data
  })
}

// // 检查名称是否重复

export function checkScrapCategoryName(name, id) {
  return request({
    url: `/api/zgt/bimScrapCategory/check/code/exist?name=` + name + '&id=' + id,
    method: 'get',
  })
}

// 检验项目
//  列表数据
export function getBimInspectionItemsList(data) {
  return request({
    url: `/api/mes/bimInspectionItems/list`,
    method: 'post',
    data
  })
}
// 新增
export function addBimInspectionItemsData(data) {
  return request({
    url: `/api/mes/bimInspectionItems/insert`,
    method: 'post',
    data
  })
}
// 删除
export function deleteBimInspectionItemsData(id) {
  return request({
    url: `/api/mes/bimInspectionItems/remove/${id}`,
    method: 'delete',
  })
}
// 修改
export function editBimInspectionItemsData(data) {
  return request({
    url: `/api/mes/bimInspectionItems/modify`,
    method: 'put',
    data
  })
}
// 详情
export function getBimInspectionItemsInfo(id) {
  return request({
    url: `/api/mes/bimInspectionItems/detail/${id}`,
    method: 'get',
  })
}
// 检查编码是否重复

export function checkBimInspectionItemsCode(code, id) {
  return request({
    url: `/api/mes/bimInspectionItems/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}
// 检验类型
//列表
export function getbimInspectionType(data) {
  return request({
    url: `/api/mes/bimInspectionType/list`,
    method: 'post',
    data
  })
}
// 详情

export function bimInspectionTypedetail(id) {
  return request({
    url: `/api/mes/bimInspectionType/detail/${id}`,
    method: 'get',

  })
}
// 新增
export function addbimInspectionType(data) {
  return request({
    url: `/api/mes/bimInspectionType/insert`,
    method: 'post',
    data
  })
}
// 修改
export function editbimInspectionType(data) {
  return request({
    url: `/api/mes/bimInspectionType/modify`,
    method: 'put',
    data
  })
}
// 删除
export function delbimInspectionType(id) {
  return request({
    url: `/api/mes/bimInspectionType/remove/${id}`,
    method: 'delete',
  })
}
// 编码是否重复

export function checkBimInspectionTypeCode(code, id) {
  return request({
    url: `/api/mes/bimInspectionType/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}

// 业务开关
// 列表
export function getBimBusinessSwitchConfigList(data) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/configMap`,
    method: 'post',
    data
  })
}

// 业务配置-详情(根据Key)
export function getBimBusinessDetail(data) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/detail`,
    method: 'get',
    data
  })
}

// 业务配置-保存
export function saveBimBusinessSwitchConfigList(data) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/save`,
    method: 'post',
    data
  })
}

export function getOrderFiledMap(configValue2) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/orderFiledMap?configValue2=` + configValue2,
    method: 'get',
  })
}

// 开关
export function editSwitch(id) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/switch/${id}`,
    method: 'post',
  })
}
// 详情
export function getBimBusinessInfo(id) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/detailByKey?configKey=${id}`,
    method: 'get',
  })
}
// 详情
export function getByCode(code) {
  return request({
    url: '/api/system/BillRule/getByCode?code=' + code,
    method: 'get',
  })
}
// 修改

export function editBimBusinessData(data) {
  return request({
    url: `/api/erp/bimBusinessSwitchConfig/modify`,
    method: 'put',
    data
  })
}
// 人员设备
// 列表详情
export function getequEquipmentPersonDetail(id) {
  return request({
    url: `/api/mes/equEquipmentPerson/detail/${id}`,
    method: 'get',
  })
}
// 新增
export function addequEquipmentPerson(data) {
  return request({
    url: `/api/mes/equEquipmentPerson/insert`,
    method: 'post',
    data
  })
}
// 修改
export function updateequEquipmentPerson(data) {
  return request({
    url: `/api/mes/equEquipmentPerson/modify`,
    method: 'put',
    data
  })
}
// 删除
export function deleteequEquipmentPerson(id) {
  return request({
    url: `/api/mes/equEquipmentPerson/remove/${id}`,
    method: 'delete',
  })
}
// 条件查询 及列表

export function getquEquipmentPerson(data) {
  return request({
    url: `/api/mes/equEquipmentPerson/list`,
    method: 'post',
    data
  })
}

// 图纸管理
// 图纸详情
export function getbimDrawingDetail(id) {
  return request({
    url: `/api/mes/bimDrawing/detail/${id}`,
    method: 'get',
  })
}
// 新增
export function addbimDrawing(data) {
  return request({
    url: `/api/mes/bimDrawing/insert`,
    method: 'post',
    data
  })
}
// 修改
export function updatebimDrawing(data) {
  return request({
    url: `/api/mes/bimDrawing/modify`,
    method: 'put',
    data
  })
}
// 列表
export function getbimDrawingData(data) {
  return request({
    url: `/api/mes/bimDrawing/list`,
    method: 'post',
    data
  })
}

// 删除
export function deletebimDrawing(id) {
  return request({
    url: `/api/mes/bimDrawing/remove/${id}`,
    method: 'delete',
  })
}
// 作业指导书
//删除
export function getworkingbimDrawingDetail(id) {
  return request({
    url: `/api/mes/bimWorkingInstruction/remove/${id}`,
    method: 'delete',
  })
}
//详情
export function getworkingbimDrawinglook(id) {
  return request({
    url: `/api/mes/bimWorkingInstruction/detail/${id}`,
    method: 'get',
  })
}
// 新增
export function addworkingbimDrawing(data) {
  return request({
    url: `/api/mes/bimWorkingInstruction/insert`,
    method: 'post',
    data
  })
}
// 修改
export function updateworkingbimDrawing(data) {
  return request({
    url: `/api/mes/bimWorkingInstruction/modify`,
    method: 'put',
    data
  })
}
// 列表
export function getworkingbimDrawingData(data) {
  return request({
    url: `/api/mes/bimWorkingInstruction/list`,
    method: 'post',
    data
  })
}


// 工位管理
// 列表
export function bimWorkstationList(data) {
  return request({
    url: `/api/mes/bimWorkstation/list`,
    method: 'post',
    data
  })
}
// 详情
export function getBimWorkstation(id) {
  return request({
    url: `/api/mes/bimWorkstation/detail/${id}`,
    method: 'get',
  })
}
// 新增

export function addBimWorkstation(data) {
  return request({
    url: `/api/mes/bimWorkstation/insert`,
    method: 'post',
    data
  })
}
// 修改
export function updateBimWorkstation(data) {
  return request({
    url: `/api/mes/bimWorkstation/modify`,
    method: 'put',
    data
  })
}
// 删除

export function deleteBimWorkstation(id) {
  return request({
    url: `/api/mes/bimWorkstation/remove/${id}`,
    method: 'delete',
  })
}
// 检查工位编码
export function checkBimWorkstationCode(code, id) {
  return request({
    url: `/api/mes/bimWorkstation/check/code/exist?code=` + code + '&id=' + id,
    method: 'get',
  })
}

// 车型对照表
// 列表
export function getBimVehicleTypeData(data) {
  return request({
    url: `/api/erp/bimVehicleTypeCorresponding/list`,
    method: 'post',
    data
  })
}
// 新增
export function addBimVehicleType(data) {
  return request({
    url: `/api/erp/bimVehicleTypeCorresponding/insert`,
    method: 'post',
    data
  })
}
// 修改
export function updateBimVehicleType(data) {
  return request({
    url: `/api/erp/bimVehicleTypeCorresponding/modify`,
    method: 'put',
    data
  })
}
// 详情
export function detailBimVehicleType(id) {
  return request({
    url: `/api/erp/bimVehicleTypeCorresponding/detail/${id}`,
    method: 'get',
  })
}
// 删除
export function deleteBimVehicleType(id) {
  return request({
    url: `/api/erp/bimVehicleTypeCorresponding/remove/${id}`,
    method: 'delete',
  })
}
// 产品替代件
//列表
export function getBimProductData(data) {
  return request({
    url: `/api/erp/bimProductSubstitutionComparison/list`,
    method: 'post',
    data
  })
}
// 新增
export function addBimProduct(data) {
  return request({
    url: `/api/erp/bimProductSubstitutionComparison/insert`,
    method: 'post',
    data
  })
}
// 详情
export function detailBimProduct(id) {
  return request({
    url: `/api/erp/bimProductSubstitutionComparison/detail/${id}`,
    method: 'get',
  })
}
// 删除
export function deleteBimProduct(id) {
  return request({
    url: `/api/erp/bimProductSubstitutionComparison/remove/${id}`,
    method: 'delete',
  })
}


// 生产BOM 查询
export function getBomList(data) {
  return request({
    url: `/api/erp/bom/list`,
    method: 'POST',
    data
  })
}

// 生产BOM 新增
export function addBomData(data) {
  return request({
    url: `/api/erp/bom/add`,
    method: 'POST',
    data
  })
}

// 生产BOM 导入
export function uploadBomData(data) {
  return request({
    url: `/api/erp/bom/upload`,
    method: 'POST',
    data
  })
}

// 生产BOM 修改
export function updateBomData(data) {
  return request({
    url: `/api/erp/bom/modify`,
    method: 'PUT',
    data
  })
}

// 生产BOM 检查是否会有循环错误
export function checkLoopBug(data) {
  return request({
    url: `/api/erp/bom/check/cyclic`,
    method: 'POST',
    data
  })
}

// 生产BOM 删除
export function deleteBomData(id) {
  return request({
    url: `/api/erp/bom/remove/${id}`,
    method: 'DELETE'
  })
}

// 生产BOM 详情
export function detailBomData(id) {
  return request({
    url: `/api/erp/bom/detail/${id}`,
    method: 'GET'
  })
}

// 生产BOM 检查编码是否存在
export function checkBomCodeExist(code) {
  return request({
    url: `/api/erp/bom/check/code/exist?code=${code}`,
    method: 'GET'
  })
}
// 生产BOM 根据产品ID查询BOM ID
export function getBomByProductId(productId) {
  return request({
    url: `/api/erp/bom/query/${productId}`,
    method: 'GET'
  })
}
// 生产BOM 完整BOM树
export function getBomTree(id) {
  return request({
    url: `/api/erp/bom/tree/${id}`,
    method: 'GET'
  })
}
// 生产BOM 批量计算净长
export function batchCalculateLen(data) {
  return request({
    url: `/api/erp/bom/batch/calculate/len`,
    method: 'POST',
    data
  })
}

// 客户产品/供应商产品

export function getPartnerOrProductData(data) {
  return request({
    url: `/api/erp/cooperative/partner/product/list`,
    method: 'post',
    data
  })
}

// 新增客户产品/供应商产品

export function addPartnerOrProductData(data) {
  return request({
    url: `/api/erp/cooperative/partner/product/insert`,
    method: 'post',
    data
  })
}
// 修改客户产品/供应商产品

export function updatePartnerOrProductData(data) {
  return request({
    url: `/api/erp/cooperative/partner/product/update`,
    method: 'put',
    data
  })
}
// 删除客户产品/供应商产品

export function delPartnerOrProductData(id) {
  return request({
    url: `/api/erp/cooperative/partner/product/del/${id}`,
    method: 'DELETE',
  })
}

// 导入客户产品/供应商产品

export function uploadPartnerOrProductData(data) {
  return request({
    url: `/api/erp/cooperative/partner/product/upload/supplier/data`,
    method: 'post',
    data
  })
}

// 批次列表
export function getProductionLotList(data) {
  return request({
    url: `/api/wms/stock/production/lot/list`,
    method: 'POST',
    data
  })
}

// 多租户数据同步
// 一键同步
export function dataSync(data) {
  return request({
    url: `/api/sync/data/sync/record/total`,
    method: 'POST',
    data
  })
}

// 列表

export function dataSyncList(data) {
  return request({
    url: `/api/sync/data/sync/record/list`,
    method: 'POST',
    data
  })
}

// 基础数据 导出接口

export function excelExport(data) {
  return request({
    url: `/api/base/export`,
    method: 'POST',
    data
  })
}
export function summaryExcelExport(data) {
  return request({
    url: `/api/wms/stock/balance/export/summary`,
    method: 'POST',
    data
  })
}
// 导入客户产品
export function importCustomerProduct(data) {
  return request({
    url: `/api/erp/cooperative/partner/product/upload/Partner/data`,
    method: 'POST',
    data
  })
}

// 检验报告-导出
export function exportInspection(id) {
  return request({
    url: `/api/mes/bimInspectionType/export/${id}`,
    method: 'get',
  })
}

// 标签打印模板设置-列表
export function getLabelPrintTemplateList(data) {
  return request({
    url: `/api/mes/label/print/template/list`,
    method: 'POST',
    data
  })
}
// 标签打印模板设置-批量新增或修改
export function addOrUpdateBatchLPTData(data) {
  return request({
    url: `/api/mes/label/print/template/addOrUpdateBatch`,
    method: 'POST',
    data
  })
}
// 标签打印模板设置-批量删除
export function delBatchLPTData(data) {
  return request({
    url: `/api/mes/label/print/template/delBatch`,
    method: 'DELETE',
    data
  })
}
// 标签打印模板设置-详情
export function detailLabelPrintTemplateData(id) {
  return request({
    url: `/api/mes/label/print/template/detail/${id}`,
    method: 'GET'
  })
}
// 程序管理
// 详情
export function getbimProgramDetail(id) {
  return request({
    url: `/api/mes/bimProgram/detail/${id}`,
    method: 'get',
  })
}
// 查看程序
export function getbimProgramlook(data) {
  return request({
    url: `/api/mes/bimProgram/preview/${data.type}/${data.fileName}`,
    method: 'get',
  })
}
// 新增
export function addbimProgram(data) {
  return request({
    url: `/api/mes/bimProgram/insert`,
    method: 'post',
    data
  })
}
// 修改
export function updatebimProgram(data) {
  return request({
    url: `/api/mes/bimProgram/modify`,
    method: 'put',
    data
  })
}
// 列表
export function getbimProgramData(data) {
  return request({
    url: `/api/mes/bimProgram/list`,
    method: 'post',
    data
  })
}

// 删除
export function deletebimProgram(id) {
  return request({
    url: `/api/mes/bimProgram/remove/${id}`,
    method: 'delete',
  })
}

// 生成二维码
export function BuildQRCode() {
  return request({
    url: `/api/extend/BarCode/BuildQRCode`,
    method: 'get',
  })
}
//线索管理
// 新增
export function addCluemanagement(data) {
  return request({
    url: `/api/zgt/bimClue/add`,
    method: 'post',
    data
  })
}
// 列表
export function getCluemanagementlist(data) {
  return request({
    url: `/api/zgt/bimClue/list`,
    method: 'post',
    data
  })
}
//详情
export function getCluemanagementDetail(id) {
  return request({
    url: `/api/zgt/bimClue/detail/${id}`,
    method: 'get',
  })
}
// 修改
export function updateCluemanagement(data) {
  return request({
    url: `/api/zgt/bimClue/update`,
    method: 'put',
    data
  })
}
// 删除
export function deleteCluemanagement(id) {
  return request({
    url: `/api/zgt/bimClue/del/${id}`,
    method: 'delete',
  })
}
// 转入线索池
export function updateCluemanagementpool(data) {
  return request({
    url: `/api/zgt/bimClue/turn/pool`,
    method: 'put',
    data
  })
}
// 分配线索
export function Assignclues(data) {
  return request({
    url: `/api/zgt/bimClue/turn/clue`,
    method: 'put',
    data
  })
}
// 线索导入
export function saleCluemanagementpoolModel(data) {
  return request({
    url: `/api/zgt/bimClue/upload/data`,
    method: 'post',
    data
  })
}
// 员工导入
export function salecooperativepoolModel(data) {
  return request({
    url: `/api/crm/baseEmployee/upload`,
    method: 'post',
    data
  })
}
// 用户导入
export function salecooperativeUsers(data) {
  return request({
    url: `/api/permission/Users/upload`,
    method: 'post',
    data
  })
}
// 查找批次号

export function getBatchNumber(data) {
  return request({
    url: `/api/wms/stock/inventory/line/list`,
    method: 'post',
    data
  })
}
// 库存明细报表
export function getInventoryLineReport(data) {
  return request({
    url: `/api/wms/stock/inventory/line/report`,
    method: 'post',
    data
  })
}


// 查找批次号

export function getDepartmentList(type) {
  return request({
    url: `/api/permission/Organize/department/list?type=${type}`,
    method: 'post',
  })
}
// 供应商导入
export function supplierupload(data, type) {
  return request({
    url: `/api/erp/cooperative/partner/upload/supplier/${type}`,
    method: 'post',
    data
  })
}
// 设备导入
export function equEquipmentupload(data, type) {
  return request({
    url: `/api/mes/equEquipment/upload/data`,
    method: 'post',
    data
  })
}
// 工具导入
export function toolupload(data, type) {
  return request({
    url: `/api/mes/equEquipment/upload/tool/data/${type}`,
    method: 'post',
    data
  })
}
// 供应商、客户联系人 导入
export function supplierContactsupload(data, type) {
  return request({
    url: `/api/erp/cooperative/partner/upload/contacts/${type}`,
    method: 'post',
    data
  })
}
// 供应商、客户联系人 导入
export function supplierAddressupload(data, type) {
  return request({
    url: `/api/erp/cooperative/partner/upload/deliveryAddress/${type}`,
    method: 'post',
    data
  })
}
// 线索转客户
export function Transfercustomer(data) {
  return request({
    url: `/api/zgt/bimClue/turn/customer`,
    method: 'put',
    data
  })
}
// 配对方式
export function getpairingModeList(data) {
    return request({
        url: `/api/zgt/bimPairingMode/list`,
        method: 'post',
        data
    })
}



export function batchInboundList(data) {
  return request({
      url: `/api/wms/stock/move/inbound/batch`,
      method: 'post',
      data
  })
}
//合作伙伴产品 详情
export const getcooperativeproductInfo = (id) => {
  return request({
    url: `/api/erp/cooperative/partner/product/detail/${id}`,
    method: 'get'
  })
}

// 库存明细报表
export function getSalesOrdersInventoryLineReport(data) {
  return request({
    url: `/api/erp/sale/orders/line/stock/pageList`,
    method: 'post',
    data
  })
}