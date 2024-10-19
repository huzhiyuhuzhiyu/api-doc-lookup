<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileTrashInspect"
        :application-type="ApplicationType.INSPECT"
        :flow-code="FlowCode.INSPECT"
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
