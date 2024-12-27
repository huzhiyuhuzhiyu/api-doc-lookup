<template>
  <div class="JNPF-common-layout">
    <component :is="listPageComponent" :warehouseCode="warehouseCode" v-if="depFormVisible" ref="depForm" @close="close" />
  </div>
</template>

<script>
import dbIncomAndOutInventory from "@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory"
import directInandOutWarehouse from "@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse"
import inventory from "@/views/warehouseManagement/finishedProductWarehouseManagement/inventory"
import inventoryList from "@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryList"
import inventoryDetaisList from "@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryDetaisList"
import transferManagement from "@/views/warehouseManagement/finishedProductWarehouseManagement/transferManagement" 
import productionWaitMaterial from "@/views/warehouseManagement/finishedProductWarehouseManagement/productionWaitMaterial" 
import directMaterialRequisition from "@/views/warehouseManagement/finishedProductWarehouseManagement/directMaterialRequisition" 
import awaitInspectionInventory from'@/views/warehouseManagement/finishedProductWarehouseManagement/awaitInspectionInventory'
import modalShift from'@/views/warehouseManagement/finishedProductWarehouseManagement/modalShift'
import InventoryAssembly from'@/views/warehouseManagement/finishedProductWarehouseManagement/InventoryAssembly'
import lnventoryDisassembly from'@/views/warehouseManagement/finishedProductWarehouseManagement/lnventoryDisassembly'
export default {
  name: 'quality',
  components:{dbIncomAndOutInventory,directInandOutWarehouse,inventory,inventoryDetaisList,inventoryList,transferManagement,productionWaitMaterial,directMaterialRequisition,awaitInspectionInventory,modalShift,InventoryAssembly,lnventoryDisassembly},
  data() {
    return {
      businessType:"",
      listPageComponent:null,
      warehouseCode:"",
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
    this.warehouseCode=pathInfo.fullPath.split("?")[1]
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
    if(this.businessType=='productionWaitMaterial'){
      this.listPageComponent=productionWaitMaterial
    }
    if(this.businessType=='directMaterialRequisition'){
      this.listPageComponent=directMaterialRequisition
    }
    if(this.businessType=='awaitInspectionInventory'){
      this.listPageComponent=awaitInspectionInventory
    }
    if(this.businessType=='modalShift'){
      this.listPageComponent=modalShift
    }
    if(this.businessType=='InventoryAssembly'){
      this.listPageComponent=InventoryAssembly
    }
    if(this.businessType=='lnventoryDisassembly'){
      this.listPageComponent=lnventoryDisassembly
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