<script>
import purReconciliation from '../purReconciliation/index.vue'

export default {
  components: { purReconciliation },
  name: "index"
}
</script>

<template>
  <purReconciliation :query-object="{ sourceList: ['sale_order_finished_product'] }"/>
</template>
