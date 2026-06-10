<script>
import purchaseOrder from '../purchaseOrder/index.vue'

export default {
  components: { purchaseOrder },
  name: "index"
}
</script>

<template>
  <purchaseOrder :query-object="{ sourceList: ['factory','mrp','sale'] }"/>
</template>
