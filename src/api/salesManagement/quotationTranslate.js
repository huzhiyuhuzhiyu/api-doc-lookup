import request from '@/utils/request'

// 报价翻译管理-列表
export function getQuotaionTranslateList(data) {
  return request({
    url: `/api/erp/quotation/translation/list`,
    method: 'post',
    data
  })
}
// 报价翻译管理-新增
export function addQuotaionTranslateData(data) {
  return request({
    url: `/api/erp/quotation/translation/add`,
    method: 'post',
    data
  })
}
// 报价翻译管理-修改
export function updateQuotaionTranslateData(data) {
  return request({
    url: `/api/erp/quotation/translation/update`,
    method: 'put',
    data
  })
}
// 报价翻译管理-删除
export function deleteQuotaionTranslateData(id) {
  return request({
    url: `/api/erp/quotation/translation/del/${id}`,
    method: 'delete'
  })
}
// 报价翻译管理-详情
export function detailQuotaionTranslateData(id) {
  return request({
    url: `/api/erp/quotation/translation/detail/${id}`,
    method: 'get'
  })
}
// 报价翻译管理-处理
export function handleQuotaionTranslateData(data) {
  return request({
    url: `/api/erp/quotation/translation/process`,
    method: 'put',
    data
  })
}