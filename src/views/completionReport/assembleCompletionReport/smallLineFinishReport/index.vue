<script>
// 成品小线
import CompletionReport from "../index.vue"

export default {
  components: { CompletionReport },
  name: "index"
}
</script>

<template>
  <CompletionReport :query-params="{ productionLineName: '小线' }"/>
</template>
