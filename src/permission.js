import router from './router'
import store from './store'
import {message as $message} from '@/utils/message'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken, removeToken, setToken} from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import {injectTenantMinix, removeTenantMinix} from "@/mixins/generator/TenantMinix";
import {windowOpen} from "echarts/lib/util/format";
import {workspacePath} from "@/utils/define";

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/jump'] // no redirect whitelist

// 获取地址栏参数
function getQueryParams() {
  const search = window.location.search.substring(1)
  const params = {}
  if (search) {
    search.split('&').forEach(item => {
      const [key, value] = item.split('=')
      params[decodeURIComponent(key)] = decodeURIComponent(value || '').trim()
    })
  }
  return params
}

// 单点登录
async function singleSignOn() {
  const urlParams = getQueryParams()
  if (urlParams && urlParams.token) {
    const themePresets = {
      themeClass: urlParams.systemThemeClass || '',
      head: urlParams.backColor || '',
      menuThemeClass: urlParams.menuThemeClass || '',
      appLogo: urlParams.appLogo || '',
      name: urlParams.name || '',
    }
    store.dispatch("settings/changeSetting", {
      key: "appThemePresets",
      value: themePresets
    })
    await synchronousSystemTheme(themePresets)
    store.commit('user/SET_TOKEN', urlParams.token)
    setToken(urlParams.token)
    // 清除地址栏中的 token 参数
    const url = new URL(window.location.href)
    url.searchParams.delete('token')
    url.searchParams.delete('systemThemeColor')
    url.searchParams.delete('backColor')
    url.searchParams.delete('menuThemeColor')
    window.history.replaceState(null, '', url.pathname + url.search)
  }
}

// 同步系统主题
function synchronousSystemTheme(themes) {
  const dispatchPromises = []
  const themeMappings = [
    {key: 'head', value: themes.head},
    {key: 'themeClass', value: themes.themeClass},
    {key: 'slideClass', value: themes.menuThemeClass}
  ]

  themeMappings.forEach(({key, value}) => {
    if (value !== undefined) {
      dispatchPromises.push(
        store.dispatch('settings/changeSetting', {key, value})
      )
    }
  })

  return Promise.all(dispatchPromises)
}

router.beforeEach(async (to, from, next) => {
  // 路由跳转前先查看地址栏是否携带token参数
  await singleSignOn()
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title, to.meta.zhTitle)
  if (to.query.clearToken && to.path === '/login') {
    removeToken()
    let query = {...to.query}
    delete query.clearToken
    next({
      path: '/login',
      query
    })
    NProgress.done()
  }

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    injectTenantMinix()
    if (store.getters.isLock && to.path !== '/lockScreen' && to.path !== '/login') {
      next({
        path: '/lockScreen'
      })
      NProgress.done()
    } else if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasMenu = store.getters.menuList && store.getters.menuList.length > 0
      if (hasMenu) {
        next()
      } else {
        try {
          let a = localStorage.getItem('qhxt')
          let type = ''
          if (a == 'false') type = 'weblogin'
          // get user info
          let res = await store.dispatch('user/getInfo', type)
          const accessRoutes = await store.dispatch('permission/generateRoutes', res)
          let resField = await store.dispatch('base/getDictionaryData', {sort: 'FieldNameSet'})  // 调用数据字典
          store.commit('base/SET_FIELD_NAME', resField)
          // dynamically add accessible routes
          await store.dispatch('base/refreshConfigData')
          await store.dispatch('base/getAttribute')
          if (store.getters.configData.system.web_cache_way) await store.dispatch('base/refreshTableColumnConfigData') // 刷新用户表格自定义配置
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({
            ...to,
            query: '',
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          if (error && typeof (error) == 'string') $message.error(error || 'Has Error')
          windowOpen(workspacePath,'_self')
          // next(`/login?redirect=${ to.path }`)
          NProgress.done()
        }
      }
    }
  } else {
    removeTenantMinix()
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permissionEle to access are redirected to the login page.
      // next(`/login?redirect=${ to.path }`)
      windowOpen(workspacePath,'_self')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
  $message.close()
})
