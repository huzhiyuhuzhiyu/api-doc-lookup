import request from '@/utils/request'
// 询价管理列表
export function getEnquiryManagementList (data) {
  return request({
    url: '/api/erp/bimInquiry/page',
    method: 'post',
    data
  })
}
// 查询待询价单
export function getWaitEnquiryOrdersList (data) {
  return request({
    url: '/api/erp/sale/quotation/detail/list',
    method: 'post',
    data
  })
}


