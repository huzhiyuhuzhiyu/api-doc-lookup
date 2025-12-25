<script>
import purReconciliation from '@/views/purchasingManagement/purReconciliationManagement/purReconciliation/index.vue'

export default {
  components: { purReconciliation },
  name: "index"
}
</script>

<template>
  <purReconciliation :query-object="{ sourceList: ['procure'], reconciliationType: 'payable_logistics' }"/>
</template>
