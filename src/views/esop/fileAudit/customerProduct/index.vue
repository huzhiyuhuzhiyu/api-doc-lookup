<template>
    <FileAuditWorkingInstruction :flow-code="FlowCode.CUSTOMER_PRODUCT"/>
</template>
<script>
import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
    mixins:[ESOPConstantsMixin]
}
</script>
