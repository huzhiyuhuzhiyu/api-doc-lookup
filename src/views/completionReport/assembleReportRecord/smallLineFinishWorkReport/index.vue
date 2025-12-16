<script>
// 成品小线
import WorkReport from "../index.vue"

export default {
  components: { WorkReport },
  name: "index"
}
</script>

<template>
  <WorkReport :query-params="{ productionLineName: '小线' }"/>
</template>
