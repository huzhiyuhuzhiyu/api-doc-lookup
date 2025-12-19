<script>
import purReconManagement from '../purReconManagement/index.vue'

export default {
  components: { purReconManagement },
  name: "index"
}
</script>

<template>
  <purReconManagement :query-object="{ sourceList: ['factory','mrp','sale'] }"/>
</template>
