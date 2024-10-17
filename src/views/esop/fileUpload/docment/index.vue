<template>
    <WorkingInstruction :title="'检查指导书上传'" :flow-code="FlowCode.IMAGE" :applicationType="ApplicationType.IMAGE">
        <template v-slot:editForm="{data}">
            <EditForm :flowCode="FlowCode.IMAGE" :type="data.uploadType" :id="data.fileUploadId" :applicationType="ApplicationType.IMAGE" @back="data.editBack" v-if="data.formVisible"/>
        </template>
    </WorkingInstruction>
</template>

<script>

import WorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";
import {ApplicationType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";
import EditForm from "@/views/esop/fileUpload/docment/Form.vue";

export default {
    name: 'supplierProfile',

    components: {EditForm, WorkingInstruction },
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
