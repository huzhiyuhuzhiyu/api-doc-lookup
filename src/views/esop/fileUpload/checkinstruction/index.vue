<template>
  <FileUploadWorkingInstruction
      :title="'检查指导书上传'"
      :flow-code="FlowCode.INSPECT"
      :applicationType="ApplicationType.INSPECT"
      :page-type="PageType.FileUploadInspect"
  ></FileUploadWorkingInstruction>
</template>

<script>


import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
  name: 'FileUploadCheckInstruction',
    mixins: [ESOPConstantsMixin]

}
</script>
<style scoped>

</style>
