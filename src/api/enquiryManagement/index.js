import request from '@/utils/request'
// 询价管理列表
export function getEnquiryManagementList (data) {
  return request({
    url: '/api/erp/bimInquiry/page',
    method: 'post',
    data
  })
}

// 新增询价
export function addEnquiryManagement (data) {
  return request({
    url: '/api/erp/bimInquiry/add',
    method: 'post',
    data
  })
}

// 编辑询价
export function editEnquiryManagement (data) {
  return request({
    url: '/api/erp/bimInquiry/edit',
    method: 'put',
    data
  })
}

// 删除询价
export function deleteEnquiryManagement (id) {
  return request({
    url: `/api/erp/bimInquiry/del/${id}`,
    method: 'delete',
  })
}

// 查询询价详情
export function getEnquiryManagementInfo (id) {
  return request({
    url: `/api/erp/bimInquiry/detail/${id}`,
    method: 'get',
  })
}