import request from '@/utils/request'

// 检验报表（金工、组装、总成） 列表
export function getqualityReportList(data) {
    return request({
      url: `/api/report/data/inspect/produce/report`,
      method: 'POST',
      data
    })
  }
  // 采购收货报表
  export function getProduceReportList(data) {
    return request({
      url: `/api/report/data/inspect/purchase/report`,
      method: 'POST',
      data
    })
  }
  