<template>
  <div class="JNPF-common-layout">
    <component :is="listPageComponent" :classAttribute="classAttribute" v-if="depFormVisible" ref="depForm" @close="close" />
  </div>
</template>

<script>
import dbIncomAndOutInventory from "@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory"
import directInandOutWarehouse from "@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse"
import inventory from "@/views/warehouseManagement/finishedProductWarehouseManagement/inventory"
import inventoryList from "@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryList"
import inventoryDetaisList from "@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryDetaisList"
import transferManagement from "@/views/warehouseManagement/finishedProductWarehouseManagement/transferManagement" 
import directMaterialRequisition from "@/views/warehouseManagement/finishedProductWarehouseManagement/directMaterialRequisition" 
export default {
  name: 'quality',
  components:{dbIncomAndOutInventory,directInandOutWarehouse,inventory,inventoryDetaisList,inventoryList,transferManagement,directMaterialRequisition},
  data() {
    return {
      businessType:"",
      listPageComponent:null,
      classAttribute:"",
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
    let path=this.$route.path
    let pathInfo=this.$route
    this.classAttribute=pathInfo.fullPath.split("?")[1]
    let arr=path.split('/')
    this.businessType=arr[arr.length-1] 
    if(this.businessType=='dbIncomAndOutInventory'){
      this.listPageComponent=dbIncomAndOutInventory
    }
    if(this.businessType=='directInandOutWarehouse'){
      this.listPageComponent=directInandOutWarehouse
    }
    if(this.businessType=='inventory'){
      this.listPageComponent=inventory
    }
    if(this.businessType=='inventoryDetaisList'){
      this.listPageComponent=inventoryDetaisList
    }
    if(this.businessType=='inventoryList'){
      this.listPageComponent=inventoryList
    }
    if(this.businessType=='transferManagement'){
      this.listPageComponent=transferManagement
    }
    if(this.businessType=='directMaterialRequisition'){
      this.listPageComponent=directMaterialRequisition
    }
    // if()

  },
  methods: {
   close(){

   },
   
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />