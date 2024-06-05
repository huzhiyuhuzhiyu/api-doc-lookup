import request from '@/utils/request'

// MRP运算 左侧列表
export function getMRPMaterialList(data) {
  return request({
    url: `/api/mrp/material/demand/page`,
    method: 'POST',
    data
  })
}

// MRP 分析
export function analyseMRP(data) {
  return request({
    url: `/api/mrp/material/demand/unpack`,
    method: 'POST',
    data
  })
}
// MRP 左侧详情
export function getMRPInfo(id) {
  return request({
    url: `/api/mrp/material/demand/detail/${id}`,
    method: 'get'
  })
}
// MRP 提交运算
export function submitMRP(data) {
  return request({
    url: `/api/mrp/material/demand/submit`,
    method: 'PUT',
    data
  })
}



// MRP 清空右侧列表数据
export function clearMRPList(id) {
  return request({
    url: `/api/mrp/material/demand/clear`,
    method: 'DELETE'
  })
}

// 物料替换
export function demandReplace(data) {
  return request({
    url: `/api/mrp/material/demand/replace`,
    method: 'POST',
    data
  })
}


// 生产下达

export function demandProduceissue(data) {
  return request({
    url: `/api/mrp/material/demand/produce/issue`,
    method: 'POST',
    data
  })
}


// 采购外协下达

export function demandProcureissue(data) {
  return request({
    url: `/api/mrp/material/demand/procure/issue`,
    method: 'POST',
    data
  })
}
// 齐套查询
export function getDemandList(id) {
  return request({
    url: `/api/mrp/material/demand/kit/list?id=${id}`,
    method: 'get',
    
  })
}


// BOM_明细

export function BOMLineList(id) {
  return request({
    url: `/api/erp/bom/line/list?bomId=${id}`,
    method: 'POST',
  })
}


// 齐套查询
export function demandSourceReport(data) {
  return request({
    url: `/api/mrp/material/demand/source/report`,
    method: 'POST',
    data
  })
}