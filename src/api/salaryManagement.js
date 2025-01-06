import request from '@/utils/request'
// 工资管理列表数据
export function getSalaryList(data) {
    return request({
        url: '/api/mrp/work/report/wages/list',
        method: 'post',
        data: data
    })
}
// 重新计算异常工资

export function editSalaryList(data) {
    return request({
        url: '/api/mrp/work/report/wages/reload',
        method: 'put',
        data: data
    })
}
// 重新计算异常工资

export function updateSalaryList(data) {
    return request({
        url: '/api/mrp/work/report/price/update',
        method: 'put',
        data: data
    })
}

// 工资明细

export function getSalaryDetailList(data) {
    return request({
        url: '/api/mrp/work/report/report',
        method: 'post',
        data: data
    })
}
// 修改单价

export function editPrice(data) {
    return request({
        url: '/api/mrp/work/report/price/update?id='+data.id+"&price="+data.price,
        method: 'put',
    })
}
