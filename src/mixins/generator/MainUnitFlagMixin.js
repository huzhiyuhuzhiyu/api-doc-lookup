import jnpf from "@/utils/jnpf";
import {getPromise} from "@/utils";

export default {
  data(){
    return {
      mainUnitFlag: false,
      mainUnitFlagPromise: false,

    }
  },
    created() {
    this.getMainUnitFun()
  },
  methods: {
   getMainUnitFun(code='deputyUnit', type='warehouseDeputyUnit') {
      const {promise,resolve,reject} =getPromise()
        this.mainUnitFlagPromise = promise
          jnpf.getMainUnitFun(code, type) .then(res=>{
              this.mainUnitFlag =  res === "1"
              console.log("主副单位开关：",this.mainUnitFlag, res)
            resolve(this.mainUnitFlag)
          });

    },
    awaitMainUnitFlag(){
      return this.mainUnitFlagPromise
    }
  },
}
