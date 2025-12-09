<script>
import purchaseOrderDetails from '../purchaseOrderDetails/index.vue'

export default {
  components: { purchaseOrderDetails },
  name: "index"
}
</script>

<template>
  <purchaseOrderDetails :query-object="{ sourceList: ['procure'] }"/>
</template>
