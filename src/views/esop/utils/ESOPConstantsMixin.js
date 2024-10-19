import {FlowCode, FlowId} from "@/views/esop/utils/constants";
import {
    ApplicationType,
    ApprovalStatus,
    DocumentStatus,
    PageType
} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import FileUploadWorkingInstruction from "@/views/esop/fileUpload/workinginstruction/index.vue";
import FileAuditWorkingInstruction from '@/views/esop/fileAudit/workinginstruction/index.vue';
export default {
        computed:{
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
            },
            FlowId(){
                return FlowId
            }
        },
        components: {
            FileUploadWorkingInstruction,
            FileAuditWorkingInstruction
        },
}
