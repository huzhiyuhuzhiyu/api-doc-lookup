<template>
    <FileAuditWorkingInstruction :flow-id="FlowId.INSPECT"/>
</template>
<script>
import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
    mixins:[ESOPConstantsMixin]
}
</script>
