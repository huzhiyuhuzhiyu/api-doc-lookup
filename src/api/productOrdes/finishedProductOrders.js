import request from '@/utils/request'
// 成品订单列表
export function getprodOrderList(data) {
  return request({
    url: `/api/mrp/prod/order/page`,
    method: 'post',
    data
  })
}

//   成品订单 关闭
export function prodOrderClose(data) {
  return request({
    url: `/api/mrp/prod/order/close`,
    method: 'put',
    data
  })
}
// 生产订单删除

export function delOrderRework(id) {
  return request({
    url: `/api/mrp/prod/order/del/${id}`,
    method: 'DELETE'
  })
}
//   成品订单 接收

export function prodOrderReceive(id) {
  return request({
    url: `/api/mrp/prod/order/receive/${id}`,
    method: 'put',
  })
}

// 详情
export function prodOrderInfo(data) {
  return request({
    url: `/api/mrp/prod/order/detail/${data.id}?dispatch=` + data.dispatch,
    method: 'get',
  })
}
//   成品订单 拒收
export function prodOrderRefuse(id) {
  return request({
    url: `/api/mrp/prod/order/refuse/${id}`,
    method: 'put',
  })
}
//   成品订单 开启
export function prodOrderStart(data) {
  return request({
    url: `/api/mrp/prod/order/start`,
    method: 'put',
    data
  })
}
//   成品订单 暂停
export function prodOrderSuspend(data) {
  return request({
    url: `/api/mrp/prod/order/suspend`,
    method: 'put',
    data
  })
}
//   成品订单 完成
export function prodOrderFinished(data) {
  return request({
    url: `/api/mrp/prod/order/finished`,
    method: 'put',
    data
  })
}
//   成品订单 修改
export function updateprodOrderFinished(data) {
  return request({
    url: `/api/mrp/prod/order/update`,
    method: 'put',
    data
  })
}
//   成品订单 派工
export function prodOrderDispatch(data) {
  return request({
    url: `/api/mrp/prod/order/dispatch`,
    method: 'POST',
    data
  })
}
//   成品订单 返工
export function addProdOrder(data) {
  return request({
    url: `/api/mrp/prod/order/add`,
    method: 'POST',
    data
  })
}
//   成品订单 返工
export function getOrderSourceList(data) {
  return request({
    url: `/api/mrp/prod/order/source/list`,
    method: 'POST',
    data
  })
}


// 生产订单进度跟踪

export function getProgressList(data) {
  return request({
    url: `/api/mrp/prod/order/schedule/list`,
    method: 'POST',
    data
  })
}

// 提交批量下料

export function batchBlanking(data) {
  return request({
    url: `/api/mrp/prod/order/blanking`,
    method: 'POST',
    data
  })
}

// 获取下料列表
export function getBlankingList(data) {
  return request({
    url: `/api/mrp/prod/order/blanking/list`,
    method: 'POST',
    data
  })
}

// 返修产品列表
export function getUnqualifiedList(data) {
  return request({
    url: `/api/wms/unqualified/line/list`,
    method: 'POST',
    data
  })
}



// 派工可视化

export function dispatchListMap(data) {
  return request({
    url: `/api/mrp/dispatch/listMap`,
    method: 'POST',
    data
  })
}

// 生产订单-新增装配领料任务
export function addProdPickOrder(data) {
  return request({
    url: `/api/mrp/prod/order/add/assemble/pick`,
    method: 'POST',
    data
  })
}


// 生成重检单
export function addStockChangePackage(data) {
  return request({
    url: `/api/wms/stockChangePackage/insert`,
    method: 'POST',
    data
  })
}
