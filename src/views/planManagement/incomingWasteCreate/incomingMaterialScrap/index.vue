<script>
import incomingWasteCreate from '../index.vue'

export default {
  components: { incomingWasteCreate },
  name: "index"
}
</script>

<template>
  <incomingWasteCreate :paramsObj="{materialWasteQuantityFlag:true}" type="material"/>
</template>
