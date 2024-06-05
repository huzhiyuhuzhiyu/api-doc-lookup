import request from '@/utils/request'
// 审批业务-列表
export function getApprovalList(data) {
    return request({
        url: `/api/crm/approval/list`,
        method: 'post',
        data
    })
}
// 审批业务-列表
export function getApprovalListPage(data) {
    return request({
        url: `/api/crm/approval/page`,
        method: 'post',
        data
    })
}
// 审批业务-新增
export function addApproval(data) {
		return request({
				url: `/api/crm/approval/add`,
				method: 'post',
				data
		})
}
// 审批业务-修改
export function updateApproval(data) {
		return request({
				url: `/api/crm/approval/update`,
				method: 'put',
				data
		})
}
// 审批业务-删除
export function deleteApproval(id) {
		return request({
				url: `/api/crm/approval/del/${id}`,
				method: 'delete',
		})
}
// 审批业务-详情
export function getApprovalDetail(id) {
    return request({
      url: `/api/crm/approval/condition/detail/${id}`,
      method: 'get',
    })
  }
// 检验是否重复
export function checkApprovalName(params) {
	return request({
	  url: `/api/crm/approval/check/code/exist?code=${params.code}&id=${params.id}`,
	  method: 'post',
	})
  }