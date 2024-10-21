<script>
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/component/FileUploadDrop.vue";
import {ApprovalStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {isEmpty, notEmpty} from "@/utils";
import {detailProcess} from "@/api/basicData/processSettingss";
import {getFilePreviewUrl} from "@/views/esop/utils/utils";
import {detailBimFileUpload, switchEnableMark} from "@/api/esop/fileUpload/workinginstruction";
import chooseProductParams from "@/views/esop/fileUpload/workinginstruction/utils/chooseProductParams";
import BasicInfoMixin from "@/views/esop/fileUpload/workinginstruction/component/BasicInfoMixin";


function getOriginActiveNames(){
    return ['basicInfo']
}

export default {
    name: "HasProcessBasicInfo" ,
    components: {FileUploadDrop},
    data(){
        return {
            formLoading: false,
            activeNames:['basicInfo','normalUpload'],
            dataForm:{
                applicationType:'',
                approvalStatus:'',
                enabledMark:false,
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
                version:'',
                documentStatus:'',
                enableMark:false
            },
            dataRule:Object.freeze({
                version: [
                    { required: true, message: '请输入版本号', trigger: 'change' }
                ],
                drawingNo: [
                    { required: true, message: '请选择产品信息', trigger: 'change' },
                ],
            }),
            routingName:'',
            routingLineList:[],
            processFileList:{},
            normalFileList:[],
            processUploadVOMap:new Map(),
            processUploadProcessId2ItemsMap:new Map(),
            codeConfig:{},
            ...chooseProductParams()
        }
    },
    computed:{
        hasRoutingLine(){
            return notEmpty(this.dataForm.routingId)
        },
        hasProduct(){
            return notEmpty(this.dataForm.productsId)
        },

        needProcess(){
            return this.dataForm.openProcess
        },

    },
    mixins:[BasicInfoMixin],
    methods:{
        toggleProcessHandler(val){
            if(!val){
                return  this.normalUploadShow()
            }
            this.getProcessByCode()
        },
        normalUploadShow(){
            this.activeNames = getOriginActiveNames().concat('normalUpload')
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
        changeRoutingName(name){
            this.dataForm.routingName = isEmpty(name)
                ? (this.hasProduct
                    ? '暂未设置工艺路线'
                    : '' )
                : name
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
                                filePath,
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
        async getDetail(data){
                Object.keys(this.dataForm).forEach(key=>{
                    this.dataForm[key] = data[key]
                })
                this.changeRoutingName(data.routingName)

                if(data.openProcess){
                    return await this.getProcessByCode(data.bimFileUploadLineVOList)
                }
                this.changeProductsCode(data.productsCode)
                this.normalFileList = data.bimFileUploadLineVOList.map(item=>{
                    return {
                        name: item.documentName,
                        fileSize: item.fileSize,
                        filename: item.documentName,
                        id: item.documentId,
                        url: getFilePreviewUrl(item.filePath),
                        filePath: item.filePath,
                        processUploadId: item.id,
                    }
                })
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
        changeProductsCode(val){
            this.dataForm.productsCode = val
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
        getCurrentFileList(){
            if(this.needProcess){
                return Object.keys(this.processFileList).map(key=>this.processFileList[key]).flat(Infinity)
            }
            return this.normalFileList
        },
        submitCustomerProduct(selectedIds, [{all:{id,code,drawingNo,productCategoryId,productCategoryName,routingId,routingName}}]){
            this.normalFileList = []
            this.processFileList = {}
            this.dataForm.productsId = id
            this.dataForm.drawingNo = drawingNo
            this.dataForm.productCategoryId = productCategoryId
            this.dataForm.productsCategoryName = productCategoryName
            this.dataForm.routingId = routingId
            this.changeRoutingName(routingName)
            this.changeProductsCode(code)
        },
    },

}
</script>

<template>
    <div class="contain">
        <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                        <el-row>
                            <el-form label-position="top"  ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="isView || !isFileUpload">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="上传单编码">
                                            <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="版本号" prop="version">
                                            <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="工艺路线名称">
                                            <el-input readonly :placeholder="dataForm.routingName" v-model="dataForm.routingName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="hasEnableMark ?3 : 6">
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
                                    <el-col :span="3" v-if="hasEnableMark">
                                        <el-form @submit.prevent :disabled="isView">
                                            <el-form-item label="是否启用">
                                                <div style="height: 32px;display: flex;align-items: center">
                                                    <el-switch
                                                        :active-value="true"
                                                        :inactive-value="false"
                                                        :disabled="false"
                                                        @change="toggleEnableMarkHandler"
                                                        v-model="dataForm.enabledMark"/>
                                                </div>
                                            </el-form-item>
                                        </el-form>

                                    </el-col>

                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12">
                                        <el-form-item label="产品信息" prop="drawingNo">
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
                                                    :methodArr="methodArr"
                                                    :listMethod="listMethod"
                                                    :listRequestObj="listRequestObj"
                                                    :searchList="searchList"
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
                                <FileUploadDrop
                                    :isFileTrashPage="isFileTrashPage"
                                    :isFileManagementPage="isFileManagementPage"
                                    :isFileUpload="isFileUpload"
                                    :disabled="isView"
                                    class="fileUpload"
                                    :key="item.processId"
                                    v-model="processFileList[item.processId]"></FileUploadDrop>
                            </div>
                        </el-collapse-item>
                    </template>
                    <el-collapse-item  v-if="hasProduct && !needProcess"  title="文件上传" name="normalUpload">
                        <div class="collapse-wrapper">
                            <FileUploadDrop
                                :isFileTrashPage="isFileTrashPage"
                                :isFileManagementPage="isFileManagementPage"
                                :isFileUpload="isFileUpload"
                                :disabled="isView"
                                class="fileUpload"
                                v-model="normalFileList"></FileUploadDrop>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
    </div>
</template>

<style scoped lang="scss">
.contain {
    position: relative;
    height: calc(100% - 47px);
    overflow-y: auto;
}
::v-deep .JNPF-common-layout-main.JNPF-flex-main {
    padding: 0 10px 10px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
    overflow: auto;
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
.collapse-wrapper{
    padding: 10px;
    max-height: 500px;
    overflow-y: auto;
    min-height: 280px;
}
</style>
