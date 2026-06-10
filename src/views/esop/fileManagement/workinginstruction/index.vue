<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileManagementWork"
        :application-type="ApplicationType.WORK"
        :flow-code="FlowCode.WORK"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import ESOPConstantsMixin from '@/views/esop/utils/ESOPConstantsMixin'
export default {
    name: 'FileManagementWorkingInstruction',
    mixins: [ESOPConstantsMixin]
}
</script>
<style scoped>
</style>
