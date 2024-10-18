<template>
    <WorkingInstructionAudit :flow-id="FlowId.OFFICE"></WorkingInstructionAudit>
</template>
<script>
import {FlowId} from "@/views/esop/utils/constants";

export default {
    computed: {
        FlowId() {
            return FlowId
        }
    },
    components:{
        WorkingInstructionAudit: ()=>import("@/views/esop/fileAudit/workinginstruction/index.vue")
    }
}
</script>
