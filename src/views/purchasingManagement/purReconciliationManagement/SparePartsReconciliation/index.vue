<script>
import purReconManagement from '../purReconManagement/index.vue'

export default {
  components: { purReconManagement },
  name: "index"
}
</script>

<template>
  <purReconManagement :query-object="{ sourceList: ['sale_order_material','sale_order_finished_material'] }"/>
</template>
