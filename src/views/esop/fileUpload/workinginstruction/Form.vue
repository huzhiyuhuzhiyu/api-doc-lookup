<template>
    <transition name="el-zoom-in-center">
        <template v-if="!isFinish">
            <div class="JNPF-preview-main org-form" ref="main" v-loading="pageLoading">
                <template v-if="!approvalFlag">
                    <div :class="['JNPF-common-page-header', isView ? 'noButtons' : '']" >
                        <el-page-header @back="goBack('back')" :content="title" />
                        <div class="options" >
                            <template v-if="!isView && isFileUpload">
                                <el-button type="success" :loading="btnLoading" @click="handleConfirm(DocumentStatus.DRAFT)">保存草稿</el-button>
                                <el-button type="primary" :loading="btnLoading" @click="handleConfirm(DocumentStatus.SUBMIT)">保存并提交</el-button>
                            </template>
                            <template v-else-if="isFileManagementPage">
                                <el-button type="primary" :loading="btnLoading" @click="delFileUpload">退回</el-button>
                                <el-button type="danger" :loading="btnLoading" @click="delFileUpload">删除</el-button>
                            </template>
                            <template v-else-if="isFileTrashPage">
                                <el-button type="success" :loading="btnLoading" @click="handleRestore">还原</el-button>
                            </template>

                            <el-button @click="goBack('cancel')">{{ $t('common.cancelButton') }}</el-button>
                        </div>

                    </div>
                    <el-tabs   v-model="activeName">
                        <el-tab-pane label="基础信息" name="info">
                            <component
                                :is="basicInfoComName"
                                v-bind="childBindData"
                                ref="basicInfo" />
                        </el-tab-pane>
                        <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                        </el-tab-pane>
                        <el-tab-pane v-if="isView" label="流转记录" name="transferList">
                            <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                        </el-tab-pane>
                    </el-tabs>
                </template>
                <component
                    v-if="approvalFlag"
                    :is="basicInfoComName"
                    v-bind="childBindData"
                    ref="dataForm" />
            </div>
        </template>
        <FinishSubmit v-else
                      :left-btn-text="'再建一个'"
                      :right-btn-text="'返回列表'"
                      @left-btn-click="recreate"
                      @right-btn-click="goBack"
        ></FinishSubmit>
    </transition>
</template>

<script>

import {getQueryConfirm, getSuccessInfo, isEmpty, notEmpty} from "@/utils";
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/component/FileUploadDrop.vue";
import {DocumentStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {
    addBimFileUpload,
    deleteBimFileUpload,
    detailBimFileUpload,
    modifyBimFileUpload
} from "@/api/esop/fileUpload/workinginstruction";
import Process from "@/components/Process/Preview.vue";
import recordList from "@/views/workFlow/components/RecordList.vue";
import busFlow from "@/mixins/generator/busFlow";
import {getTitleForType, isHasProcessApplicationType} from "@/views/esop/utils/utils";
import FlowMixin from "@/mixins/generator/flowMixin";
import FinishSubmit from "@/views/esop/fileUpload/workinginstruction/old/finishSubmit.vue";
import HasProcessBasicInfo from "@/views/esop/fileUpload/workinginstruction/component/HasProcessBasicInfo.vue";
import NoProcessBasicInfo from "@/views/esop/fileUpload/workinginstruction/component/NoProcessBasicInfo.vue";
import {detailBimRecycleBin, getBimRecycleBin, revertBimRecycleBin} from "@/api/esop/fileTrash";


export default {
    components: { NoProcessBasicInfo, HasProcessBasicInfo, FinishSubmit, recordList, Process, FileUploadDrop},
    props:{
        type:{
            type:String,
            required:true
        },
        id:{
            type:String,
            default:''
        },
        applicationType:{
            type:String,
            required:false
        },
        flowCode:{
            type:String,
            required:false
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
    },
    data() {
        return {
            isFinish: false,
            pageLoading: false,
            DocumentStatus,
            approvalFlag:false,
            activeName: 'info',
            btnLoading: false,
            dataForm:{
                approvalFlag:false,
                documentStatus:DocumentStatus.DRAFT
            },
            orderNo:'',
            flowTemplateJson: {},
            flowTaskOperatorRecordList: [],
            endTime: 0,
            cacheFileUploadList:[],
            flowData:{},
            approvalId:'',
            detailApplicationType:'',

        }
    },
    mixins: [busFlow,FlowMixin],
    async mounted(){
        if( isEmpty(this.applicationType)){
            return
        }
      this.initPage()
    },
    methods: {
        async delFileUpload(){
            try {
                this.btnLoading = true
                await getQueryConfirm(this)
                await deleteBimFileUpload(this.id)
                getSuccessInfo()
                this.goBack()
            }catch (e) {

            }finally {
                this.btnLoading = false
            }

        },
        async handleRestore(){
            try {
                this.btnLoading = true
                await getQueryConfirm(this,"是否要还原此记录")
                await revertBimRecycleBin(this.id)
                getSuccessInfo()
                this.goBack()
            }catch (e) {

            }finally {
                this.btnLoading = false
            }

        },
        recreate(){
            this.$emit('recreate')
        },
        async initPage(){
            const hasId = notEmpty(this.id)
            await this.basicInit(this.id, this.type, this.approvalFlag)
            if(hasId && this.dataForm.approvalFlag && this.dataForm.documentStatus !== DocumentStatus.DRAFT){
               return  this.getFlowDetail(this.id)
            }
            this.getBusInfo(this.flowCode)
        },
        goBack(){
            return this.$emit('back')
        },
        async handleConfirm(type){

            const valid = await this.basicInfoRef.validate()
            if(!valid){
                return
            }
            try {
                this.btnLoading = true
                const isSubmit = type === DocumentStatus.SUBMIT
                if(isSubmit){
                    if(this.basicInfoRef.getCurrentFileList().length === 0){
                        return this.$message.warning('请上传文件，或先保存为草稿')
                    }
                }
                const params = this.getSaveData(type)
                const fn = this.isAdd && isEmpty(this.dataForm.id) ? addBimFileUpload : modifyBimFileUpload
                const { data } = await fn(params)
                await this.$message.success('操作成功')

                this.isFinish = true
            }catch (e) {

            }finally {
                this.btnLoading = false
            }
        },
        getSaveData(documentStatus){
          const {
                openProcess,
                productsId,
                routingId,
                orderNo,
                id,
                approvalFlag,
                version,
                bimFileUploadLineList,
                categoryId,
                categoryName
          } =  this.basicInfoRef.getSaveData()
            return {
                bimFileUpload:{
                    applicationType:this.applicationType,
                    documentStatus,
                    openProcess,
                    productsId,
                    routingId,
                    orderNo,
                    id,
                    approvalFlag,
                    version,
                    categoryId,
                    categoryName
                },
                bimFileUploadLineList,
                flowData:this.flowData,
                // products: [
                //     {
                //         fileUploadId: this.dataForm.id,
                //         productsId:  this.dataForm.productsId
                //     }
                // ]
            }
        },
        init(id, btnType, approvalFlag){
            this.approvalFlag = approvalFlag
            this.basicInit(id,btnType, approvalFlag)
        },
        getInitFn(isAudit){
            return isAudit ? this.$refs.dataForm.init : this.basicInfoRef.init
        },
        async basicInit(id, btnType, approvalFlag){
            const hasId = notEmpty(id)
            await this.$nextTick()
            if(hasId){
                this.pageLoading = true
                try {
                    const res =   await this.getDetailFn(id)
                    console.log(res)
                    const  { data,code,msg } =res
                    if(code !== 200){
                        return this.$message.error(msg)
                    }
                    this.detailApplicationType = data.applicationType
                    this.dataForm.approvalFlag = data.approvalFlag
                    Object.keys(this.dataForm).forEach(key=>this.dataForm[key] = data[key])
                    await this.$nextTick()
                    return  this.getInitFn(approvalFlag)(id, btnType, approvalFlag,data)
                }catch (e) {
                    console.dir(e)
                     this.$message.error(e.message)
                    return this.goBack()
                }finally {
                    this.pageLoading = false
                }
            }
            return this.getInitFn(approvalFlag)(id, btnType, approvalFlag)
        }
    },

    computed:{
        getDetailFn(){
            if(this.isFileTrashPage){
                return detailBimRecycleBin
            }
            return detailBimFileUpload
        },
        childBindData(){
            return {
                isAdd: this.isAdd,
                isEdit: this.isEdit,
                isView: this.isView,
                type: this.type,
                isFileManagementPage: this.isFileManagementPage,
                isFileTrashPage: this.isFileTrashPage,
                isFileUpload: this.isFileUpload,
                applicationType: this.applicationType,
            }
        },
        basicInfoComName(){
            return isHasProcessApplicationType(this.applicationType || this.detailApplicationType)  ? 'HasProcessBasicInfo' : 'NoProcessBasicInfo'
        },
        basicInfoRef(){
            return this.$refs.basicInfo
        },
        isView(){
            return this.type === ModelType.VIEW || this.approvalFlag
        },
        isEdit(){
            return this.type === ModelType.EDIT
        },
        isAdd(){
            return this.type === ModelType.ADD
        },
        title(){
            return getTitleForType(this.applicationType,this.type)
        },
        productId(){
            return this.dataForm.id
        },

    }
}
</script>
<style lang="scss" scoped>


::v-deep .JNPF-common-page-header {
    padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
    padding: 11px 10px;
}

::v-deep .el-tabs {
    height: 100% !important;
}

::v-deep .el-tabs__content {
    height: calc(100% - 47px) !important;
    overflow: auto !important;
}





.JNPF-preview-main{
    overflow: hidden !important;
}

.JNPF-preview-main .main {
    padding-top: 0;
}

::v-deep .el-tabs__item {
    padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 0px !important
}


</style>
