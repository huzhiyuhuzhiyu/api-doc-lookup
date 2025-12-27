/**
 * @Author: Carrey 2954831281@qq.com
 * @Date: 2025-12-26 15:30:12
 * @LastEditors: Carrey 2954831281@qq.com
 * @LastEditTime: 2025-12-27 14:38:17
 * @FilePath: src/api/smartBoard.js
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import request from '@/utils/request'
const mockRequest = (data, ...args) => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('模拟请求参数', args, '回应数据', data)
    resolve({
      code: 200,
      data
    })
  }, 3000 * Math.random())
})

export function getScreenSafeData(data) {
  return mockRequest([], data)
  return request({
    url: '/api/screen/data/safe',
    method: 'POST',
    data: data
  })
}
