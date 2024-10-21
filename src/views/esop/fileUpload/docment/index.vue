<template>
    <FileUploadWorkingInstruction :title="'图文档上传'" :flow-code="FlowCode.IMAGE" :applicationType="ApplicationType.IMAGE"/>

</template>

<script>


import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
    name: 'supplierProfile',
    mixins: [ESOPConstantsMixin],

}
</script>
<style scoped>

</style>
