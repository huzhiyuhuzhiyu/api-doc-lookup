import { tenant as TenantObj } from '@/directive/permission/tenant'

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
      return TenantObj['mosheng'].includes(this[tenantSymbol])
    },
    isZP(){
      return TenantObj['zp'].includes(this[tenantSymbol])
    },
    isGD(){
      return TenantObj['gede'].includes(this[tenantSymbol])
    },
    notGD(){
      return !this.isGD
    },
    notZP(){
      return !this.isZP
    },
    notQH(){
      return !this.isQH
    }
  }
}
