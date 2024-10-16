<template>
    <transition name="el-zoom-in-center">

        <div class="JNPF-preview-main org-form" ref="main">
            <div

                :class="['JNPF-common-page-header', isView ? 'noButtons' : '']"  v-if="!approvalFlag">
                <el-page-header style="visibility: hidden" content="123" />
                <div class="options"  >
                    <el-button type="primary" :loading="btnLoading" @click="handleConfirm(DocumentStatus.SUBMIT)">提交</el-button>
<!--                    <el-button @click="goBack('cancel')">{{ $t('common.cancelButton') }}</el-button>-->
                </div>
            </div>

            <div   class="contain">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <el-collapse v-model="activeNames">
                                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                    <el-row>
                                        <el-form label-position="top" :model="dataForm" ref="dataForm">
                                            <el-row :gutter="10">
                                                <el-col :span="6">
                                                    <el-form-item label="图文档分类" prop="partnerCategoryIdText">
                                                        <ComSelect-list
                                                            :isdisabled="btnType === 'look'"
                                                            v-model="dataForm.categoryName"
                                                            placeholder="请选择图文档分类" auth
                                                            @change="onOrganizeChange"
                                                            :title="'选择分类'"
                                                            :method="getcategoryTree"
                                                            :requestObj="{  keyword: '', type: FileCategoryType.IMAGE_DOCUMENT }"
                                                            :paramsObj="{}" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="版本号" >
                                                        <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-row>
                                </el-collapse-item>
                                <el-collapse-item  v-if="hasFileCategory"  title="文件上传" name="normalUpload">
                                    <div class="collapse-wrapper">
                                        <FileUploadDrop :disabled="isView" :grid-height="'484px'" class="fileUpload" v-model="normalFileList"></FileUploadDrop>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

import {isEmpty, notEmpty, trim} from "@/utils";
import {detailProcess} from "@/api/basicData/processSettingss";
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/FileUploadDrop.vue";
import {ApplicationType, DocumentStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {getBusinessFlowDetail, getBusinessFlowInfo} from "@/api/workFlow/FlowEngine";
import {addBimFileUpload, detailBimFileUpload, modifyBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";
import Process from "@/components/Process/Preview.vue";
import recordList from "@/views/workFlow/components/RecordList.vue";
import busFlow from "@/mixins/generator/busFlow";
import {downloadFile, getFilePreviewUrl, getTitleForApplicationType, getTitleForType} from "@/views/esop/utils/utils";
import {getcooperativeProduct} from "@/api/salesManagement/assemblyOrders";
import {getProductList} from "@/api/basicData/materialFiles";
import {FileCategoryType} from "@/views/esop/fileCategoryManagement/constants";
function getOriginActiveNames(){
    return ['basicInfo']
}
import { getcategoryTree } from '@/api/basicData/index'

export default {
    components: { recordList, Process, FileUploadDrop },
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
            selectRows:[],
            productsIdsMap: new Map(),
            file: null,
            productVisible: false,
            getDetailJSON:'',
            DocumentStatus,
            approvalFlag:false,
            processUploadVOMap:new Map(),
            processUploadProcessId2ItemsMap:new Map(),
            activeNames:['basicInfo','normalUpload'],
            activeName: 'info',
            btnType: 'add',
            btnLoading: false,
            formLoading: false,
            routingName:'',
            routingLineList:[],
            productObj:{},
            normalFileList:[],
            processFileList:{},
            codeConfig:{},
            orderNo:'',
            dataForm:{
                categoryName:'',
                categoryId:'',
                orderNo:'',
                productsCategoryName:'',
                productCategoryId:'',
                productsId:'',
                drawingNo:'',
                productsCode:'',
                openProcess:0,
                routingName:'',
                routingId:'',
                approvalFlag:true,
                id:null,
                version:''
            },

            endTime: 0,
            flowData:{},
            approvalId:'',
            isApprovalCheck:false,
            FileCategoryType,
            productData:[],
            uploadVisib:false,
            getcategoryTree,
            getProductList,
        }
    },
    mixins: [busFlow],
    created(){
        // if(this.id) {
        //     this.dataForm.approvalFlag && this.getFlowDetail(this.id)
        //     this.fetchData(false)
        //     this.getDetail(this.id)
        // }else{
        //     this.getBusInfo()
        //     this.fetchData()
        // }
    },
    methods: {

        onOrganizeChange(cid,[{name,id}]){
            this.dataForm.categoryName = name
            this.dataForm.categoryId = id
        },

        async getDetail(id){
            const { data } = await detailBimFileUpload(id)
            this.getDetailJSON = JSON.stringify(data)
            Object.keys(this.dataForm).forEach(key=>{
                this.dataForm[key] = data[key]
            })
            console.log( data.bimFileUploadLineVOList)
            this.normalFileList = data.bimFileUploadLineVOList.map(item=>{
                return {
                    name: item.documentName,
                    fileSize: item.fileSize,
                    filename: item.documentName,
                    id: item.documentId,
                    url: getFilePreviewUrl(item.filePath),
                    processUploadId: item.id,
                }
            })
        },

        async handleConfirm(type){
            if(!this.hasFileCategory){
                return this.$message.warning('请选择分类')
            }
            return this.$message.info('暂未开放')
            const isSubmit = type === DocumentStatus.SUBMIT
            if(isSubmit){
                if(this.normalFileList.length === 0){
                    return this.$message.warning('请上传文件，或先保存为草稿')
                }
            }
            const params = this.getSaveData(type)
            const fn = this.isAdd ? addBimFileUpload : modifyBimFileUpload
            const { data } = await fn(params)
            await this.$message.success('操作成功')
        },
        getSaveData(type){
            return {
                bimFileUpload:{
                    applicationType:this.applicationType,
                    categoryId:this.dataForm.categoryId,
                    documentStatus:type,
                    productsId:this.dataForm.productsId,
                    routingId:this.dataForm.routingId,
                    orderNo:this.dataForm.orderNo,
                    id:this.dataForm.id,
                    approvalFlag:this.dataForm.approvalFlag,
                    version:this.dataForm.version
                },
                bimFileUploadLineList:this.getUploadDetailList(),
                flowData:this.flowData
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
        getUploadDetailList(){
            return this.normalFileList.map(item=>{
                return {
                    documentId:item.id,
                    id : item.processUploadId,
                    fileUploadId:this.dataForm.id
                }
            })
        },
        normalUploadShow(){
            this.activeNames = getOriginActiveNames().concat('normalUpload')
        },
        init(id, btnType, approvalFlag){
            console.log(id, btnType, approvalFlag)
            this.isApprovalCheck = approvalFlag
            this.approvalFlag = approvalFlag
            this.getDetail(id)
        },
    },
    watch:{
        "dataForm.categoryId"(val){
            if(isEmpty(val)){
                this.dataForm.openProcess = 0
                this.activeNames = getOriginActiveNames()
                return
            }
            return this.normalUploadShow()
        },

    },
    computed:{
        hasFileCategory(){
            return notEmpty(this.dataForm.categoryId)
        },
        isView(){
            return this.type === ModelType.VIEW || this.isApprovalCheck
        },
        isAdd(){
            return this.type === ModelType.ADD
        },
        orderNoDisabled(){
            return this.codeConfig.codeWay === 'auto' && !this.codeConfig.modifyFlag
        },
        title(){
            return getTitleForType(this.applicationType,this.type)
        },
    }
}
</script>
<style lang="scss" scoped>
.fileUpload{

}
.contain {
    position: relative;
    height: calc(100% - 47px);
    overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
    //padding: 0 10px 10px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
    overflow: auto;
}

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

.required {
    color: red;
    margin-right: 4px;
}

.disabled-span {
    pointer-events: none;
    color: #999;
    /* 添加其他禁用样式 */
}

::v-deep .workNode {
    background-color: #f5f5f7 !important;
}

.noDataTip {
    text-align: center;
    padding: 20%;
    font-size: 16px;
    min-height: 1045px !important;
    background-color: #f5f5f7 !important;
    color: #576a95;
}

::v-deep .el-collapse-item__header {
    line-height: 33px;
    font-size: 18px;
    border-top: 1px solid rgb(220, 223, 230);
    background: rgb(250, 250, 250);
    padding-left: 5px;
    font-weight: 700;
    border-right: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
    border: 1px solid #dcdfe6 !important;
    border-top: none;
    margin-bottom: 0;
    padding: 0 10px 0px;
    border-top: none !important;

}
::v-deep .el-tabs__header{
    margin-bottom: 0;
}
::v-deep .el-tabs__content {
    height: calc(100% - 39px) !important;
    overflow: auto !important;
}

::v-deep .el-collapse-item__content {
    padding-bottom: 0px
}
.JNPF-preview-main{
    overflow: hidden;
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
.collapse-wrapper{
    padding: 10px;
    overflow-y: auto;
    min-height: 280px;
}
.left-input{
    width: 50%;
}
.right-input{
    width: calc(50% - 10px);
    margin-left: 10px;
}
</style>
