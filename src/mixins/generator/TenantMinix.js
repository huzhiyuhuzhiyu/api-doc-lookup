import {deepClone} from "@/utils";
import Vue from "vue";

export const tenantIdKey = 'sys'

export const tenant = {
  mosheng: ['mosheng'], // 示例：配置别名到实际租户标识
  yongshun: ['yongshun'], // 示例：配置别名到实际租户标识
  fhxygq: ['fhxygq'], // 项源钢球
  fhjrgq: ['fhjrgq'], // 精瑞钢球
  fhjrxygq: ['fhjrgq','fhxygq'], // 精瑞钢球
  zgt_xbn: ['zgt_xbn','zgt_bn','beining','xbeining'], // 倍宁
  zgt_zy: ['zhongya','xzhongya', 'zgt_zy', 'zgt_xzy'], // 中亚
  boos: ['boos'], // 博时
  xinglun: ['xinglun'], // 兴轮
}
const tenantSymbol = Symbol('tenant')

const minix = {
  beforeCreate(){
    this[tenantSymbol] = localStorage.getItem(tenantIdKey)
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
    isJROrXY(){
      return tenant['fhjrxygq'].includes(this[tenantSymbol])
    },
  }
}

export function getTenantMinix() {
    const cloneMinix = deepClone(minix)
    const newVue = new Vue(cloneMinix)
    return Object.keys(cloneMinix.computed).reduce((acc, key) => {
        acc[key] = newVue[key]
        return acc
    }, {})
}

const injectSymbol = Symbol('injectSymbol')

export function injectTenantMinix() {
    if (injectSymbol in Vue.prototype) {
        return
    }
    Vue.prototype[injectSymbol] = true
    const tenants = getTenantMinix()
    Object.keys(tenants).forEach(key => {
        Vue.prototype[key] = tenants[key]
    })
}

export function removeTenantMinix() {
    delete Vue.prototype[injectSymbol]
}

export default minix
