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

            <el-tabs v-if="!approvalFlag"  v-model="activeName"  >
                <el-tab-pane label="基础信息" name="info">

                    <div class="contain">
                        <div class="JNPF-common-layout">
                            <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                                <div class="JNPF-common-layout-main JNPF-flex-main">
                                    <el-collapse v-model="activeNames">
                                        <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                            <el-row>
                                                <el-form label-position="top" :model="dataForm" ref="dataForm" :disabled="isView"  :rules="dataRule">
                                                    <el-row :gutter="10">
                                                        <el-col :span="6">
                                                            <el-form-item label="上传单编码">
                                                                <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                                            </el-form-item>

                                                        </el-col>
                                                        <el-col :span="6">
                                                            <el-form-item label="图文档分类" prop="categoryName">
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
                                                            <el-form-item label="版本号" prop="version">
                                                                <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
                                                            </el-form-item>
                                                        </el-col>


                                                    </el-row>
                                                    <el-row :gutter="10">
                                                        <el-col :span="24" style="margin-top: -19px">
                                                            <div v-if="!isView">
                                                                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                                                                           icon="el-icon-plus" :disabled="isView"
                                                                           @click="chooseProduct">选择产品</el-button>|
                                                                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                                                                           icon="el-icon-plus" :disabled="isView" @click="importProductFun()"
                                                                         >导入产品 </el-button>|
                                                                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                                                                           :disabled="isView" icon="el-icon-delete"
                                                                           @click="batchDelete">批量删除</el-button>

                                                            </div>
                                                            <div style="height:216px;display:flex;" ref="boxresiz" >

                                                                <el-table ref="product" :data="productData"   @selection-change="handeleProductInfoData"  :fixedNO="false" border height="100%" :key="191"
                                                                          style="width: 100%;height:100%">
                                                                    <el-table-column type="selection" width="55" fixed="left" :key="2">
                                                                    </el-table-column>
                                                                    <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>

                                                                    <el-table-column prop="code" label="产品编码" min-width="150"  sortable="custom"></el-table-column>
                                                                    <el-table-column prop="name" label="产品名称" min-width="150"  sortable="custom"></el-table-column>
                                                                    <el-table-column prop="drawingNo" label="产品图号" min-width="150" sortable="custom"></el-table-column>

                                                                    <el-table-column prop="remark" label="备注" width="200" :key="128">

                                                                    </el-table-column>
                                                                    <el-table-column label="操作" width="120" fixed="right" :key="15">
                                                                        <template slot-scope="scope">

                                                                            <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                                                                        </template>
                                                                    </el-table-column>

                                                                </el-table>

                                                            </div>
                                                        </el-col>
                                                    </el-row>

                                                </el-form>
                                            </el-row>
                                        </el-collapse-item>
                                        <el-collapse-item  v-if="hasFileCategory"  title="文件上传" name="normalUpload">
                                            <div class="collapse-wrapper">
                                                <FileUploadDrop :disabled="isView" :grid-height="'202px'" class="fileUpload" v-model="normalFileList"></FileUploadDrop>
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
                                        <el-form label-position="top" :model="dataForm" ref="dataForm"  :rules="dataRule" :disabled="isView">
                                            <el-row :gutter="10">
                                                <el-col :span="6">
                                                    <el-form-item label="上传单编码">
                                                        <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                                    </el-form-item>

                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="图文档分类" prop="categoryName">
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
                                                    <el-form-item label="版本号" prop="version">
                                                        <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
                                                    </el-form-item>
                                                </el-col>


                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="24">
                                                    <div v-if="!isView"  style="margin-top: -19px">
                                                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                                                                   icon="el-icon-plus" :disabled="isView"
                                                                   @click="chooseProduct">选择产品</el-button>|
                                                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                                                                   icon="el-icon-plus" :disabled="isView" @click="importProductFun()"
                                                        >导入产品 </el-button>|
                                                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                                                                   :disabled="isView" icon="el-icon-delete"
                                                                   @click="batchDelete">批量删除</el-button>

                                                    </div>
                                                    <div style="height:216px;display:flex;" ref="boxresiz" >

                                                        <el-table ref="product" :data="productData"   @selection-change="handeleProductInfoData"  :fixedNO="false" border height="100%" :key="191"
                                                                  style="width: 100%;height:100%">
                                                            <el-table-column type="selection" width="55" fixed="left" :key="2">
                                                            </el-table-column>
                                                            <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>

                                                            <el-table-column prop="code" label="产品编码" min-width="150"  sortable="custom"></el-table-column>
                                                            <el-table-column prop="name" label="产品名称" min-width="150"  sortable="custom"></el-table-column>
                                                            <el-table-column prop="drawingNo" label="产品图号" min-width="150" sortable="custom"></el-table-column>

                                                            <el-table-column prop="remark" label="备注" width="200" :key="128">

                                                            </el-table-column>
                                                            <el-table-column label="操作" width="120" fixed="right" :key="15">
                                                                <template slot-scope="scope">

                                                                    <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                                                                </template>
                                                            </el-table-column>

                                                        </el-table>

                                                    </div>
                                                </el-col>
                                            </el-row>

                                        </el-form>
                                    </el-row>
                                </el-collapse-item>
                                <el-collapse-item  v-if="hasFileCategory"  title="文件上传" name="normalUpload">
                                    <div class="collapse-wrapper">
                                        <FileUploadDrop :disabled="isView" :grid-height="'202px'" class="fileUpload" v-model="normalFileList"></FileUploadDrop>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
                       :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
                <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false"
                           :limit="1"   drag   :on-change="handleFileChange"
                           ref="uploadRef">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text"><em>点击选取文件上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
                                                                                             icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

                </el-upload>

                <span slot="footer" class="dialog-footer">
            <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" @click="submit()">
              提交</el-button>
          </span>
            </el-dialog>
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
                multiple
                :ids="[]"
                :listRequestObj="ProductListRequestObj"
                :searchList="ProductTableSearchList"
                :params-obj="{}"
                :elementShow="false"  />
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
import {getcategoryTree as getProductCategoryTree} from "@/api/basicData/materialSettings";
import FlowMixin from "@/mixins/generator/flowMixin";
import {FlowCode} from "@/views/esop/utils/constants";
import FinishSubmit from "@/views/esop/fileUpload/workinginstruction/old/finishSubmit.vue";

export default {
    components: {FinishSubmit, recordList, Process, FileUploadDrop },
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
            default: FlowCode.IMAGE
        },
    },
    data() {
        return {
            isFinish: false,
            pageLoading:false,
            selectRows:[],
            productsIdsMap: new Map(),
            file: null,
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
            getProductCategoryTree,
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
            dataRule: {
                categoryName: [
                    { required: true, message: '请选择图文档分类', trigger: 'change' }
                ],
                version: [
                    { required: true, message: '请输入版本号', trigger: 'change' },
                ],
            },
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
                version:'',
                documentStatus:'',
            },
            ProductMethodArr: {
                method: getProductCategoryTree,
                requestObj: { classAttribute: "" }
            }, // 产品选择弹出框树状列表
            flowTaskOperatorRecordList: [],
            endTime: 0,
            cacheFileUploadList:[],
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
    mixins: [busFlow,FlowMixin],
    async created(){
       this.initPage()
    },
    methods: {
        async initPage(){
            if(!this.id) {
                this.getBusInfo(this.flowCode)
                return this.fetchData()
            }
            this.fetchData(false)
            await this.getDetail(this.id)
            const isDraft = this.dataForm.documentStatus === DocumentStatus.DRAFT
            if(isDraft){
                this.getBusInfo(this.flowCode)
            }else{
                this.dataForm.approvalFlag && this.getFlowDetail(this.id)
            }
        },
        recreate(){
            this.dataForm = {
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
                version:'',
                documentStatus:'',
            }
            this.normalFileList = []
            this.productData = []
            this.activeNames = getOriginActiveNames()
            this.initPage()
            this.isFinish = false
        },
        handeleProductInfoData(val) {
            this.selectRows = val
        },
        batchDelete() {
            // 遍历选中的行的数据
            if (this.selectRows.length < 1) {
                this.$message({
                    message: "请选择你要删除的数据",
                    type: "error",
                    duration: 1500,
                })
            }
            for (let i = 0; i < this.selectRows.length; i++) {
                const row = this.selectRows[i];
                const index = this.productData.indexOf(row);
                if (index > -1) {
                    this.productData.splice(index, 1); // 从tableData中删除选中的行
                }
            }
            this.selectRows = []; // 清空选中的行的数据
        },
        // 单个删除
        handleDel(data) {
            this.productData.splice(data.$index, 1)
        },
        downLoadTemplate(){
            downloadFile()
        },
        submit() {
            console.log(this.fileList);
            this.UploadProduct(this.file)
        },
        UploadProduct(){},
        handleFileChange(file) {
            console.log("所选文件:", file);
            this.file = file.raw
        },
        importProductFun() {
            // 导入产品，获取数据渲染
            if (this.productData.length) {
                this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
                    this.uploadVisib = true

                    // this.$refs.UploadProduct.$el.querySelector('input').click()
                }).catch(() => { })
            } else {
                this.uploadVisib = true
            }
        },
        onOrganizeChange(cid,[{name,id}]){
            this.dataForm.categoryName = name
            this.dataForm.categoryId = id
        },

        submitCustomerProduct(selectedIds,selectedProducts){
           let flag =false
           selectedProducts.forEach(({all})=>{
               if(this.productsIdsMap.has(all.id)){
                   return flag = true
               }
               this.productData.unshift(all)
               this.productsIdsMap.set(all.id,all)
           })
            flag && this.$message.info('您选择的产品中有已经选择的产品，已为您自动过滤')
        },
        async getDetail(id){

            this.pageLoading = true

            try {
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

                this.productData = data.products || []
            }catch (e) {

            }finally {
                this.pageLoading = false
            }

        },
        goBack(){
            return this.$emit('back')
        },
        async handleConfirm(type){
            const valid = await this.$refs.dataForm.validate()
            if(!valid){
                return
            }
            const isSubmit = type === DocumentStatus.SUBMIT
            // if(isSubmit){
            //     if(this.normalFileList.length === 0){
            //         return this.$message.warning('请上传文件，或先保存为草稿')
            //     }
            // }
            const params = this.getSaveData(type)
            const fn = this.isAdd ? addBimFileUpload : modifyBimFileUpload
            const { data } = await fn(params)
            await this.$message.success('操作成功')
            this.isFinish = true
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
                flowData:this.flowData,
                products: this.productData.map(item=>({
                    fileUploadId: this.dataForm.id,
                    productsId:  item.id
                }))
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
        chooseProduct(){
          if(!this.hasFileCategory){
              return this.$message.warning('请先选择图文档分类')
          }
          this.$refs["ComSelect-page"].openDialog()
        },
        init(id, btnType, approvalFlag){
            console.log(id, btnType, approvalFlag)
            this.isApprovalCheck = approvalFlag
            this.approvalFlag = approvalFlag
            this.normalUploadShow()
            console.log(this.activeNames)
            this.getDetail(id)
        },
    },
    watch:{
        "dataForm.categoryId"(val,val2){
            console.log("dataForm.categoryId",val,val2)
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
        currentFileList(){
            if(this.dataForm.openProcess){
                return Object.keys(this.processFileList).map(key=>this.processFileList[key]).flat(Infinity)
            }
            return this.normalFileList
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
.JNPF-preview-main{
    overflow: hidden !important;
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
