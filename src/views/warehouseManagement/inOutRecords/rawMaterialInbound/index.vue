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
  <Index :queryParams="{documentType: 'inbound',classTypeList: ['inner_ring_blank','outer_ring_blank']}"/>
</template>
