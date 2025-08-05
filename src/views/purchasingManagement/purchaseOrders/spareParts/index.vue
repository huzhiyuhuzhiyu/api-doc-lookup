<script>
import purchaseOrder from '../purchaseOrder/index.vue'

export default {
  components: {purchaseOrder},
  name: "index"
}
</script>

<template>
  <purchaseOrder source="sale_order_material"/>
</template>
