<template>
  <div class="JNPF-common-layout">
   
   

    <component :is="listPageComponent" v-if="depFormVisible" ref="depForm" @close="close" />
  </div>
</template>

<script>
import finish from "@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory"
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delClassAttribute,
  addBimProductAttributes,
  getclassAttributeList,
  disabledClassAttributeState
} from '@/api/masterDataManagement/index'
export default {
  name: 'quality',
  components:{finish},
  data() {
    return {
      
      listPageComponent:finish,
      depFormVisible:true,
      form: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,

        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      },
    }
  },
  watch: {
  },
  created() {
    console.log("this",this.$route);
    this.getclassAttributeListFun()
    let path=this.$route.path
    console.log(path); 
    if(path.indexOf('semi_finished')>-1){
      console.log(1);
    }else{
      console.log(2);
    }

  },
  methods: {
   close(){

   },
   getclassAttributeListFun(){
      getclassAttributeList(this.form).then(res=>{
        console.log(res);
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />