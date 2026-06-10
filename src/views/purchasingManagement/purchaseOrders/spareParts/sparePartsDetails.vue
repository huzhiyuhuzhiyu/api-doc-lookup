<script>
import purchaseOrderDetails from '../purchaseOrderDetails/index.vue'

export default {
  components: { purchaseOrderDetails },
  name: "index"
}
</script>

<template>
  <purchaseOrderDetails :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }"/>
</template>
