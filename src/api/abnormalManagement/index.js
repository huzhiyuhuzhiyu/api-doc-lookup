import request from '@/utils/request'

// 异常类型-列表
export function  getAbnoramlTypeData(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/list',
    method: 'POST',
    data
  })
}
// 异常类型-新增
export function  addAbnoramlTypeData(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/add',
    method: 'POST',
    data
  })
}
// 异常类型-排序
export function  updateSortBatch(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/update/sort/batch',
    method: 'PUT',
    data
  })
}
// 异常类型-修改
export function  updateAbnoramlTypeData(data) {
  return request({
    url: '/api/mes/ab/abnormal/type/update',
    method: 'PUT',
    data
  })
}
// 异常类型-详情
export function  detailAbnoramlTypeData(id) {
  return request({
    url: `/api/mes/ab/abnormal/type/detail/${id}`,
    method: 'GET'
  })
}
// 异常类型-删除
export function  deleteAbnoramlTypeData(id) {
  return request({
    url: `/api/mes/ab/abnormal/type/del/${id}`,
    method: 'DELETE'
  })
}
// 异常类型-检查编码是否存在
export function  checkAbnoramlTypeCode(code,id) {
  return request({
    url: `/api/mes/ab/abnormal/type/check/code/exist?code=${code}&id=${id}`,
    method: 'GET'
  })
}
// 系统异常-检查编码是否存在
export function  checkSystemCode(code,id) {
  return request({
    url: `/api/zgt/ab/system/exception/check/code/exist?code=${code}&id=${id}`,
    method: 'GET'
  })
}
export function  detailSystemAbnoram(id) {
  return request({
    url: `/api/zgt/ab/system/exception/detail/${id}`,
    method: 'GET'
  })
}
// 系统异常-检查编码是否存在
export function  checkSystemValidSql(data) {
  return request({
    url: `/api/zgt/ab/system/exception/valid/sql`,
    method: 'POST',
    data
  })
}

// 异常申请记录-列表
export function  getAbnoramlData(data) {
  return request({
    url: '/api/mes/ab/apply/record/list',
    method: 'POST',
    data
  })
}
// 异常数据-列表
export function  getRecordData(id) {
  return request({
    url: `/api/mes/ab/apply/record/data/${id}`,
    method: 'get',
  })
}
// 系统异常申请记录-列表
export function  getSystemAbnoramlData(data) {
  return request({
    url: '/api/zgt/ab/system/exception/list',
    method: 'POST',
    data
  })
}
export function  addSystemAbnoramlData(data) {
  return request({
    url: '/api/zgt/ab/system/exception/add',
    method: 'POST',
    data
  })
}
// 系统异常 - 修改
export function  updateSystemData(data) {
  return request({
    url: '/api/zgt/ab/system/exception/update',
    method: 'PUT',
    data
  })
}
// 系统异常 - 修改状态
export function  updateState(data) {
  return request({
    url: '/api/zgt/ab/system/exception/update/state',
    method: 'PUT',
    data
  })
}
// 系统异常 - 删除
export function  delSystemData(id) {
  return request({
    url: `/api/zgt/ab/system/exception/del/${id}`,
    method: 'DELETE'
  })
}
// 异常申请记录-工具
export function  getAbnoramlModule(data) {
  return request({
    url: '/api/mes/ab/apply/record/stats/module',
    method: 'GET',
    data
  })
}
// 异常申请记录-新增
export function  addAbnoramlData(data) {
  return request({
    url: '/api/mes/ab/apply/record/add',
    method: 'POST',
    data
  })
}
// 异常申请记录-修改
export function  updateAbnoramlData(data) {
  return request({
    url: '/api/mes/ab/apply/record/update',
    method: 'PUT',
    data
  })
}
// 异常申请记录-详情
export function  detailAbnoramlData(id) {
  return request({
    url: `/api/mes/ab/apply/record/detail/${id}`,
    method: 'GET'
  })
}
// 异常申请记录-删除
export function  deleteAbnoramlData(id) {
  return request({
    url: `/api/mes/ab/apply/record/del/${id}`,
    method: 'DELETE'
  })
}

/**
 * 异常申请记录-分析-按类型
 * @param data
 * @returns {AxiosPromise}
 */
export function analysisByType(data) {
  return request({
    url: '/api/mes/ab/apply/record/stats/analysis/type',
    method: 'POST',
    data
  })
}

/**
 * 异常申请记录-分析-按内容
 * @param data
 * @returns {AxiosPromise}
 */
export function analysisByContent(data) {
  return request({
    url: '/api/mes/ab/apply/record/stats/analysis/content',
    method: 'POST',
    data
  })
}

/**
 * 异常申请记录-分析-导出-按内容
 * @param data
 * @returns {*}
 */
export function exportAnalysisByContent(data){
    return request({
        url:'/api/mes/ab/apply/record/export/analysis/content',
        method:'POST',
        data
    })
}

/**
 * 异常申请记录-分析-导出-按类型
 * @param data
 * @returns {*}
 */
export function exportAnalysisByType(data){
    return request({
        url:'/api/mes/ab/apply/record/export/analysis/type',
        method:'POST',
        data
    })
}
