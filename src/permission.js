import router from './router'
import store from './store'
import { message as $message } from '@/utils/message'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import {injectTenantMinix, removeTenantMinix} from "@/mixins/generator/TenantMinix";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/jump'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title, to.meta.zhTitle)

  if (to.query.clearToken && to.path === '/login') {
    removeToken()
    let query = { ...to.query }
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
          if(a == 'false') type = 'weblogin'
          // get user info
          let res = await store.dispatch('user/getInfo',type)
          const accessRoutes = await store.dispatch('permission/generateRoutes', res)
          let resField = await store.dispatch('base/getDictionaryData',{sort: 'FieldNameSet'})  // 调用数据字典
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
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          if (error && typeof (error) == 'string') $message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
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
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
  $message.close()
})
