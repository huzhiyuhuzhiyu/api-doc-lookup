/**
 * @Author: Carrey 2954831281@qq.com
 * @Date: 2025-12-26 15:30:12
 * @LastEditors: Carrey 2954831281@qq.com
 * @LastEditTime: 2025-12-29 15:00:45
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
  // return mockRequest({
  //   "safeCount": "0",
  //   "minorInjuryCount": "0",
  //   "majorInjuryCount": "0",
  //   "safeCalenderList": [
  //     {
  //       day: '2025-11-02',
  //       accidentGrade: 'minor_injury'
  //     },
  //     {
  //       day: '2025-11-10',
  //       accidentGrade: 'major_accident'
  //     }
  //   ]
  // }, data)
  return request({
    url: '/api/screen/data/safe',
    method: 'POST',
    data: data
  })
}

export function getMockScreenSafeData(data) {
  return mockRequest({}, data)
  return request({
    url: '/api/screen/data/safe',
    method: 'POST',
    data: data
  })
}

export function getScreenTrackingData(data) {
  return request({
    url: '/api/screen/data/tracking',
    method: 'POST',
    data: data
  })
}

export function getScreenKnowledgeCaseCount(data) {
  return request({
    url: '/api/screen/data/knowledge/case/count',
    method: 'POST',
    data: data
  })
}
