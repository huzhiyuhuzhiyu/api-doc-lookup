<script>
import purReconManagementDetail from '@/views/purchasingManagement/purReconciliationManagement/purReconManagementDetail/index.vue'

export default {
  components: { purReconManagementDetail },
  name: "detail"
}
</script>

<template>
  <purReconManagementDetail :query-object="{ sourceList: ['sale_order_finished_product'], reconciliationType: 'payable_logistics' }"/>
</template>
