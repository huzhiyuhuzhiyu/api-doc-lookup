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
//报表数据-客户总量分析表
export function gettotalCustomerTable(data) {
  return request({
    url: `/api/zgt/crmBi/totalCustomerTable`,
    method: 'POST',
    data
  })
}
//报表数据-客户总量分析图
export function gettotalCustomerStats(data) {
  return request({
    url: `/api/zgt/crmBi/totalCustomerStats`,
    method: 'POST',
    data
  })
}
//报表数据-公海客户分析表
export function getpoolTable(data) {
  return request({
    url: `api/zgt/crmBi/poolTable`,
    method: 'POST',
    data
  })
}
//报表数据-公海客户分析图
export function getpoolStats(data) {
  return request({
    url: `api/zgt/crmBi/poolStats`,
    method: 'POST',
    data
  })
}
//报表数据-员工客户成交周期图
export function getemployeeCycle(data) {
  return request({
    url: `/api/zgt/crmBi/employeeCycle`,
    method: 'POST',
    data
  })
}
//报表数据-员工客户成交周期表
export function getemployeeCycleInfo(data) {
  return request({
    url: `/api/zgt/crmBi/employeeCycleInfo`,
    method: 'POST',
    data
  })
}
//报表数据-地区成交周期图
export function getdistrictCycle(data) {
  return request({
    url: `/api/zgt/crmBi/districtCycle`,
    method: 'POST',
    data
  })
}
//报表数据-地区成交周期图
export function getproductCycle(data) {
  return request({
    url: `/api/zgt/crmBi/productCycle`,
    method: 'POST',
    data
  })
}
//报表数据-销售漏斗
export function getsellFunnel(data) {
  return request({
    url: `/biFunnel/sellFunnel`,
    method: 'POST',
    data
  })
}
//报表数据-新增商机分析
export function getaddBusinessAnalyze(data) {
  return request({
    url: `/biFunnel/addBusinessAnalyze`,
    method: 'POST',
    data
  })
}
//报表数据-商机转化率分析
export function getwin(data) {
  return request({
    url: `/biFunnel/win`,
    method: 'POST',
    data
  })
}