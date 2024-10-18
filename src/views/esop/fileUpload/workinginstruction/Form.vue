<template>
    <transition name="el-zoom-in-center">

        <template v-if="!isFinish">
            <div class="JNPF-preview-main org-form" ref="main" v-loading="pageLoading">
                <div
                    :class="['JNPF-common-page-header', isView ? 'noButtons' : '']"  v-if="!approvalFlag">
                    <el-page-header @back="goBack('back')" :content="title" />
                    <div class="options" v-if="!isView">
                        <el-button type="success" :loading="btnLoading" @click="handleConfirm(DocumentStatus.DRAFT)">保存草稿</el-button>
                        <el-button type="primary" :loading="btnLoading" @click="handleConfirm(DocumentStatus.SUBMIT)">保存并提交</el-button>
                        <el-button @click="goBack('cancel')">{{ $t('common.cancelButton') }}</el-button>
                    </div>
                </div>

                <el-tabs v-if="!approvalFlag"  v-model="activeName">
                    <el-tab-pane label="基础信息" name="info">
                        <WorkFormBasicInfo  :is-add="isAdd"
                                            :is-edit="isEdit"
                                            :is-view="isView"
                                            :type="type" ref="basicInfo" />

                    </el-tab-pane>
                    <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                        <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                    </el-tab-pane>
                    <el-tab-pane v-if="isView" label="流转记录" name="transferList">
                        <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                    </el-tab-pane>
                </el-tabs>
                <WorkFormBasicInfo
                    :is-add="isAdd"
                    :is-edit="isEdit"
                    :is-view="isView"
                    :type="type"
                    v-if="approvalFlag"  ref="dataForm" />
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

import {isEmpty} from "@/utils";
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/FileUploadDrop.vue";
import {DocumentStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {addBimFileUpload, modifyBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";
import Process from "@/components/Process/Preview.vue";
import recordList from "@/views/workFlow/components/RecordList.vue";
import busFlow from "@/mixins/generator/busFlow";
import { getTitleForType} from "@/views/esop/utils/utils";
import FlowMixin from "@/mixins/generator/flowMixin";
import FinishSubmit from "@/views/esop/fileUpload/workinginstruction/old/finishSubmit.vue";
import WorkFormBasicInfo from "@/views/esop/fileUpload/workinginstruction/basicInfo.vue";


export default {
    components: {WorkFormBasicInfo, FinishSubmit, recordList, Process, FileUploadDrop},
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
                approvalFlag:false
            },

            orderNo:'',
            flowTemplateJson: {},

            flowTaskOperatorRecordList: [],
            endTime: 0,
            cacheFileUploadList:[],
            flowData:{},
            approvalId:'',

        }
    },
    mixins: [busFlow,FlowMixin],
    async mounted(){
      this.initPage()
    },
    methods: {
        recreate(){
            this.$emit('recreate')
        },
        async initPage(){
            if(!this.id) {
                this.getBusInfo(this.flowCode)
            }
            await this.basicInit(this.id, this.type, this.approvalFlag)
            const isDraft = this.dataForm.documentStatus === DocumentStatus.DRAFT
            if(isDraft){
                this.getBusInfo(this.flowCode)
            }else{
                this.dataForm.approvalFlag && this.getFlowDetail(this.id)
            }
        },
        goBack(){
            return this.$emit('back')
        },
        async handleConfirm(type){
            const valid = await this.basicInfoRef.validate()
            if(!valid){
                return
            }
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
            // isSubmit && this.goBack('',true)
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
                bimFileUploadLineList
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
                    version
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
            this.basicInit(id,btnType, approvalFlag,true)
        },
        async basicInit(id, btnType, approvalFlag,isAudit = false){
            await this.$nextTick()

            const fn = isAudit ?  this.$refs.dataForm.init  : this.basicInfoRef.init
            return  fn(id, btnType, approvalFlag)
        }
    },

    computed:{
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
