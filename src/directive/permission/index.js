import permission from './permission'
import roleDirective from './roleDirective';
// import tenant from './tenant';

const install = function(Vue) {
  Vue.directive('has', permission)
  Vue.directive('role', roleDirective)
  Vue.directive('tenant', tenant)
}

if (window.Vue) {
  window['has'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission