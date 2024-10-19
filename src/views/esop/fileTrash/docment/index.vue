<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileTrashDocument"
        :application-type="ApplicationType.IMAGE"
        :flow-code="FlowCode.IMAGE"
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
