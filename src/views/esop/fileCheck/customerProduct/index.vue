<template>
    <FileUploadWorkingInstruction
        :page-type="PageType.FileCheckCustomerProduct"
        :application-type="ApplicationType.CUSTOMER_PRODUCT"
        :flow-code="FlowCode.CUSTOMER_PRODUCT"
        :approval-status="ApprovalStatus.OK"
        :document-status="DocumentStatus.SUBMIT"/>
</template>

<script>
import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";
export default {
    name: 'FileManagementCheckCustomerProduct',
    mixins: [ESOPConstantsMixin]
}
</script>
<style scoped>
</style>
