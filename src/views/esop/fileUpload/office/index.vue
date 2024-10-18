<template>
    <WorkingInstruction :title="'办公文件上传'" :flow-code="FlowCode.OFFICE" :applicationType="ApplicationType.OFFICE"/>

</template>

<script>

import WorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";
import {ApplicationType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";

export default {
    name: 'supplierProfile',

    components: {  WorkingInstruction },
    data(){
        return {
            ApplicationType,
            FlowCode
        }

    }

}
</script>
<style scoped>

</style>
