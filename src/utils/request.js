import axios from 'axios'
import { message } from '@/utils/message'
import store from '@/store'
import { getAccessToken, getToken } from '@/utils/auth'
import define, {workspacePath} from '@/utils/define'
import context from '@/main'
import {windowOpen} from "echarts/lib/util/format";

import { formatListQuery } from '@/utils'

class CancelControl {
  constructor () {
    this.allCancelApi = {}
  }
  setAbortAPI(calcelAPI){
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    this.allCancelApi[calcelAPI] = source
    return source.token
  }
  abort(calcelAPI){
    if (this.allCancelApi[calcelAPI]){
      this.allCancelApi[calcelAPI].cancel('Cancel')
    }
  }
}
export const cancelControl = new CancelControl()
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: define.timeout, // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // 解析带有查询功能的列表筛选条件
    if (config.data?.superQuery?.tableQueryFlag) {
      // console.log('接收到列表查询请求：', config.data)
      config.data = formatListQuery(config.data)
    }
    if (config.url.indexOf('http') > -1) config.baseURL = ''
    // 部分接口timeout时间单独处理
    if (config.url.indexOf('SynThirdInfo') > -1 || config.url.indexOf('extend/Email/Receive') > -1 ||
      config.url.indexOf('Permission/Authority/Data') > -1 || config.url.indexOf('DataSync/Actions/Execute') > -1) {
      config.timeout = 100000
    }
    // do something before request is sent
    config.headers['jnpf-origin'] = 'pc'
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (store.getters.accessToken) {
      config.headers['Pt-Authorization'] = getAccessToken()
    }
    if (config.method == 'get') {
      config.params = config.data
    }
    let timestamp = Date.parse(new Date()) / 1000
    if (config.url.indexOf('?') > -1) {
      config.url += `&n=${timestamp}`
    } else {
      config.url += `?n=${timestamp}`
    }
    if (config.multipleCancel){
      cancelControl.abort(config.url)
      config.cancelToken = cancelControl.setAbortAPI(config.url)
    }
    return config
  },
  error => {
    // do something with request error
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    let config = response.config
    let url = config.url
    // 特殊接口处理
    if (url.indexOf('/Base/DataSource/Actions/Test') > -1 || (url.indexOf('OnlineDev') > -1 && url.indexOf('Config') > -1)) return res
    if (res.code !== 200) {
      message({
        message: res.msg || '请求出错，请重试',
        type: 'error',
        duration: 1500,
        onClose: () => {
          if (url.indexOf('/api/oauth/Login') < 0 && url.indexOf('/api/oauth/LockScreen') < 0 && (res.code === 600 || res.code === 601 || res.code === 602)) {
            // 600：登录过期,请重新登录  601: 您的帐号在其他地方已登录,被强制踢出 602: Token验证失败
            store.dispatch('user/resetToken').then(() => {
              if (window.location.pathname.indexOf('login') > -1) return
              // setTimeout(() => { location.reload() }, 100);
              // context.$router.push(`/login`)
              windowOpen(workspacePath,'_self')
            })
          }
        }
      })
      if (url.indexOf('/api/oauth/Login') > -1) return Promise.reject(res)
      return Promise.reject(new Error(res.msg|| 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error);
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    if (axios.isCancel(error)) {
      console.error('请求取消:', error.message);
    }else{
      // webIntercept主动拦截
      const msg = error.message.indexOf('webIntercept:') > -1 ? error.message.replace('webIntercept:', '') : '请求出错，请重试'
      message({
        message: msg,
        type: 'error',
        duration: 1500
      })
    }

    return Promise.reject(error)
  }
)

export default service
