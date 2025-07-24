import request from '@/utils/request'
// 询价明细查询
export function getEnquiryDetailList (data) {
  return request({
    url: '/api/erp/purPurchaseInquiry/line/page',
    method: 'post',
    data
  })
}
