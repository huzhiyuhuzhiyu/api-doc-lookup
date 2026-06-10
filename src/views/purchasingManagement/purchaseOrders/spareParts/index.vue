<script>
import purchaseOrder from '../purchaseOrder/index.vue'

export default {
  components: { purchaseOrder },
  name: "index"
}
</script>

<template>
  <purchaseOrder :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }"/>
</template>
