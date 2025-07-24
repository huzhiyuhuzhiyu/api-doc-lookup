import request from '@/utils/request'
// 待询价新增
export function submitWaitEnquiryData (data) {
  return request({
    url: '/api/erp/purPurchaseInquiry/add',
    method: 'post',
    data
  })
}