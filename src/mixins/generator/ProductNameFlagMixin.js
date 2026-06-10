import {getPromise} from "@/utils";
import {getBimBusinessSwitchConfigList} from '@/api/basicData';

export default {
  data(){
    return {
      productNameFlag: null,
      productNameFlagPromise: false,
    }
  },
  onLoad() {
    this.getProductNameFlag()
  },
  methods: {
     getProductNameFlag(){
       if(this.productNameFlagPromise){
         return this.productNameFlagPromise
       }
       const {promise,resolve,reject} =getPromise()
       this.productNameFlagPromise =  promise
      let objs = { "pageSize": -1, "businessCode": "product" }
       getBimBusinessSwitchConfigList(objs).then(res=>{
         this.productNameFlag = res.data.product[1].configValue1 === '1'
         resolve(this.productNameFlag)
       })
    },
    awaitGetProductNameFlag(){
      return this.productNameFlagPromise
    }
  },
}
