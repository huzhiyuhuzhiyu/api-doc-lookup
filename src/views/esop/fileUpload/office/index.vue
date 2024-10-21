<template>
    <FileUploadWorkingInstruction
        :title="'办公文件上传'"
        :flow-code="FlowCode.OFFICE"
        :applicationType="ApplicationType.OFFICE"
        :page-type="PageType.FileUploadOffice"
    />

</template>

<script>

import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
    name: 'FileUploadOffice',
    mixins: [ESOPConstantsMixin]

}
</script>
<style scoped>

</style>
