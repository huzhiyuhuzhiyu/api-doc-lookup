import request from '@/utils/request'

// 用户登录
export function login(data) {
  let x =  request({
    url: '/api/oauth/Login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
  return x
}

// 获取当前用户信息
export function getInfo(type) {
  return request({
    url: `/api/oauth/CurrentUser?type=${type}`,
    method: 'get',
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/api/oauth/Logout',
    method: 'get'
  })
}

// 锁屏解锁登录
export function unlock(data) {
  return request({
    url: '/api/oauth/LockScreen',
    method: 'post',
    data
  })
}

// 获取默认配置
export function getConfig(account) {
  return request({
    url: `/api/oauth/getConfig/${account}`,
    method: 'get'
  })
}
// 获取登录信息
export function getpattern() {
  return request({
    url: `/api/system/SysConfig/get/pattern`,
    method: 'get',
  })
}