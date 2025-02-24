import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    console.log(store.getters,'store.getters')
    console.log(store.getters.userInfo,'store.getters.userInfo')
    const { roleCode } = store.getters && store.getters.userInfo
    console.log(roleCode,'额')
    const arr = roleCode.split(',')
    const hasRole = arr.includes(value)
    if (!hasRole) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
}