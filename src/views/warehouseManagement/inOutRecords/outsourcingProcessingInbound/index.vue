<script>
import Index from "../index.vue";

export default {
  components: {
    Index
  },
  name: "index"
}
</script>

<template>
  <Index :queryParams="{documentType: 'inbound',businessType: 'inbound_out'}"/>
</template>
