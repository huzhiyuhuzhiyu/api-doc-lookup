<script>
import pendingOrders from '@/views/receivingManagement/purchaseAndReceiveFinishedProducts/pendingOrders/index.vue'

export default {
  components: { pendingOrders },
  name: "index"
}
</script>

<template>
  <pendingOrders :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }" class-attribute=""/>
</template>
