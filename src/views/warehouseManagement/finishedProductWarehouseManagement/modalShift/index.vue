<script>
import pendingTransition from './pendingTransition'
import pendingTransitionList from './pendingTransitionList'
import pendingTransitionDetail from './pendingTransitionDetail'

const SUB_COMPONENT_MAP = {
  pendingTransition: pendingTransition,
  pendingTransitionList: pendingTransitionList,
  pendingTransitionDetail: pendingTransitionDetail,
}

export default {
  name: 'ModalShift',
  components: SUB_COMPONENT_MAP,
  props: {
    warehouseCode: {
      type: String,
      default: 'finish_product'
    }
  },
  data() {
    return {
      currentComponent: null,
      componentProps: {}
    }
  },
  computed: {
    actualWarehouseCode() {
      return this.warehouseCode
    }
  },
  watch: {
    '$route': {
      handler: 'initializeComponent',
      immediate: true,
      deep: true
    }
  },
  methods: {
    initializeComponent() {
      const { name: routeName } = this.$route

      this.currentComponent = SUB_COMPONENT_MAP[routeName] || null

      if (!this.currentComponent) {
        console.warn(`ModalShift: 未找到对应的子组件: ${ routeName }`)
        console.warn(`可用的子组件: ${ Object.keys(SUB_COMPONENT_MAP).join(', ') }`)
      } else {
        console.log(`ModalShift: 加载子组件 ${ routeName } 成功`)
      }
    },

  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <keep-alive>
      <component
        :is="currentComponent"
        :warehouse-code="actualWarehouseCode"
        v-bind="componentProps"
      />
    </keep-alive>
  </div>
</template>
