<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileTrashOffice"
        :application-type="ApplicationType.OFFICE"
        :flow-code="FlowCode.OFFICE"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import ESOPConstantsMixin from '@/views/esop/utils/ESOPConstantsMixin'
export default {
    mixins: [ESOPConstantsMixin]
}
</script>
<style scoped>
</style>
