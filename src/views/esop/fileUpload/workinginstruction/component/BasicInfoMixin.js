import {switchEnableMark} from "@/api/esop/fileUpload/workinginstruction";
import {notEmpty} from "@/utils";
import {ApprovalStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";

export default {
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
        isFileUpload:{
            type:Boolean,
            required:false,
        },
        applicationType:{
            type:String,
            required:'',
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
        async fetchData(flag=true,code="WJSCSQ") {
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
    },
    computed:{
        orderNoDisabled(){
            return this.codeConfig.codeWay === 'auto' && !this.codeConfig.modifyFlag
        },
        hasEnableMark(){
            return this.dataForm.approvalStatus === ApprovalStatus.OK && this.isFileManagementPage
        },
    }
}
