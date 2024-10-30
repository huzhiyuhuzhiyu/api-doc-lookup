import request from '@/utils/request'
// 应收付对账
// 列表
export function getfinAccountList(data) {
    return request({
      url: `/api/erp/finAccountsReceivableReconciliation/list/condition`,
      method: 'post',
      data
    })
  }

// 对账收款
export function getfinAccountLineList(data) {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/line/list`,
    method: 'post',
    data
  })
}

// 详情
export const getfinAccountDetail = (id) => {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/detail/${id}`,
    method: 'get'
  })
}
// 新增
export function addfinAccount(data) {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/insert`,
    method: 'post',
    data
  })
}

//修改
export function editfinAccount(data) {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/modify`,
    method: 'put',
    data
  })
}

// 删除
export const deletefinAccount = (id) => {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/remove/${id}`,
    method: 'delete'
  })
}


// 生成采购对账  列表
export function getfinAccountGoodsList(data) {
  return request({
    url: `/api/erp/purPurchaseReceiptReturnGoods/bill/list`,
    method: 'post',
    data
  })
}


// 销售对账列表

export function getsalefinAccountList(data) {
  return request({
    url: `/api/wms/stock/move/bill/page`,
    method: 'post',
    data
  })
}

// 导出采购对账明细信息
export const exportFinAccountsReceivableReconciliation = (id) => {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/detail/export/${id}`,
    method: 'get'
  })
}

// 应收付对账列表 分页 合计 
export function getfinAccountsReport(data) {
  return request({
    url: `/api/erp/finAccountsReceivableReconciliation/report`,
    method: 'post',
    data
  })
}