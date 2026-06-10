<script>
import receivingOrderDetails from '@/views/receivingManagement/purchaseAndReceiveFinishedProducts/receivingOrderDetails/index.vue'

export default {
  components: {receivingOrderDetails},
  name: "index"
}
</script>

<template>
  <receivingOrderDetails :query-object="{ sourceList: ['procure'] }"/>
</template>
