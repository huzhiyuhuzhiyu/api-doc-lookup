<script>
import purchaseOrderDetails from '../purchaseOrderDetails/index.vue'

export default {
  components: {purchaseOrderDetails},
  name: "index"
}
</script>

<template>
  <purchaseOrderDetails source="sale_order_finished_product"/>
</template>
