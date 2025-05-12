
export const tenant = {
  mosheng: ['mosheng'], // 示例：配置别名到实际租户标识
  yongshun: ['yongshun'], // 示例：配置别名到实际租户标识
  fhxygq: ['fhxygq'], // 项源钢球
  fhjrgq: ['fhjrgq'], // 精瑞钢球
  zgt_xbn: ['zgt_xbn','xbeining'], // 精瑞钢球
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

    isXY(){
      return tenant['fhxygq'].includes(this[tenantSymbol])
    },
    isJR(){
      return tenant['fhjrgq'].includes(this[tenantSymbol])
    },
    isXBN(){
      return tenant['zgt_xbn','xbeining'].includes(this[tenantSymbol])
    },
  }
}
