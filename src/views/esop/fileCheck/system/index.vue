<template>
    <FileManagementSystem :page-type="PageType.FileCheckAttachment"/>
</template>

<script>

import FileManagementSystem from "@/views/esop/fileManagement/system/index.vue";
import {PageType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";

export default {
    computed: {
        PageType() {
            return PageType
        }
    },
    components: {
        FileManagementSystem

    },
}
</script>

