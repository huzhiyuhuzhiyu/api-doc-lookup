<script>
import DbIncomAndOutInventory from '@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory'
import DirectInandOutWarehouse from '@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse'
import Inventory from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventory'
import InventoryList from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryList'
import InventoryDetaisList from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventoryDetaisList'
import TransferManagement from '@/views/warehouseManagement/finishedProductWarehouseManagement/transferManagement'
import ProductionWaitMaterial from '@/views/warehouseManagement/finishedProductWarehouseManagement/productionWaitMaterial'
import DirectMaterialRequisition from '@/views/warehouseManagement/finishedProductWarehouseManagement/directMaterialRequisition'
import AwaitInspectionInventory from '@/views/warehouseManagement/finishedProductWarehouseManagement/awaitInspectionInventory'
import ModalShift from '@/views/warehouseManagement/finishedProductWarehouseManagement/modalShift'
import InventoryAssembly from '@/views/warehouseManagement/finishedProductWarehouseManagement/InventoryAssembly'
import LnventoryDisassembly from '@/views/warehouseManagement/finishedProductWarehouseManagement/lnventoryDisassembly'

const BASE_COMPONENT_MAP = {
  dbIncomAndOutInventory: DbIncomAndOutInventory,
  directInandOutWarehouse: DirectInandOutWarehouse,
  inventory: Inventory,
  inventoryDetaisList: InventoryDetaisList,
  inventoryList: InventoryList,
  transferManagement: TransferManagement,
  productionWaitMaterial: ProductionWaitMaterial,
  directMaterialRequisition: DirectMaterialRequisition,
  awaitInspectionInventory: AwaitInspectionInventory,
  modalShift: ModalShift,
  InventoryAssembly: InventoryAssembly,
  lnventoryDisassembly: LnventoryDisassembly
}

// 特殊路由映射配置 - 支持一对多映射
const SPECIAL_ROUTE_MAPPING = {
  // 形态转换相关路由组
  modalShiftGroup: {
    routes: ['pendingTransition', 'pendingTransitionList', 'pendingTransitionDetail'],
    component: 'modalShift'
  },
  // exampleGroup: {
  //   routes: ['route1', 'route2', 'route3'],
  //   component: 'targetComponent'
  // }
}

const buildRouteMap = () => {
  const routeMap = {}
  Object.values(SPECIAL_ROUTE_MAPPING).forEach(group => {
    group.routes.forEach(route => {
      routeMap[route] = group.component
    })
  })
  return routeMap
}

const SPECIAL_ROUTE_MAP = buildRouteMap()

export default {
  name: 'DynamicWarehouseComponent',
  components: BASE_COMPONENT_MAP,
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
    getComponentKey(routeName, businessType) {
      if (SPECIAL_ROUTE_MAP[routeName]) {
        return SPECIAL_ROUTE_MAP[routeName]
      }

      return businessType
    },

    initializeComponent() {
      const { path, meta, fullPath, name: routeName } = this.$route
      this.name = meta.zhTitle
      this.code = meta.title
      this.warehouseCode = fullPath.split('?')[1] || ''

      const pathSegments = path.split('/').filter(segment => segment)
      this.businessType = pathSegments[pathSegments.length - 1]

      const componentKey = this.getComponentKey(routeName, this.businessType)

      this.listPageComponent = BASE_COMPONENT_MAP[componentKey] || null

      if (!this.listPageComponent) {
        console.warn(`未找到对应的组件: ${ componentKey } (路由: ${ routeName }, 业务类型: ${ this.businessType })`)
      } else {
        console.log(`路由映射: ${ routeName } -> ${ componentKey }`)
      }
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <keep-alive>
      <component
        :is="listPageComponent"
        :warehouse-code="warehouseCode"
      />
    </keep-alive>
  </div>
</template>
