import {switchEnableMark} from "@/api/esop/fileUpload/workinginstruction";
import {isEmpty, notEmpty} from "@/utils";
import {
    ApprovalStatus,
    ORDER_CODE_FILE_UPLOAD,
    ModelType, PageType, ApplicationType
} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {isNoProductPage} from "@/views/esop/utils/utils";
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";

export default {
    data(){
        return {
            versionCountVisible:false,
        }
    },
    mixins:[AbProjectMixin],
    props:{
        type:{
            type:String,
            default:ModelType.ADD
        },
        isView:{
            type:Boolean,
            default:false
        },
        isAdd:{
            type:Boolean,
            default:false
        },
        isEdit:{
            type:Boolean,
            default:false
        },
        isFileManagementPage:{
            type:Boolean,
            required:false,
        },
        isFileTrashPage:{
            type:Boolean,
            required:false,
        },
        isFileUploadPage:{
            type:Boolean,
            required:false,
        },
        isFileCheckPage:{
            type:Boolean,
            required:false,
        },
        applicationType:{
            type:String,
            required:'',
        },
        isApprovalModel:{
            type:Boolean,
            required:false,
        },
        pageType:{
            type:String,
            required:false,
        },
    },
    methods:{
        async toggleEnableMarkHandler(){
            await switchEnableMark(this.dataForm.id)
            this.$message.success("操作成功")
        },
        validate(...args){
            return this.$refs.dataForm.validate(...args)
        },
        chooseProduct(){
            this.$refs["ComSelect-page"].openDialog()
        },
        getSaveData(){
            return {
                ...this.dataForm,
                bimFileUploadLineList: this.getUploadDetailList()
            }
        },
        async fetchData(flag=true,code=ORDER_CODE_FILE_UPLOAD) {
            try {
                const data = await this.jnpf.getBillRuleConfigFun(code);
                this.codeConfig = data
                if (flag) {
                    this.dataForm.orderNo = data.number
                }
            } catch (error) {
            }
        },
        init(id, btnType, approvalFlag,data){
            btnType &&  (this.type = btnType)
            const flag = notEmpty(id)
            this.fetchData(!flag)
            flag &&  this.getDetail(data)
        },
        versionCountHandler(){
           if(isEmpty(this.dataForm.versionCount) || this.dataForm.versionCount === 0){
               return this.$message.info('暂无可查看的关联版本')
           }
          this.versionCountVisible = true
        }
    },
    computed:{
        orderNoDisabled(){
            return this.codeConfig.codeWay === 'auto' && !this.codeConfig.modifyFlag
        },
        hasEnableMark(){
            return this.dataForm.approvalStatus === ApprovalStatus.OK && (this.isFileManagementPage || this.isFileCheckPage)
        },
        isNoProductPage(){
            return isNoProductPage(this.dataForm.applicationType || this.applicationType)
        },
    },
    async created() {
        await this.awaitAbProject()
        if(this.isAdd){
            this.dataForm.projectId = this.abProjectId
        }

    }
}
