<script>
import purReconManagement from '@/views/purchasingManagement/purReconciliationManagement/purReconManagement/index.vue'

export default {
  components: { purReconManagement },
  name: "index"
}
</script>

<template>
  <purReconManagement :query-object="{ sourceList: ['sale_order_finished_product'] }"/>
</template>
