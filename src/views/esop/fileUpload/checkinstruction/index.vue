<template>
  <WorkingInstruction :title="'检查指导书上传'" :type="'inspect'"></WorkingInstruction>
</template>

<script>

import WorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";

export default {
  name: 'supplierProfile',
  components: {WorkingInstruction,  },

}
</script>
<style scoped>

</style>
