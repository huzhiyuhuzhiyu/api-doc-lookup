<script>
import receivingOrderDetails from '@/views/receivingManagement/purchaseAndReceiveFinishedProducts/receivingOrderDetails/index.vue'

export default {
  components: { receivingOrderDetails },
  name: "index"
}
</script>

<template>
  <receivingOrderDetails :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }"/>
</template>
