<script>
import purReconManagementDetail from '../purReconManagementDetail/index.vue'

export default {
  components: { purReconManagementDetail },
  name: "detail"
}
</script>

<template>
  <purReconManagementDetail :query-object="{ sourceList: ['factory','mrp','sale'] }"/>
</template>
