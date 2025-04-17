import request from '@/utils/request'

// 产品重量与数量对应信息-列表
export function getProductsWeightQuantityList(data) {
    return request({
        url: `/api/zgt/bimProductsWeightQuantity/list`,
        method: 'POST',
        data
    })
}

// 产品重量与数量对应信息-新增
export function addProductsWeightQuantity(data) {
    return request({
        url: `/api/zgt/bimProductsWeightQuantity/add`,
        method: 'POST',
        data
    })
}
// 产品重量与数量对应信息-修改

export function updateProductsWeightQuantity(data) {
  return request({
    url: `/api/zgt/bimProductsWeightQuantity/update`,
    method: 'post',
    data
  })
}
// 产品重量与数量对应信息-详情
export function detailProductsWeightQuantity(id) {
    return request({
        url: `/api/zgt/bimProductsWeightQuantity/detail/${id}`,
        method: 'GET'
    })
}


// 产品重量与数量对应信息-删除
export function deleteProductsWeightQuantity(id) {
    return request({
        url: `/api/zgt/bimProductsWeightQuantity/remove/${id}`,
        method: 'DELETE'
    })
}
