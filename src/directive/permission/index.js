import permission from './permission'
import roleDirective from './roleDirective';

const install = function(Vue) {
  Vue.directive('has', permission)
  Vue.directive('role', roleDirective)
}

if (window.Vue) {
  window['has'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission