import request from '@/utils/request';

//销售调价单

 //  列表数据
 export function getadjustPriceList(data) {
    return request({
      url: `/api/erp/sale/adjust/price/list`,
      method: 'post',
      data
    })
}
//  列表数据
export function getadjustPricemxList(data) {
  return request({
    url: `/api/erp/sale/adjust/price/line/list`,
    method: 'post',
    data
  })
}
//  列表数据
export function pageAdjustPricePage(data) {
  return request({
    url: `/api/erp/sale/adjust/price/page`,
    method: 'post',
    data
  })
}

  // 新增
 
  export function addPriceAdjust(data) {
    return request({
      url: `/api/erp/sale/adjust/price/add`,
      method: 'post',
      data
    })
  }
  // 删除
  export function deleteAdjustPrice(id) {
    return request({
      url: `/api/erp/sale/adjust/price/del/${id}`,
      method: 'delete',
    })
  }
  // 修改
  export function editAdjustPrice(data) {
    return request({
      url: `/api/erp/sale/adjust/price/update`,
      method: 'put',
      data
    })
  }
  // 详情
  export function getAdjustPrice(id) {
    return request({
      url: `/api/erp/sale/adjust/price/detail/${id}`,
      method: 'get',
    })
  }