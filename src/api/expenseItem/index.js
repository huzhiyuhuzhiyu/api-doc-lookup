import request from '@/utils/request'
// 费用项目
// 列表
export function getFinExpenseItem(data) {
    return request({
      url: `/api/erp/finExpenseItem/list/condition`,
      method: 'post',
      data
    })
  }

 // 新增
export function addFinExpenseItem(data) {
  return request({
    url: `/api/erp/finExpenseItem/insert`,
    method: 'post',
    data
  })
}

// 详情
export function getfinExpenseItemDetail(id) {
  return request({
    url: `/api/erp/finExpenseItem/detail/${id}`,
    method: 'get',
  })
}

//修改
export function editFinExpenseItem(data) {
  return request({
    url: `/api/erp/finExpenseItem/modify`,
    method: 'put',
    data
  })
}
// 修改排序修改
export function editFinExpensemodifySort(data) {
  return request({
    url: `/api/erp/finExpenseItem/modifySort`,
    method: 'put',
    data
  })
}

// 删除
export const deleteFinExpenseItem = (id) => {
  return request({
    url: `/api/erp/finExpenseItem/remove/${id}`,
    method: 'delete'
  })
}


// 检查项目名称是否重复
export const checkFinExpenseItem = (itemName,id) => {
  return request({
    url: `/api/erp/finExpenseItem/check/itemName?itemName=` + itemName + '&id=' + id,
    method: 'get'
  })
}

// 获取所有产品类别配置
export function bimProductTypeConfig() {
  return request({
    url: `/api/erp/bimProductTypeConfig/all`,
    method: 'get',
  })
}

// 设置产品类别
export function setProductTypeConfig(data) {
  return request({
    url: `/api/erp/bimProductTypeConfig/setProductTypeConfig`,
    method: 'post',
    data
  })
}