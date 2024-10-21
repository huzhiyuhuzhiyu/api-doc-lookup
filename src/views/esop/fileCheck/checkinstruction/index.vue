<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileCheckInspect"
        :application-type="ApplicationType.INSPECT"
        :flow-code="FlowCode.INSPECT"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";
export default {
    name: 'FileManagementCheckInstruction',
    mixins: [ESOPConstantsMixin]
}
</script>
<style scoped>
</style>
