<script>
import purchasingDemandPool from '../index.vue'

export default {
  components: { purchasingDemandPool },
  name: "index"
}
</script>

<template>
  <purchasingDemandPool :query-object="{ sourceList: ['factory','mrp','sale'] }"></purchasingDemandPool>
</template>
