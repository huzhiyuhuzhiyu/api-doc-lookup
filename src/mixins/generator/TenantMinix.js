
export const tenant = {
  mosheng: ['mosheng'], // 示例：配置别名到实际租户标识
  yongshun: ['yongshun'], // 示例：配置别名到实际租户标识
}
const tenantSymbol = Symbol('tenant')

export default {
  beforeCreate(){
    this[tenantSymbol] = localStorage.getItem('sys')
  },
  data(){
    return {
      [tenantSymbol]: ''
    }
  },
  computed:{
    isMS(){
      return tenant['mosheng'].includes(this[tenantSymbol])
    },
    isYS(){
      return tenant['yongshun'].includes(this[tenantSymbol])
    },

  }
}
