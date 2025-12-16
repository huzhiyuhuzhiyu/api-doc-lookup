<script>
import purchaseOrderDetails from '../purchaseOrderDetails/index.vue'

export default {
  components: { purchaseOrderDetails },
  name: "index"
}
</script>

<template>
  <purchaseOrderDetails :query-object="{ sourceList: ['factory','mrp','sale'] }"/>
</template>
