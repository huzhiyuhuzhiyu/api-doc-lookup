<script>
import receivingAdvice from '@/views/receivingManagement/purchaseAndReceiveFinishedProducts/receivingAdvice/index.vue'

export default {
  components: { receivingAdvice },
  name: "index"
}
</script>

<template>
  <receivingAdvice :query-object="{ sourceList: ['factory','mrp','sale'] }"/>
</template>
