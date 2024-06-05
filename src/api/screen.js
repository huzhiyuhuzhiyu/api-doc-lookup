import request from '@/utils/request'
//大屏API

export function getEquipmentAllStateNumber(data) {
    return request({
        url: '/api/screen/getEquipmentAllStateNumber',
        method: 'get',
        data: data
    })
}

