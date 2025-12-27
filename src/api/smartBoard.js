/**
 * @Author: Carrey 2954831281@qq.com
 * @Date: 2025-12-26 15:30:12
 * @LastEditors: Carrey 2954831281@qq.com
 * @LastEditTime: 2025-12-27 13:48:07
 * @FilePath: src/api/smartBoard.js
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import request from '@/utils/request'
const mockRequest = (data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      code: 200,
      data
    })
  }, 3000 * Math.random())
})

export function getScreenSafeData(data) {
  return mockRequest([])
  return request({
    url: '/api/screen/data/safe',
    method: 'POST',
    data: data
  })
}
