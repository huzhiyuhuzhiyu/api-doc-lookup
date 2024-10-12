<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form" ref="main">
            <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
                <el-page-header @back="goBack" :content="title" />
                <div class="options" v-if="btnType !== 'look'">
                    <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
                    <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
                    <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>
            <div class="contain">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <el-collapse v-model="activeNames">
                                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                    <el-row>
                                        <el-form label-position="top">
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="产品分类">
                                                        <el-input @click.native="chooseProduct" :value="categoryName" placeholder="请选择产品分类" readonly/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="产品信息">
                                                        <el-input @click.native="chooseProduct" placeholder="请选择品名规格" :value="productName" style="width: 50%" readonly/>
                                                        <el-input @click.native="chooseProduct" placeholder="请选择产品编码" :value="productCode"  style="margin-left: 10px;width: calc(50% - 10px)" readonly/>
                                                    </el-form-item>
                                                </el-col>

                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item v-if="needProcess" label="工艺路线名称">
                                                        <el-input readonly v-model="routingName"></el-input>
                                                    </el-form-item>
                                                    <div  style="visibility: hidden">
                                                        a
                                                    </div>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="按工序上传">
                                                        <div style="height: 32px;display: flex;align-items: center">
                                                            <el-tooltip :content="hasRoutingLine ? '开启后可为每一道工序上传作业指导书':'该产品未设置工艺路线，请设置工艺路线后再开启'" placement="top-start">
                                                                <el-switch :disabled="!hasRoutingLine" @change="toggleProcessHandler" v-model="needProcess"/>
                                                            </el-tooltip>
                                                        </div>
                                                    </el-form-item>
                                                </el-col>

                                            </el-row>
                                        </el-form>
                                    </el-row>
                                </el-collapse-item>
                                <template v-if="needProcess && routingLineList.length > 0" >
                                    <el-collapse-item v-for="item in routingLineList"  :key="item.processCode"  :title="item.processName" :name="item.processCode">
                                        <div class="collapse-wrapper">
                                            <FileUploadDrop class="fileUpload" :key="item.processCode" v-model="processFileList[item.processCode]"></FileUploadDrop>
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
            <ChooseProductDialog @submit="chooseProductSubmitHandler" v-if="chooseProductVisible" :visible.sync="chooseProductVisible"></ChooseProductDialog>
        </div>
    </transition>
</template>

<script>

import {isEmpty, notEmpty, trim} from "@/utils";
import {detailProcess} from "@/api/basicData/processSettingss";
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/FileUploadDrop.vue";
import {ModelType} from "@/views/esop/fileUpload/workinginstruction/constant";
import {getBusinessFlowDetail, getBusinessFlowInfo} from "@/api/workFlow/FlowEngine";
import ChooseProductDialog from "@/views/esop/fileUpload/workinginstruction/ChooseProductDialog.vue";
import {addBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";
function getOriginActiveNames(){
    return ['basicInfo']
}
export default {
    components: {ChooseProductDialog, FileUploadDrop},
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
            chooseProductVisible: false,
            activeNames:['basicInfo','normalUpload'],
            activeName: 'jcInfo',
            btnType: 'add',
            btnLoading: false,
            formLoading: false,
            needProcess: false,
            routingId:'',
            routingName:'',
            routingLineList:[],
            productObj:{},
            normalFileList:[],
            normalDetailList:[],
            processDetailList:[],
            processFileList:{},
        }
    },
    created(){
        if(this.type === ModelType.EDIT) {
            this.getDetail()
        }
    },
    methods: {
        getDetail(){

        },
        goBack(){
            this.$emit('back')
        },
        async handleConfirm(type){
           const { data } = await addBimFileUpload(this.getAddData(type))
            console.log(data)

        },
        getAddData(type){
            return {
                bimFileUpload:{
                    applicationType:this.applicationType,
                    categoryId:this.productObj.productCategoryId,
                    documentStatus:type,
                    openProcess: +this.needProcess,
                    productsId:this.productId,
                    routingId:this.routingId,
                },
                bimFileUploadLineList:this.getUploadDetailList(),
                approvalFlag:false
            }
        },
        getUploadDetailList(){
            if(!this.needProcess){
                return this.normalFileList.map(item=>{
                    return {
                        documentId:item.id,
                    }
                })
            }
            return []

        },
        getModifyData(type){},
        chooseProductSubmitHandler({productId, productObj, hideModel}){
            if(!productId){
                this.$message.info('请您先选择产品再提交')
                return
            }
            this.productObj = productObj
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
          this.getProcessByCode()
        },
        async getProcessByCode(){
            if(isEmpty(this.productId)){
                this.routingLineList = []
                return this.routingId = ''
            }
            const { routingId }= this.productObj
            this.routingId = routingId
            if(isEmpty(routingId)){
                this.routingLineList = []
                return this.$message.warning('该产品暂未设置工艺路线')
            }
            await this.getProcessLine()
        },
        async getProcessLine(){
            const { data }= await detailProcess(this.routingId)

            this.routingName = data.routing.name
            this.routingLineList = data.routingLineList
            const processCodeList = []
            data.routingLineList.forEach(item=>{
                processCodeList.push(item.processCode)
                this.$set(this.processFileList,item.processCode,[])
            })
            if(this.routingLineList.length > 0){
               this.activeNames = getOriginActiveNames().concat(processCodeList)
            }
            console.log(this.processFileList)
        },
        getBusInfo(){
            getBusinessFlowInfo('b048').then(res=>{
                if (res.data){
                    if (res.data.enabledMark){
                        this.flowData = res.data
                        this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
                        this.dataForm.approvalFlag = res.data.enabledMark
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
        productCode(val){
            if(isEmpty(val)){
                this.needProcess = false
                this.activeNames = getOriginActiveNames()
                return
            }
            if(!this.needProcess){
               return  this.normalUploadShow()
            }
            if(!this.hasRoutingLine){
                this.$message.info('该产品暂未设置工艺路线')
                this.normalUploadShow()
                return this.needProcess = false
            }
            this.getProcessByCode()
        }
    },
    computed:{
        title(){
            if(this.type === ModelType.ADD){
                return '新增作业指导书'
            }
            return '查看作业指导书'
        },
        categoryName(){
            return this.productObj.productCategoryName
        },
        productName(){
            return this.productObj.name
        },
        productCode() {
            return this.productObj.code
        },
        productId(){
            return this.productObj.id
        },
        hasRoutingLine(){
            return notEmpty(this.productObj.routingId)
        },
        hasProduct(){
            return notEmpty(this.productCode)
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
