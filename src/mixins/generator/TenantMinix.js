
export const tenant = {
  mosheng: ['mosheng'], // 示例：配置别名到实际租户标识
  yongshun: ['yongshun'], // 示例：配置别名到实际租户标识
  fhxygq: ['fhxygq'], // 项源钢球
  fhjrgq: ['fhjrgq'], // 精瑞钢球
  zgt_xbn: ['zgt_xbn','zgt_bn','beining','xbeining'], // 倍宁
  zgt_zy: ['zhongya','xzhongya', 'zgt_zy', 'zgt_xzy'], // 中亚
  boos: ['boos'], // 博时
  xinglun: ['xinglun'], // 兴轮
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
      return tenant['zgt_xbn'].includes(this[tenantSymbol])
    },
    isZY(){
      return tenant['zgt_zy'].includes(this[tenantSymbol])
    },
     isBOOS(){
      return tenant['boos'].includes(this[tenantSymbol])
    },
     isXL(){
      return tenant['xinglun'].includes(this[tenantSymbol])
    },
  }
}
