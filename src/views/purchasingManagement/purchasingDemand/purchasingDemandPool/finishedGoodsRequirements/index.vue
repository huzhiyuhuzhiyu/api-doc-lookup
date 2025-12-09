<script>
import purchasingDemandPool from '../index.vue'

export default {
  components: { purchasingDemandPool },
  name: "index"
}
</script>

<template>
  <purchasingDemandPool :query-object="{ sourceList: ['sale_order_finished_product'] }"></purchasingDemandPool>
</template>
