<template>
    <transition name="el-zoom-in-center">

        <div class="JNPF-preview-main org-form" ref="main">
            <div :class="['JNPF-common-page-header', isView ? 'noButtons' : '']">
                <el-page-header @back="goBack('back')" :content="title" />
                <div class="options" v-if="!isView">
                    <el-button type="success" :loading="btnLoading" @click="handleConfirm(DocumentStatus.DRAFT)">保存草稿</el-button>
                    <el-button type="primary" :loading="btnLoading" @click="handleConfirm(DocumentStatus.SUBMIT)">保存并提交</el-button>
                    <el-button @click="goBack('cancel')">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>

            <el-tabs v-if="dataForm.approvalFlag" v-model="activeName"  >
                <el-tab-pane label="基础信息" name="info">

                    <div class="contain">
                        <div class="JNPF-common-layout">
                            <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                                <div class="JNPF-common-layout-main JNPF-flex-main">
                                    <el-collapse v-model="activeNames">
                                        <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                            <el-row>
                                                <el-form label-position="top">
                                                    <el-row :gutter="10">
                                                        <el-col :span="24">
                                                            <el-form-item label="单号">
                                                                <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                    <el-row :gutter="10">
                                                        <el-col :span="12">
                                                            <el-form-item label="产品分类">
                                                                <el-input @click.native="chooseProduct" :value="dataForm.productsCategoryName" placeholder="请选择产品分类" readonly/>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="产品信息">
                                                                <el-input @click.native="chooseProduct" placeholder="请选择品名规格" :value="dataForm.drawingNo" style="width: 50%" readonly/>
                                                                <el-input @click.native="chooseProduct" placeholder="请选择产品编码" :value="dataForm.productsCode"  style="margin-left: 10px;width: calc(50% - 10px)" readonly/>
                                                            </el-form-item>
                                                        </el-col>

                                                    </el-row>
                                                    <el-row :gutter="10">
                                                        <el-col :span="12">
                                                            <el-form-item v-if="needProcess" label="工艺路线名称">
                                                                <el-input readonly v-model="dataForm.routingName"></el-input>
                                                            </el-form-item>
                                                            <div  style="visibility: hidden">
                                                                a
                                                            </div>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="按工序上传">
                                                                <div style="height: 32px;display: flex;align-items: center">
                                                                    <el-tooltip :content="hasRoutingLine ? '开启后可为每一道工序上传作业指导书':'该产品未设置工艺路线，请设置工艺路线后再开启'" placement="top-start">
                                                                        <el-switch
                                                                            :active-value="1"
                                                                            :inactive-value="0"
                                                                            :disabled="!hasRoutingLine"
                                                                            @change="toggleProcessHandler"
                                                                            v-model="dataForm.openProcess"/>
                                                                    </el-tooltip>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>

                                                    </el-row>
                                                </el-form>
                                            </el-row>
                                        </el-collapse-item>
                                        <template v-if="needProcess && routingLineList.length > 0" >
                                            <el-collapse-item v-for="item in routingLineList"  :key="item.processId"  :title="item.processName" :name="item.processId">
                                                <div class="collapse-wrapper">
                                                    <FileUploadDrop class="fileUpload" :key="item.processId" v-model="processFileList[item.processId]"></FileUploadDrop>
                                                </div>
                                            </el-collapse-item>
                                        </template>
                                        <el-collapse-item  v-if="hasProduct && !needProcess"  title="文件上传" name="normalUpload">
                                            <div class="collapse-wrapper">
                                                <FileUploadDrop class="fileUpload" v-model="normalFileList"></FileUploadDrop>
                                            </div>
                                        </el-collapse-item>
                                    </el-collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                    <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
                <el-tab-pane v-if="isView" label="流转记录" name="transferList">
                    <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
            </el-tabs>
            <div v-if="!dataForm.approvalFlag" class="contain">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <el-collapse v-model="activeNames">
                                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                    <el-row>
                                        <el-form label-position="top">
                                            <el-row :gutter="10">
                                                <el-col :span="24">
                                                    <el-form-item label="单号">
                                                        <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="产品分类">
                                                        <el-input @click.native="chooseProduct" :value="dataForm.productsCategoryName" placeholder="请选择产品分类" readonly/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="产品信息">
                                                        <el-input @click.native="chooseProduct" placeholder="请选择品名规格" :value="dataForm.drawingNo" style="width: 50%" readonly/>
                                                        <el-input @click.native="chooseProduct" placeholder="请选择产品编码" :value="dataForm.productsCode"  style="margin-left: 10px;width: calc(50% - 10px)" readonly/>
                                                    </el-form-item>
                                                </el-col>

                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item v-if="needProcess" label="工艺路线名称">
                                                        <el-input readonly v-model="dataForm.routingName"></el-input>
                                                    </el-form-item>
                                                    <div  style="visibility: hidden">
                                                        a
                                                    </div>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="按工序上传">
                                                        <div style="height: 32px;display: flex;align-items: center">
                                                            <el-tooltip :content="hasRoutingLine ? '开启后可为每一道工序上传作业指导书':'该产品未设置工艺路线，请设置工艺路线后再开启'" placement="top-start">
                                                                <el-switch
                                                                    :active-value="1"
                                                                    :inactive-value="0"
                                                                    :disabled="!hasRoutingLine"
                                                                    @change="toggleProcessHandler"
                                                                    v-model="dataForm.openProcess"/>
                                                            </el-tooltip>
                                                        </div>
                                                    </el-form-item>
                                                </el-col>

                                            </el-row>
                                        </el-form>
                                    </el-row>
                                </el-collapse-item>
                                <template v-if="needProcess && routingLineList.length > 0" >
                                    <el-collapse-item v-for="item in routingLineList"  :key="item.processId"  :title="item.processName" :name="item.processId">
                                        <div class="collapse-wrapper">
                                            <FileUploadDrop :disabled="isView" class="fileUpload" :key="item.processId" v-model="processFileList[item.processId]"></FileUploadDrop>
                                        </div>
                                    </el-collapse-item>
                                </template>
                                <el-collapse-item  v-if="hasProduct && !needProcess"  title="文件上传" name="normalUpload">
                                    <div class="collapse-wrapper">
                                        <FileUploadDrop :disabled="isView" class="fileUpload" v-model="normalFileList"></FileUploadDrop>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </div>
            </div>
            <ChooseProductDialog @submit="chooseProductSubmitHandler" v-if="chooseProductVisible" :visible.sync="chooseProductVisible"></ChooseProductDialog>
        </div>
    </transition>
</template>

<script>

import {isEmpty, notEmpty, trim} from "@/utils";
import {detailProcess} from "@/api/basicData/processSettingss";
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/FileUploadDrop.vue";
import {ApplicationType, DocumentStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {getBusinessFlowDetail, getBusinessFlowInfo} from "@/api/workFlow/FlowEngine";
import ChooseProductDialog from "@/views/esop/fileUpload/workinginstruction/ChooseProductDialog.vue";
import {addBimFileUpload, detailBimFileUpload, modifyBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";
import Process from "@/components/Process/Preview.vue";
import recordList from "@/views/workFlow/components/RecordList.vue";
import busFlow from "@/mixins/generator/busFlow";
import {getFilePreviewUrl} from "@/views/esop/fileUpload/utils";
function getOriginActiveNames(){
    return ['basicInfo']
}


export default {
    components: {recordList, Process, ChooseProductDialog, FileUploadDrop},
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
        }
    },
    data() {
        return {
            getDetailJSON:'',
            DocumentStatus,
            approvalFlag:false,
            processUploadVOMap:new Map(),
            processUploadProcessId2ItemsMap:new Map(),
            chooseProductVisible: false,
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
            flowTemplateJson: {},
            dataForm:{
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
                id:null
            },
            flowTaskOperatorRecordList: [],
            endTime: 0,
            cacheFileUploadList:[],
            flowData:{}
        }
    },
    mixins: [busFlow],
    created(){
        if(this.isAdd) {
            this.dataForm.approvalFlag && this.getFlowDetail(this.id)
            this.fetchData()
        }else{
            this.getBusInfo()
            this.getDetail()
            this.fetchData(false)

        }

    },
    methods: {
       async hasModifyNoSave(){
           if(this.isView){
                return false
           }

           if(this.isEdit){
               const { data } = await detailBimFileUpload(this.id)
               if(JSON.stringify(data) === this.getDetailJSON){
                   return false
               }
           }
           return false
        },
        async getDetail(){
            const { data } = await detailBimFileUpload(this.id)
            this.getDetailJSON = JSON.stringify(data)
            Object.keys(this.dataForm).forEach(key=>{
                this.dataForm[key] = data[key]
            })
            if(data.openProcess){
                this.cacheFileUploadList = data.bimFileUploadLineVOList
               return await this.getProcessByCode(data.bimFileUploadLineVOList)
            }
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
        goBack(type,force =false){
           // if(this.hasModifyNoSave()){
           //      return this.$confirm('您有编辑的内容未保存，是否返回？','提示',{
           //           confirmButtonText:'确定',
           //           cancelButtonText:'取消',
           //           type:'warning'
           //      }).then(()=>{
           //           this.$emit('back')
           //      }).catch(()=>{})
           // }
            if(force){
                return this.$emit('back')
            }
            return this.$confirm(`您确认要${type === 'back' ? '返回' :'取消'}吗？`,'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                this.$emit('back')
            }).catch(()=>{})
           // this.$emit('back')
        },
        async handleConfirm(type){
            if(isEmpty( this.dataForm.productsId)){
                return this.$message.warning('请选择产品')
            }
            const isSubmit = type === DocumentStatus.SUBMIT
            if(isSubmit){
                if(this.currentFileList.length === 0){
                    return this.$message.warning('请上传文件，或先保存为草稿')
                }
            }
            const params = this.getSaveData(type)
            const fn = this.isAdd ? addBimFileUpload : modifyBimFileUpload
            const { data } = await fn(params)
            console.log(data)
            this.hasModify = false
            await this.$message.success('操作成功')
            isSubmit && this.goBack('',true)

        },
        getSaveData(type){
            return {
                bimFileUpload:{
                    applicationType:this.applicationType,
                    categoryId:this.dataForm.productCategoryId,
                    documentStatus:type,
                    openProcess: this.dataForm.openProcess,
                    productsId:this.dataForm.productsId,
                    routingId:this.dataForm.routingId,
                    orderNo:this.dataForm.orderNo,
                    id:this.dataForm.id,
                    approvalFlag:this.dataForm.approvalFlag
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
            if(this.needProcess){
                return Object.keys(this.processFileList).map(key=>
                     this.processFileList[key].map(file=>({
                        documentId:file.id,
                        processId:key,
                        id : file.processUploadId,
                        fileUploadId:this.dataForm.id
                    }))
                ).flat(Infinity)
            }
            return this.normalFileList.map(item=>{
                return {
                    documentId:item.id,
                    id : item.processUploadId,
                    fileUploadId:this.dataForm.id
                }
            })
        },
        chooseProductSubmitHandler({productId, productObj, hideModel}){
            if(!productId){
                this.$message.info('请您先选择产品再提交')
                return
            }

            this.dataForm.productsCategoryName = productObj.productCategoryName
            this.dataForm.drawingNo = productObj.drawingNo
            this.dataForm.productsCode = productObj.code
            this.dataForm.productsId = productId
            this.dataForm.productCategoryId = productObj.productCategoryId
            this.dataForm.routingName =productObj.routingName
            this.dataForm.routingId = productObj.routingId
            hideModel()
        },
        chooseProduct(){
            console.log('chooseProduct')
            this.chooseProductVisible = true
        },
        toggleProcessHandler(val){
          if(!val){
              return  this.normalUploadShow()
          }
          this.getProcessByCode(this.cacheFileUploadList)
        },
        async getProcessByCode(fileUploadList){
            if(isEmpty(this.dataForm.productsId)){
                this.routingLineList = []
                return this.dataForm.routingId = ''
            }
            const { routingId }= this.dataForm
            if(isEmpty(routingId)){
                this.routingLineList = []
                return this.$message.warning('该产品暂未设置工艺路线')
            }
            await this.getProcessLine(fileUploadList)
        },
        async getProcessLine(fileUploadList){
            const { data }= await detailProcess(this.dataForm.routingId)
            this.dataForm.routingName = data.routing.name
            this.routingLineList = data.routingLineList
            const processIdList = []
            if(isEmpty(fileUploadList)){
                data.routingLineList.forEach(item=>{
                    processIdList.push(item.processId)
                    this.$set(this.processFileList,item.processId,[])
                })
            }else{
                this.processUploadVOMap.clear()
                this.processUploadProcessId2ItemsMap.clear()
                fileUploadList.forEach(item=>{
                    this.processUploadVOMap.set(item.id,item)
                    this.processUploadProcessId2ItemsMap.get(item.processId)
                        ? this.processUploadProcessId2ItemsMap.get(item.processId).push(item.id)
                        : this.processUploadProcessId2ItemsMap.set(item.processId,[item.id])
                })
                data.routingLineList.forEach(item=>{
                    const { processId } = item
                    processIdList.push(processId)

                    const processUploadIds =  this.processUploadProcessId2ItemsMap.get(processId)
                    const resArr =[]
                    if(processUploadIds){
                        processUploadIds.forEach(key=>{
                            const {
                                documentId,
                                filePath,
                                id,
                                documentName,
                                fileSize,
                            } = this.processUploadVOMap.get(key)
                            resArr.push({
                                name: documentName,
                                fileSize: fileSize,
                                filename: documentName,
                                id: documentId,
                                url: getFilePreviewUrl(filePath),
                                processUploadId: id,
                            })
                        })
                    }
                    this.$set(this.processFileList,processId,resArr)
                })
            }
            if(this.routingLineList.length > 0){
               this.activeNames = getOriginActiveNames().concat(processIdList)
            }
        },
        getBusInfo(){
            getBusinessFlowInfo('b048').then(res=>{
                if (res.data){
                    if (res.data.enabledMark){
                        this.flowData = res.data
                        this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
                        this.dataForm.approvalFlag = !!res.data.enabledMark
                        console.log('approvalFlag',this.dataForm.approvalFlag)
                    }else{
                        this.flowTemplateJson = {}
                        this.dataForm.approvalFlag = false
                        this.$message.error('未找到审批流程！')
                    }
                }else{
                    this.flowTemplateJson = {}
                    this.dataForm.approvalFlag = false
                }
            }).catch(()=>{})
        },
        // 流程信息 && 流转记录
        getFlowDetail(id){
            getBusinessFlowDetail(id).then(res=>{
                if (res.data){
                    this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson) : null
                    this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
                    this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
                    let flowTaskNodeList = res.data.flowTaskNodeList
                    if (flowTaskNodeList.length) {
                        for (let i = 0; i < flowTaskNodeList.length; i++) {
                            const nodeItem = flowTaskNodeList[i]
                            const loop = data => {
                                if (Array.isArray(data)) data.forEach(d => loop(d))
                                if (data.nodeId === nodeItem.nodeCode) {
                                    if (nodeItem.type == 0) data.state = 'state-past'
                                    if (nodeItem.type == 1) data.state = 'state-curr'
                                    if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
                                    return
                                }
                                if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                                if (data.childNode) loop(data.childNode)
                            }
                            loop(this.flowTemplateJson)
                        }
                    }
                }
            }).catch(()=>{})
        },
        normalUploadShow(){
            this.activeNames = getOriginActiveNames().concat('normalUpload')
        }

    },
    watch:{


        "dataForm.productCode"(val){
            if(isEmpty(val)){
                this.needProcess = 0
                this.activeNames = getOriginActiveNames()
                return
            }
            if(!this.needProcess){
               return  this.normalUploadShow()
            }
            if(!this.hasRoutingLine){
                this.$message.info('该产品暂未设置工艺路线')
                this.normalUploadShow()
                return this.needProcess = 0
            }
            this.getProcessByCode()
        },

    },
    computed:{
        currentFileList(){
            if(this.dataForm.openProcess){
                return Object.keys(this.processFileList).map(key=>this.processFileList[key]).flat(Infinity)
            }
            return this.normalFileList
        },
        isView(){
            return this.type === ModelType.VIEW
        },
        isEdit(){
            return this.type === ModelType.EDIT
        },
        isAdd(){
            return this.type === ModelType.ADD
        },
        needProcess(){
            return this.dataForm.openProcess
        },
        orderNoDisabled(){
          return this.codeConfig.codeWay === 'auto' && !this.codeConfig.modifyFlag
        },
        title(){
            const applicationType = this.applicationType
            let name =''
            if(applicationType === ApplicationType.INSPECT){
                name = '检查指导书'
            }else{
                name = '作业指导书'
            }

            if(this.type === ModelType.ADD){
                return `新增${name}`
            }
            return `查看${name}`
        },
        productId(){
            return this.dataForm.id
        },
        hasRoutingLine(){
            console.log(this.dataForm.routingId,this.dataForm)
            return notEmpty(this.dataForm.routingId)
        },
        hasProduct(){
            console.log(this.dataForm.productsCode,this.dataForm)
            return notEmpty(this.dataForm.productsCode)
        }
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

::v-deep .el-collapse-item__content {
    padding-bottom: 0px
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
    max-height: 500px;
    overflow-y: auto;
}
</style>
