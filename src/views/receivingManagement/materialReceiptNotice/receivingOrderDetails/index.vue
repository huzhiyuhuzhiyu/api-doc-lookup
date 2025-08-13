<script>
import receivingOrderDetails from '@/views/receivingManagement/purchaseAndReceiveFinishedProducts/receivingOrderDetails/index.vue'

export default {
  components: {receivingOrderDetails},
  name: "index"
}
</script>

<template>
  <receivingOrderDetails source="sale_order_material"/>
</template>
