<script>
// 半成品大线
import CompletionReport from "../index.vue"

export default {
  components: { CompletionReport },
  name: "index"
}
</script>

<template>
  <CompletionReport :query-params="{ productionLineName: '大线' }"/>
</template>
