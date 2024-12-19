import request from '@/utils/request'

// 工艺路线列表
export function getProcessList(data) {
    return request({
        url: `/api/mes/bimRouting/list/condition`,
        method: 'POST',
        data
    })
}

// 新增工艺路线
export function addProcess(data) {
    return request({
        url: `/api/mes/bimRouting/insert`,
        method: 'POST',
        data
    })
}
// 修改


export function updateProcess(data) {
  return request({
    url: `/api/mes/bimRouting/modify`,
    method: 'put',
    data
  })
}
// 工艺路线详情
export function detailProcess(id) {
    return request({
        url: `/api/mes/bimRouting/detail/${id}`,
        method: 'GET'
    })
}

// 工艺路线管理-详情(实际资源)
export function detailResourceProcess(productsId,id) {
    return request({
        url: `/api/mes/bimRouting/detail/resource/?productsId=` + productsId + '&routingId=' + id,
        method: 'GET'
    })
}

// 删除工艺路线
export function deleteProcess(id) {
    return request({
        url: `/api/mes/bimRouting/remove/${id}`,
        method: 'DELETE'
    })
}
// 检查编码是否重复

export function checkBimRoutingCode(code, id) {
    return request({
        url: `/api/mes/bimRouting/check/code/exist?code=` + code + '&id=' + id,
        method: 'get',
    })
}

// 工艺路线导入

export function importProcess(data) {
    return request({
        url: `/api/mes/bimRouting/import`,
        method: 'POST',
        data
    })
  }


export function getWorkListMap(data) {
  return request({
      url: `/api/mrp/work/listMap`,
      method: 'POST',
      data
  })
}

// 生产计划——编排

export function addProdPlanArrange(data) {
  return request({
      url: `/api/zgt/prod/plan/arrange`,
      method: 'POST',
      data
  })
}

