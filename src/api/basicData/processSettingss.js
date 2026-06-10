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

  // 工艺路线-批量设置工艺
export function batchProcess(data) {
    return request({
        url: `/api/mes/bimRouting/setting/batch`,
        method: 'POST',
        data
    })
}

  // 工艺路线-批量删除
  export function delProcess(data) {
    return request({
        url: `/api/mes/bimRouting/del/batch`,
        method: 'PUT',
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

// 获取上一道工序的 测振等级数据(测震工序后面的工序可用)

export function getvibrationList(data) {
  return request({
      url: `/api/zgt/proWorkFinish/vibration/list`,
      method: 'get',
      data
  })
}
// 获取上一道工序的配对方式（配对工序后面的工序可用）
export function getPairingModelList(data) {
  return request({
      url: `/api/zgt/proWorkFinish/pairingModel/list`,
      method: 'get',
      data
  })
}
// 获取上一一道工序的精度等级（精度工序后可用）

export function getaccuracyList(data) {
  return request({
      url: `/api/zgt/proWorkFinish/accuracy/list`,
      method: 'get',
      data
  })
}
