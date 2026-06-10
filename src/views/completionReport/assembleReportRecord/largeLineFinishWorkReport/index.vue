<script>
// 成品大线
import WorkReport from "../index.vue"

export default {
  components: { WorkReport },
  name: "index"
}
</script>

<template>
  <WorkReport :query-params="{ productionLineName: '大线' }"/>
</template>
