<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileCheckOffice"
        :application-type="ApplicationType.OFFICE"
        :flow-code="FlowCode.OFFICE"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";
export default {
    name: 'FileManagementOffice',
    mixins: [ESOPConstantsMixin]
}
</script>
<style scoped>
</style>
