<script>
import receivingAdvice from '@/views/receivingManagement/purchaseAndReceiveFinishedProducts/receivingAdvice/index.vue'

export default {
  components: { receivingAdvice },
  name: "index"
}
</script>

<template>
  <receivingAdvice :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }"/>
</template>
