import Vue from 'vue'

const jnpf = require('./utils/jnpf').default

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import './assets/scss/common.scss'
import "./assets/scss/date.scss";

import '@/styles/index.scss' // global css
import './assets/scss/theme.scss' // 主题
import './assets/scss/menu.scss' // 主题

import '@/styles/jx.scss' // Custom styles
import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './permission' // permission control
import './utils/error-log' // error log
import { message } from './utils/message';

import * as filters from './filters' // global filters

import * as echarts from 'echarts'





// 审批流引入
import func from './utils/preload.js'
import './utils/element.js'
Vue.prototype.$func = func;
Vue.directive('enterNumber', {
  bind: function (el, { value = 2 }) {
    el = el.nodeName == "INPUT" ? el : el.children[0]
    var RegStr = value == 0 ? `^[\\+\\-]?\\d+\\d{0,0}` : `^[\\+\\-]?\\d+\\.?\\d{0,${value}}`;
    el.addEventListener('keyup', function () {
      el.value = el.value.match(new RegExp(RegStr, 'g'));
      el.dispatchEvent(new Event('input'))
    })
  }
});
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    el.focus()
  }
});




// 自定义按钮权限指令
import permission from "@/directive/permission";
Vue.use(permission)

Vue.use(Element, {
  size: jnpf.storageGet('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 批量引入组件
import components from './components'
Vue.use(components)
// 添加实例属性
Object.assign(Vue.prototype, {
  define: require('./utils/define'), // 开发环境接口配置常量
  global: require('./utils/global').default, // 全局常量
  jnpf, // 公共方法
  formValidate: require('./utils/formValidate').default, // 表单验证
  $message: message
})



// 全局注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

const vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
export default vm
