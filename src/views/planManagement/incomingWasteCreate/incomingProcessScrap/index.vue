<script>
import incomingWasteCreate from '../index.vue'

export default {
  components: { incomingWasteCreate },
  name: "index"
}
</script>

<template>
  <incomingWasteCreate :paramsObj="{responsibilityWasteQuantityFlag:true}" type="process"/>
</template>
