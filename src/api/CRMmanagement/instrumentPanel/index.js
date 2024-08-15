import request from '@/utils/request'
//报表数据-销售接单-列表
export function getsaleskitList(data) {
  return request({
    url: `/api/zgt/crm/report/data/sale/receive/list`,
    method: 'POST',
    data
  })
}
//报表数据-客户转化率分析图
export function getCustomerconversionrate(data) {
  return request({
    url: `/api/zgt/crmBi/customerConversionStats`,
    method: 'POST',
    data
  })
}
//报表数据-客户跟进次数分析图
export function getcustomerRecordStats(data) {
  return request({
    url: `/api/zgt/crmBi/customerRecordStats`,
    method: 'POST',
    data
  })
}
//报表数据-客户跟进次数分析表
export function getcustomerRecordInfo(data) {
  return request({
    url: `/api/zgt/crmBi/customerRecordInfo`,
    method: 'POST',
    data
  })
}
//报表数据-客户总量分析图
export function gettotalCustomerTable(data) {
  return request({
    url: `/api/zgt/crmBi/totalCustomerTable`,
    method: 'POST',
    data
  })
}
//报表数据-客户总量分析表
export function gettotalCustomerStats(data) {
  return request({
    url: `/api/zgt/crmBi/totalCustomerStats`,
    method: 'POST',
    data
  })
}