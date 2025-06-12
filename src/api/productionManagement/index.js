import request from '@/utils/request'
// 生产计划列表
export function getProductionPlanList(data) {
  return request({
    url: `/api/zgt/prod/plan/list`,
    method: 'post',
    data
  })
}
// 生产计划导入
export function planImport(data) {
  return request({
      url: `/api/zgt/prod/plan/upload`,
      method: 'POST',
      data
  })
}

/**
 * 获取完工记录列表  type	类型 0待包装 1已包装
 * @param data
 * @returns {AxiosPromise}
 */
export function getWorkFinishList(data){
    return request({
        url: `/api/zgt/proWorkFinish/package/page`,
        method: 'post',
        data
    })
}

/**
 * 包装报工
 * @param data
 * @returns {*}
 */
export function reportPackageWork(data){
    return request({
        url:'/api/mrp/work/report/package/add',
        method:'post',
        data
    })
}

// 关闭计划

export function closeProducePlan(data){
    return request({
        url:'/api/zgt/prod/plan/close',
        method:'post',
        data
    })
}




