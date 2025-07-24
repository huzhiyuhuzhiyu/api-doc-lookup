import request from '@/utils/request'
// 询价列表查询
export function getEnquiryLedgerList (data) {
  return request({
    url: '/api/erp/purPurchaseInquiry/page',
    method: 'post',
    data
  })
}

// 询价详情接口
export function getEnquiryDetailById (id) {
  return request({
    url: `/api/erp/purPurchaseInquiry/detail/${id}`,
    method: 'get',
  })
}
