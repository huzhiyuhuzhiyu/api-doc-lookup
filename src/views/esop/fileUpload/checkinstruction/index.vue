<template>
  <WorkingInstruction :title="'检查指导书上传'" :applicationType="ApplicationType.INSPECT"></WorkingInstruction>
</template>

<script>

import WorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";
import {ApplicationType} from "@/views/esop/fileUpload/workinginstruction/constant";

export default {
  name: 'supplierProfile',
  components: {WorkingInstruction,  },
    data(){
      return {
          ApplicationType
      }

    }

}
</script>
<style scoped>

</style>
