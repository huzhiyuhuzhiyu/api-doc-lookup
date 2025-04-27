// 租户映射表（可根据需要扩展）未完成
export const tenant = {
  mosheng: ['mosheng'], // 示例：配置别名到实际租户标识
  zp: ['wxflying'],
  gede: ['glitter','xglitter'],
}
const vNodeMap = new WeakMap()
/**
 * 使用方法 v-tenant.tenantName
 * @description 用于显示特定租户需显示的字段
 */
export default {
  bind(el, binding, vnode) {
    const { modifiers } = binding
    const currentTenant = localStorage.getItem('sys') || ''
    const modifiersKey = Object.keys(modifiers)
    const tenantArr = modifiersKey
      .map(key => tenant[key])
      .filter(Boolean)
      .flat(Infinity)
    const isHide = (modifiersKey.length === 0 || !tenantArr.includes(currentTenant))
    vNodeMap.set(vnode, isHide)
    if (!isHide) {
      return
    }
    vnode.isComment = true
    vnode.isStatic = true

  },
  inserted(el, binding, vnode) {
    const isHide = vNodeMap.get(vnode)
    vNodeMap.delete(vnode)
    if (!isHide) {
      return
    }
    el.parentNode?.removeChild(el)
  }
}
