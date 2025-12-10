<script>
import purReconManagementDetail from '../purReconManagementDetail/index.vue'

export default {
  components: { purReconManagementDetail },
  name: "detail"
}
</script>

<template>
  <purReconManagementDetail :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }"/>
</template>
