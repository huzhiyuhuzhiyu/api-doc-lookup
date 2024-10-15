<template>
  <WorkingInstruction :title="'检查指导书上传'" :flow-code="FlowCode.INSPECT" :applicationType="ApplicationType.INSPECT"></WorkingInstruction>
</template>

<script>

import WorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";
import {ApplicationType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";

export default {
  name: 'supplierProfile',

  components: {WorkingInstruction },
    data(){
      return {
          ApplicationType,
          FlowCode
      }

    }

}
</script>
<style scoped>

</style>
