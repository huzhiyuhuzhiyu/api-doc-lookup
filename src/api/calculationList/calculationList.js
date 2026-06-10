import request from '@/utils/request'

// 计划管理 列表
export function getPlanList(data) {
  return request({
    url: `/api/mrp/plan/list`,
    method: 'POST',
    data
  })
}

// 计划管理 新增
export function addPlanList(data) {
  return request({
    url: `/api/mrp/plan/add`,
    method: 'POST',
    data
  })
}
// 计划管理 删除
export function deletePlanList(id) {
  return request({
    url: `/api/mrp/plan/del/${id}`,
    method: 'DELETE'
  })
}
// 计划管理 修改
export function updatePlanList(data) {
  return request({
    url: `/api/mrp/plan/update`,
    method: 'PUT',
    data
  })
}
// 明细列表

export function getPlanLineList(data) {
  return request({
    url: `/api/mrp/plan/line/list`,
    method: 'POST',
    data
  })
}

// 计划管理 详情
export function detailPlanList(id) {
  return request({
    url: `/api/mrp/plan/detail/${id}`,
    method: 'GET'
  })
}



// 计划进度

export function getPlanSchedule(id) {
  return request({
    url: `/api/mrp/plan/schedule?id=`+id,
    method: 'GET'
  })
}

/**mrp替代申请单-新增 */
export function addMrpReplaceApply(data) {
    return request({
        url: `/api/mrp/replace/apply/add`,
        method: 'POST',
        data
    })
}
/**mrp替代申请单-详情 */
export function detailMrpReplaceApply(id) {
    return request({
        url: `/api/mrp/replace/apply/detail/${id}`,
        method: 'GET',
    })
}
/**mrp替代申请单-列表 */
export function getMrpReplaceApplyList(data) {
    return request({
        url: `/api/mrp/replace/apply/list`,
        method: 'POST',
        data
    })
}
/**mrp替代申请单-修改 */
export function modifyMrpReplaceApply(data) {
    return request({
        url: `/api/mrp/replace/apply/modify`,
        method: 'PUT',
        data
    })
}
