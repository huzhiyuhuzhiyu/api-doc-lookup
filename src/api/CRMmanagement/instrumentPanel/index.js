import request from '@/utils/request'
//报表数据-仪表盘销售简报-列表
export function getsaleskitList(data) {
  return request({
    url: `/api/zgt/crm/report/data/queryBulletin`,
    method: 'POST',
    data
  })
}
//报表数据-仪表盘数据汇总图
export function getqueryDataInfo(data) {
  return request({
    url: `/api/zgt/crm/report/data/queryDataInfo`,
    method: 'POST',
    data
  })
}
//报表数据-仪表盘合同金额目标图
export function getsalesTrendList(data) {
  return request({
    url: `/api/zgt/crm/report/data/salesTrend`,
    method: 'POST',
    data
  })
}
//报表数据-仪表盘目标完成率
export function getqueryPerformance(data) {
  return request({
    url: `/api/zgt/crm/report/data/queryPerformance`,
    method: 'POST',
    data
  })
}
//报表数据-仪表盘销售漏斗
export function getsellFunneldata(data) {
  return request({
    url: `/api/zgt/crm/report/data/sellFunnel`,
    method: 'POST',
    data
  })
}
//报表数据-仪表盘客户遗忘提醒
export function getforgottenCustomerCount(data) {
  return request({
    url: `/api/zgt/crm/report/data/forgottenCustomerCount`,
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
//报表数据-合同分析
export function getcontractNumStats(data) {
  return request({
    url: `/api/zgt/crm/report/data/contractNumStats`,
    method: 'POST',
    data
  })
}
//报表数据-合同汇总表
export function gettotalContract(data) {
  return request({
    url: `/api/zgt/crm/report/data/totalContract`,
    method: 'POST',
    data
  })
}
//报表数据-客户城市分布分析
export function getaddressAnalyse(data) {
  return request({
    url: `/api/zgt/bi/rank/addressAnalyse`,
    method: 'POST',
    data
  })
}
//报表数据-客户行业分析
export function getportrait(data) {
  return request({
    url: `/api/zgt/bi/rank/portrait`,
    method: 'POST',
    data
  })
}
//报表数据-客户级别分析
export function getportraitLevel(data) {
  return request({
    url: `/api/zgt/bi/rank/portraitLevel`,
    method: 'POST',
    data
  })
}
//报表数据-客户来源分析
export function getportraitSource(data) {
  return request({
    url: `/api/zgt/bi/rank/portraitSource`,
    method: 'POST',
    data
  })
}