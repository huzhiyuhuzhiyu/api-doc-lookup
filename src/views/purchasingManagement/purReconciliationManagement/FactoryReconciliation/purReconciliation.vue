<script>
import purReconciliation from '../purReconciliation/index.vue'

export default {
  components: { purReconciliation },
  name: "index"
}
</script>

<template>
  <purReconciliation :query-object="{ sourceList: ['factory','mrp','sale'] }"/>
</template>
