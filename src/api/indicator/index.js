import request from '@/utils/request'

// 指标库-根据条件查询列表
export function getIndicatorLibraryList(data) {
  return request({
    url: '/api/jx/Knowledge/indicator/library/list',
    method: 'post',
    data
  })
}

// 指标库-新增
export function addIndicatorLibrary(data) {
  return request({
    url: '/api/jx/Knowledge/indicator/library/add',
    method: 'post',
    data
  })
}

// 指标库-更新
export function updateIndicatorLibrary(data) {
  return request({
    url: '/api/jx/Knowledge/indicator/library/update',
    method: 'put',
    data
  })
}

// 指标库-详情
export function getIndicatorLibraryDetail(id) {
  return request({
    url: `/api/jx/Knowledge/indicator/library/details/${ id }`,
    method: 'get',
  })
}

// 指标库-删除
export function deleteIndicatorLibrary(id) {
  return request({
    url: `/api/jx/Knowledge/indicator/library/del/${ id }`,
    method: 'delete',
  })
}


// 指标规则-根据条件查询列表
export function getIndicatorRulesList(data) {
  return request({
    url: '/api/jx/Knowledge/indicator/rules/list',
    method: 'post',
    data
  })
}

// 指标规则-详情
export function getIndicatorRulesDetail(id) {
  return request({
    url: `/api/jx/Knowledge/indicator/rules/details/${ id }`,
    method: 'get',
  })
}

// 指标规则-新增
export function addIndicatorRules(data) {
  return request({
    url: '/api/jx/Knowledge/indicator/rules/insert',
    method: 'post',
    data
  })
}

// 指标规则-更新
export function updateIndicatorRules(data) {
  return request({
    url: '/api/jx/Knowledge/indicator/rules/update',
    method: 'put',
    data
  })
}

// 指标规则-删除
export function deleteIndicatorRules(id) {
  return request({
    url: `/api/jx/Knowledge/indicator/rules/remove/${ id }`,
    method: 'delete',
  })
}
