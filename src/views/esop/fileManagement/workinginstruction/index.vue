<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileManagementWork"
        :application-type="ApplicationType.WORK"
        :flow-code="FlowCode.WORK"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import FileUploadWorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";
import {
    ApplicationType,
    ApprovalStatus,
    DocumentStatus,
    PageType
} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";
export default {
    name: 'FileManagementWorkingInstruction',
    computed: {
        FlowCode() {
            return FlowCode
        },
        ApplicationType() {
            return ApplicationType
        },
        PageType() {
            return PageType
        },
        ApprovalStatus() {
            return ApprovalStatus
        },
        DocumentStatus() {
            return DocumentStatus
        }
    },
    components: {FileUploadWorkingInstruction},

}
</script>
<style scoped>
</style>
