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
  <Index :queryParams="{documentType: 'inbound',classTypeList: ['packaging', 'abrasive', 'oil', 'accessory', 'turnover_box', 'holder', 'sealing_cap', 'steel_pipe']}"/>
</template>
