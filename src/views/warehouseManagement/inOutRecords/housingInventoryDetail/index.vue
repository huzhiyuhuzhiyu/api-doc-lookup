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
  <Index :queryParams="{classTypeList: ['inner_ring','outer_ring']}"/>
</template>
