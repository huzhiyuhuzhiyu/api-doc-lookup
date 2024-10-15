<template>
    <transition name="el-zoom-in-center">

        <div class="JNPF-preview-main org-form" ref="main">
            <div

                :class="['JNPF-common-page-header', isView ? 'noButtons' : '']"  v-if="!approvalFlag">
                <el-page-header @back="goBack('back')" :content="title" />
                <div class="options" v-if="!isView">
                    <el-button type="success" :loading="btnLoading" @click="handleConfirm(DocumentStatus.DRAFT)">保存草稿</el-button>
                    <el-button type="primary" :loading="btnLoading" @click="handleConfirm(DocumentStatus.SUBMIT)">保存并提交</el-button>
                    <el-button @click="goBack('cancel')">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>

            <el-tabs v-if="!approvalFlag"  v-model="activeName"  >
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
                                                        <el-col :span="6">
                                                            <el-form-item label="上传单编码">
                                                                <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="6">
                                                            <el-form-item label="版本号" >
                                                                <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="6">
                                                            <el-form-item label="工艺路线名称">
                                                                <el-input readonly :placeholder="dataForm.routingName" v-model="dataForm.routingName"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="6">
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
                                                    <el-row :gutter="10">
                                                        <el-col :span="12">
                                                            <el-form-item label="产品信息" >
                                                                <div class="width-full flex-row">
                                                                    <ComSelect-page
                                                                        style="width: 50%"
                                                                        ref="ComSelect-page"
                                                                        v-model="dataForm.drawingNo"
                                                                        @change="submitCustomerProduct"
                                                                        :tableItems="ProductTableItems"
                                                                        dialogTitle="选择产品"
                                                                        treeTitle="物料分类"
                                                                        title="选择产品"
                                                                        :methodArr="ProductMethodArr"
                                                                        :listMethod="getProductList"
                                                                        :listRequestObj="ProductListRequestObj"
                                                                        :searchList="ProductTableSearchList"
                                                                        :elementShow="true"  />
                                                                    <el-input @click.native="chooseProduct" placeholder="请选择产品编码" :value="dataForm.productsCode"  style="margin-left: 10px;width: calc(50% - 10px)" readonly/>
                                                                </div>

                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="产品分类">
                                                                <el-input @click.native="chooseProduct" :value="dataForm.productsCategoryName" placeholder="请选择产品分类" readonly/>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>

                                                </el-form>
                                            </el-row>
                                        </el-collapse-item>
                                        <template v-if="needProcess && routingLineList.length > 0" >
                                            <el-collapse-item v-for="item in routingLineList"  :key="item.processId"  :title="item.processName" :name="item.processId">
                                                <div class="collapse-wrapper">
                                                    <FileUploadDrop  :disabled="isView" class="fileUpload" :key="item.processId" v-model="processFileList[item.processId]"></FileUploadDrop>
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
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                    <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
                <el-tab-pane v-if="isView" label="流转记录" name="transferList">
                    <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
            </el-tabs>
            <div v-if="approvalFlag" class="contain">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <el-collapse v-model="activeNames">
                                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                    <el-row>
                                        <el-form label-position="top" :model="dataForm" :disabled="isView" ref="dataForm">
                                            <el-row :gutter="10">
                                                <el-col :span="6">
                                                    <el-form-item label="上传单编码">
                                                        <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="版本号" >
                                                        <el-input    v-model="dataForm.version" placeholder="请输入版本号"  />
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="工艺路线名称">
                                                        <el-input readonly :placeholder="dataForm.routingName" v-model="dataForm.routingName"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
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
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="产品信息" >
                                                        <div class="width-full flex-row">
                                                            <ComSelect-page
                                                                style="width: 50%"
                                                                ref="ComSelect-page"
                                                                v-model="dataForm.drawingNo"
                                                                @change="submitCustomerProduct"
                                                                :tableItems="ProductTableItems"
                                                                dialogTitle="选择产品"
                                                                :disabled="isView"
                                                                treeTitle="物料分类"
                                                                title="选择产品"
                                                                :methodArr="ProductMethodArr"
                                                                :listMethod="getProductList"
                                                                :listRequestObj="ProductListRequestObj"
                                                                :searchList="ProductTableSearchList"
                                                                :elementShow="true"  />
                                                            <el-input @click.native="chooseProduct" placeholder="请选择产品编码" :value="dataForm.productsCode"  style="margin-left: 10px;width: calc(50% - 10px)" readonly/>
                                                        </div>

                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="产品分类">
                                                        <el-input @click.native="chooseProduct" :value="dataForm.productsCategoryName" placeholder="请选择产品分类" readonly/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>

                                        </el-form>
                                    </el-row>
                                </el-collapse-item>
                                <template v-if="needProcess && routingLineList.length > 0" >
                                    <el-collapse-item v-for="item in routingLineList"  :key="item.processId"  :title="item.processName" :name="item.processId">
                                        <div class="collapse-wrapper">
                                            <FileUploadDrop  :disabled="isView" class="fileUpload" :key="item.processId" v-model="processFileList[item.processId]"></FileUploadDrop>
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
import {getFilePreviewUrl} from "@/views/esop/utils/utils";
import {getcooperativeProduct} from "@/api/salesManagement/assemblyOrders";
import {getcategoryTree, getcategoryTree as productTree} from "@/api/basicData/materialSettings";
import {getProductList} from "@/api/basicData/materialFiles";
function getOriginActiveNames(){
    return ['basicInfo']
}


export default {
    components: {recordList, Process, FileUploadDrop},
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
            ProductListRequestObj: {
                classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
                productCategoryId: "",
                code: "",
                name: "",
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                productStatus: "enable",
                pageNum: 1,
                pageSize: 20,
            }, // 产品选择弹出框列表请求参数

            ProductTableSearchList: [
                { prop: "customerProductNo", label: "客户料号", type: 'input' },
                { prop: "drawingNo", label: "品名规格", type: 'input' },
                { prop: "productCode", label: "产品编码", type: 'input' },
            ],
            ProductListRequestObjs: {
                contractId: null,
                customerProductNo: "",
                productCode: "",
                productName: "",
                partnerId: "",
                productStatus: 'enable',
                partnerType: "customer",
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
            },
            getcooperativeProduct,
            ProductTableItems: [
                { prop: 'code', label: '产品编码', fixed: 'left' },
                { prop: 'name', label: '产品名称', fixed: 'left' },
                { prop: 'drawingNo', label: '品名规格' },
                // { prop: 'spec', label: '规格型号' },
                { prop: 'productCategoryName', label: '产品分类' }
            ], // 产品选择弹出框表单展示字段
            productVisible: false,
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
                id:null,
                version:''
            },
            ProductMethodArr: {
                method: getcategoryTree,
                requestObj: { classAttribute: "" }
            }, // 产品选择弹出框树状列表
            flowTaskOperatorRecordList: [],
            endTime: 0,
            cacheFileUploadList:[],
            flowData:{},
            approvalId:'',
            isApprovalCheck:false,
        }
    },
    mixins: [busFlow],
    created(){
        if(this.id) {
            this.dataForm.approvalFlag && this.getFlowDetail(this.id)
            this.fetchData(false)
            this.getDetail(this.id)
        }else{
            this.getBusInfo()
            this.fetchData()
        }
    },
    methods: {
        getProductList,
        submitCustomerProduct(selectedIds, [{all:{id,code,drawingNo,productCategoryId,productCategoryName,routingId,routingName}}]){
            this.normalFileList = []
            this.processFileList = {}
            this.dataForm.productsId = id
            this.dataForm.productsCode = code
            this.dataForm.drawingNo = drawingNo
            this.dataForm.productCategoryId = productCategoryId
            this.dataForm.productsCategoryName = productCategoryName
            this.dataForm.routingId = routingId
            this.changeRoutingName(routingName)

       },
        changeRoutingName(name){
            this.dataForm.routingName = isEmpty(name)
                ? (this.hasProduct
                    ? '暂未设置工艺路线'
                    : '' )
                : name
        },
        async getDetail(id){
            const { data } = await detailBimFileUpload(id)
            this.getDetailJSON = JSON.stringify(data)
            Object.keys(this.dataForm).forEach(key=>{
                this.dataForm[key] = data[key]
            })
            this.changeRoutingName(data.routingName)

            if(data.openProcess){
                this.cacheFileUploadList = data.bimFileUploadLineVOList
               return await this.getProcessByCode(data.bimFileUploadLineVOList)
            }
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
        goBack(){
            return this.$emit('back')
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
        toggleProcessHandler(val){
          if(!val){
              return  this.normalUploadShow()
          }
          this.getProcessByCode(this.cacheFileUploadList)
        },
        async getProcessByCode(fileUploadList){
            if(isEmpty(this.dataForm.productsId)){
                this.routingLineList = []
                this.changeRoutingName()
                return this.dataForm.routingId = ''
            }
            const { routingId }= this.dataForm
            if(isEmpty(routingId)){
                this.routingLineList = []
                this.changeRoutingName()
                return this.$message.warning('该产品暂未设置工艺路线')
            }

            await this.getProcessLine(fileUploadList)
        },
        async getProcessLine(fileUploadList){
            const { data }= await detailProcess(this.dataForm.routingId)
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
            getBusinessFlowInfo(this.flowCode ||'b048').then(res=>{
                if (res.data){
                    if (res.data.enabledMark){
                        this.flowData = res.data
                        this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
                        this.dataForm.approvalFlag = !!res.data.enabledMark
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
        },
        chooseProduct(){
            this.$refs["ComSelect-page"].openDialog()
        },
        init(id, btnType, approvalFlag){
            console.log(id, btnType, approvalFlag)
            this.isApprovalCheck = approvalFlag
            this.approvalFlag = approvalFlag
            this.getDetail(id)
        },
    },
    watch:{
        "dataForm.productsCode"(val){
            if(isEmpty(val)){
                this.dataForm.openProcess = 0
                this.activeNames = getOriginActiveNames()
                return
            }
            if(!this.needProcess){
               return this.normalUploadShow()
            }
            if(!this.hasRoutingLine){
                this.$message.info('该产品暂未设置工艺路线')
                this.normalUploadShow()
                this.dataForm.openProcess = 0
                return
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
            return this.type === ModelType.VIEW || this.isApprovalCheck
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
            return notEmpty(this.dataForm.routingId)
        },
        hasProduct(){
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
