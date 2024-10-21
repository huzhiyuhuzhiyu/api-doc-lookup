<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileCheckImage"
        :application-type="ApplicationType.IMAGE"
        :flow-code="FlowCode.IMAGE"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
    name: 'FileManagementDocument',
    mixins: [ESOPConstantsMixin]

}
</script>
<style scoped>
</style>
