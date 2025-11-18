<template>
  <div class="JNPF-common-layout">
    <keep-alive>
      <component
        :is="listPageComponent"
        :warehouse-code="warehouseCode"
        ref="depForm"
        @close="close"
      />
    </keep-alive>
  </div>
</template>

<script>
// 统一导入组件
import DbIncomAndOutInventory from '@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory'
import DirectInandOutWarehouse from '@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse'
import Inventory from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventory'
import InventoryList from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryList'
import InventoryDetaisList from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryDetaisList'
import TransferManagement from '@/views/warehouseManagement/finishedProductWarehouseManagement/transferManagement'
import ProductionWaitMaterial from '@/views/warehouseManagement/finishedProductWarehouseManagement/productionWaitMaterial'
import DirectMaterialRequisition from '@/views/warehouseManagement/finishedProductWarehouseManagement/directMaterialRequisition'
import AwaitInspectionInventory from '@/views/warehouseManagement/finishedProductWarehouseManagement/awaitInspectionInventory'
import PendingTransition from '@/views/warehouseManagement/finishedProductWarehouseManagement/modalShift/pendingTransition'
import InventoryAssembly from '@/views/warehouseManagement/finishedProductWarehouseManagement/InventoryAssembly'
import LnventoryDisassembly from '@/views/warehouseManagement/finishedProductWarehouseManagement/lnventoryDisassembly'

// 组件映射配置
const COMPONENT_MAP = {
  dbIncomAndOutInventory: DbIncomAndOutInventory,
  directInandOutWarehouse: DirectInandOutWarehouse,
  inventory: Inventory,
  inventoryDetaisList: InventoryDetaisList,
  inventoryList: InventoryList,
  transferManagement: TransferManagement,
  productionWaitMaterial: ProductionWaitMaterial,
  directMaterialRequisition: DirectMaterialRequisition,
  awaitInspectionInventory: AwaitInspectionInventory,
  pendingTransition: PendingTransition,
  InventoryAssembly: InventoryAssembly,
  lnventoryDisassembly: LnventoryDisassembly
}

export default {
  name: 'DynamicWarehouseComponent',
  components: COMPONENT_MAP,
  data() {
    return {
      businessType: '',
      listPageComponent: null,
      warehouseCode: '',
      form: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          { asc: false, column: '' },
          { asc: false, column: 'code' }
        ]
      }
    }
  },
  beforeCreate() {
    this.$options.name = this.$route.name
  },
  created() {
    this.initializeComponent()
  },
  methods: {
    initializeComponent() {
      const { path, meta, fullPath } = this.$route

      this.name = meta.zhTitle
      this.code = meta.title
      this.warehouseCode = fullPath.split('?')[1] || ''

      const pathSegments = path.split('/').filter(segment => segment)
      this.businessType = pathSegments[pathSegments.length - 1]

      this.listPageComponent = COMPONENT_MAP[this.businessType] || null

      if (!this.listPageComponent) {
        console.warn(`未找到对应的组件: ${ this.businessType }`)
      }
    },

    close() {
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped/>
