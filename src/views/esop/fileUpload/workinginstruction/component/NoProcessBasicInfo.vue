<script>
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/component/FileUploadDrop.vue";
import {ApplicationType, ApprovalStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {isEmpty, notEmpty} from "@/utils";
import {detailProcess} from "@/api/basicData/processSettingss";
import {getFilePreviewUrl} from "@/views/esop/utils/utils";
import {detailBimFileUpload, switchEnableMark} from "@/api/esop/fileUpload/workinginstruction";
import chooseProductParams from "@/views/esop/fileUpload/workinginstruction/utils/chooseProductParams";

import { getcategoryTree as getFileCategoryTree } from '@/api/basicData/index'
import {FileCategoryType} from "@/views/esop/fileCategoryManagement/constants";
import BasicInfoMixin from "@/views/esop/fileUpload/workinginstruction/component/BasicInfoMixin";
export default {
    name: "NoProcessBasicInfo" ,
    components: {FileUploadDrop},
    data(){
        return {
            getFileCategoryTree,
            formLoading: false,
            activeNames:['basicInfo','normalUpload'],
            dataForm:{
                orderNo:'',
                categoryName:'',
                categoryId:'',
                enabledMark:false,
                approvalStatus:'',
                productsCategoryName:'',
                productCategoryId:'',
                productsId:'',
                drawingNo:'',
                productsCode:'',
                approvalFlag:true,
                id:null,
                version:'',
                documentStatus:'',
                applicationType:''
            },
            dataRule:Object.freeze({
                version: [
                    { required: true, message: '请输入版本号', trigger: 'change' }
                ],
                categoryName: [
                    { required: true, message: '请选择图文档分类', trigger: 'change' },
                ],
            }),
            normalFileList:[],
            codeConfig:{},
            ...chooseProductParams()
        }
    },
    computed:{
        FileCategoryType() {
            return FileCategoryType
        },
        hasCategory(){
            return notEmpty(this.dataForm.categoryId)
        },
        isImage(){
            const applicationType = this.type === ModelType.ADD ? this.applicationType : this.dataForm.applicationType
            return applicationType === ApplicationType.IMAGE
        },
    },
    mixins:[BasicInfoMixin],
    methods:{


        onOrganizeChange(cid,[{name,id}]){
            this.dataForm.categoryName = name
            this.dataForm.categoryId = id
        },
        async getDetail(data){
            Object.keys(this.dataForm).forEach(key=>{
                this.dataForm[key] = data[key]
            })
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
            return this.normalFileList.map(item=>{
                return {
                    documentId:item.id,
                    id : item.processUploadId,
                    fileUploadId:this.dataForm.id
                }
            })
        },

        getCurrentFileList(){
            if(this.needProcess){
                return Object.keys(this.processFileList).map(key=>this.processFileList[key]).flat(Infinity)
            }
            return this.normalFileList
        },
        submitCustomerProduct(selectedIds, [{all:{id,code,drawingNo,productCategoryId,productCategoryName,routingId,routingName}}]){
            this.normalFileList = []
            this.dataForm.productsId = id
            this.dataForm.drawingNo = drawingNo
            this.dataForm.productCategoryId = productCategoryId
            this.dataForm.productsCategoryName = productCategoryName
            this.dataForm.productsCode = code
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
                            <el-form label-position="top"  ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="isView || !isFileUploadPage">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="上传单编码">
                                            <el-input v-model="dataForm.orderNo" placeholder="请输入单号" :disabled="orderNoDisabled" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="图文档分类" prop="categoryName">
                                            <ComSelect-list
                                                :isdisabled="isView"
                                                v-model="dataForm.categoryName"
                                                placeholder="请选择图文档分类" auth
                                                @change="onOrganizeChange"
                                                :title="'选择分类'"
                                                :method="getFileCategoryTree"
                                                :requestObj="{  keyword: '', type: FileCategoryType.IMAGE_DOCUMENT }"
                                                :paramsObj="{}" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="版本号" prop="version">
                                            <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
                                        </el-form-item>
                                    </el-col>
                                    <el-col v-if="hasEnableMark" :span="6">
                                        <el-form @submit.prevent :disabled="isView">
                                            <el-form-item label="是否启用">
                                                <div style="height: 32px;display: flex;align-items: center">
                                                    <el-switch
                                                        :active-value="true"
                                                        :inactive-value="false"
                                                        @change="toggleEnableMarkHandler"
                                                        v-model="dataForm.enabledMark"/>
                                                </div>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>
                                <el-row v-if="isImage" :gutter="10">
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
                    <el-collapse-item  v-if="hasCategory"  title="文件上传" name="normalUpload">
                        <div class="collapse-wrapper">
                            <FileUploadDrop
                                :isFileTrashPage="isFileTrashPage"
                                :isFileManagementPage="isFileManagementPage"
                                :isFileUploadPage="isFileUploadPage"

                                :disabled="isView" class="fileUpload" v-model="normalFileList"></FileUploadDrop>
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
