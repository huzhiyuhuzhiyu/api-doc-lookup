<script>
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/component/FileUploadDrop.vue";
import {ApprovalStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import { isEmpty, notEmpty} from '@/utils';
import {detailProcess} from "@/api/basicData/processSettingss";
import {getFilePreviewUrl,filterArr} from "@/views/esop/utils/utils";
import {detailBimFileUpload, switchEnableMark} from "@/api/esop/fileUpload/workinginstruction";
import chooseProductParams from "@/views/esop/fileUpload/workinginstruction/utils/chooseProductParams";
import BasicInfoMixin from "@/views/esop/fileUpload/workinginstruction/component/BasicInfoMixin";
import CheckVersionCountDialog from "@/views/esop/fileUpload/workinginstruction/component/CheckVersionCountDialog .vue";
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import {getcategoryTree, getCooperativeData, getOrderFiledMap, getPartnerOrProductData} from '@/api/basicData';

function getOriginActiveNames(){
    return ['basicInfo']
}

export default {
    name: "HasProcessBasicInfo" ,
    components: {CheckVersionCountDialog, FileUploadDrop},
    data(){
        return {
            formLoading: false,
            activeNames:['basicInfo','normalUpload'],
            dataForm:{
                projectId:"",
                applicationType:'',
                cooperativePartnerName:'',
                cooperativePartnerId:'',
                cooperativePartnerCode:'',
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
                enableMark:false,
                versionCount:0,
            },
            dataRule:Object.freeze({
                version: [
                    { required: true, message: '请输入版本号', trigger: 'change' }
                ],
                drawingNo: [
                    { required: true, message: '请选择产品信息', trigger: 'change' },
                ],
                cooperativePartnerName:[
                    { required: this.isCustomerProductPage, message: '请选择客户', trigger: 'change' }
                ],
                projectId:[
                    { required: true, message: '请选择所属项目', trigger: 'change' }
                ]
            }),
            routingName:'',
            routingLineList:[],
            processFileList:{},
            normalFileList:[],
            processUploadVOMap:new Map(),
            processUploadProcessId2ItemsMap:new Map(),
            codeConfig:{},
            PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'customer' } },
            // 供应商 列表
            PartnerTableItems: [
                { prop: 'name', label: '客户名称' },
                { prop: 'code', label: '客户编码' },
                { prop: 'partnerCategoryIdText', label: '所属分类' }
            ],
            // 供应商搜索条件
            PartnerTableSearchList: [
                { prop: 'name', label: '客户名称', type: 'input' },
                { prop: 'code', label: '客户编码', type: 'input' },
                { prop: 'taxId', label: '税号', type: 'input' }
            ],
            // 供应商请求参数
            PartnerListRequestObj: {
                code: '',
                name: '',
                taxId: '',
                pageNum: 1,
                pageSize: 20,
                partnerCategoryId: '',
                type: 'customer',
                orderItems: [
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            },
            customerProductListRequestObj: {
                partnerType: "customer",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                customerProductNo: "",
                drawingNo: "",
                partnerName: "",
                partnerId:"",
                pageNum: 1,
                pageSize: 20,
            },
            customerProductListMethod:getPartnerOrProductData,
            customerProductProductTableItems:[],
            customerProductSearchList:[],
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
        treeNodeClick(data, node, listQuery) {
            if (listQuery.partnerCategoryId === data.id) return listQuery
            listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
            listQuery.classAttribute = data.classAttribute
            return listQuery
        },
        supplierdata(id, data) {
            this.$nextTick(() => {
                this.$refs['dataForm'].validateField('cooperativePartnerName')
            })
            if (data.length === 0) {
                this.dataForm.cooperativePartnerName = ''
                this.dataForm.cooperativePartnerCode = ''
                this.dataForm.cooperativePartnerId = ''
            } else {
                this.dataForm.cooperativePartnerName = data[0].name
                this.dataForm.cooperativePartnerCode = data[0].all.code
                this.dataForm.cooperativePartnerId = data[0].id
            }
        },
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
                if(this.dataForm.versionCount === null){
                    this.dataForm.versionCount = 0
                }
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
        async beforeChooseProduct(){
            if(this.isCustomerProductPage   ){
                if(isEmpty(this.dataForm.cooperativePartnerId)){
                    this.$refs.dataForm.validateField('cooperativePartnerName')
                    this.$message.warning('请先选择客户')
                    return false
                }

              const [projectNameFlag,abProjectFlag,filedFlags]=await Promise.all(
                  [
                      this.jnpf.getMainUnitFun('product', 'enable_productName'),
                      this.jnpf.getMainUnitFun( 'system', 'project'),
                      this.getOrderFiledMap()
                  ])
                const nameFlag = projectNameFlag === '1'
                const projectFlag = abProjectFlag === '1'

                const {
                    sealingCoverTypingFlag,
                    accuracyLevelFlag,
                    vibrationLevelFlag,
                    oilFlag,
                    oilQuantityFlag,
                    clearanceFlag,
                    packagingMethodFlag,
                    specialRequireFlag,
                    colourFlag,
                    materialFlag,
                    protrusionFlag,
                    preloadFlag,
                } = filedFlags
                this.customerProductListRequestObj ={
                    partnerType: "customer",
                    orderItems: [{
                        asc: false,
                        column: ""
                    }, {
                        asc: false,
                        column: "create_time"
                    }],
                    customerProductNo: "",
                    drawingNo: "",
                    partnerName: "",
                    partnerId:this.dataForm.cooperativePartnerId,
                    pageNum: 1,
                    pageSize: 20,
                }
                this.customerProductSearchList = filterArr(  [
                     { prop: 'partnerName', label: '客户名称',type: 'input' },
                     { prop: 'customerProductNo', label: '客户料号' ,type: 'input'},
                     { prop: 'productName', label: '产品名称',type: 'input',visible:nameFlag },
                     { prop: 'drawingNo', label: '品名规格',type: 'input' }
                 ])

                this.customerProductProductTableItems = filterArr( [
                        { prop: 'partnerName', label: '客户名称', fixed: 'left' },
                        { prop: 'partnerCode', label: '客户编码', fixed: 'left' },
                        { prop: 'customerProductNo', label: '客户料号', },
                        { prop: 'productCode', label: '产品编码' },
                        { prop: 'productName', label: '产品名称',visible:nameFlag },
                        { prop: 'drawingNo', label: '品名规格' },
                        { prop: 'projectName', label: '所属项目',visible:projectFlag },
                        { prop: 'price', label: '销售单价(含税)',width:160 },
                        { prop: 'excludingTaxPrice', label: '销售单价(不含税)',width:160 },
                        { prop: 'dateOrderStart', label: '有效日期起' ,width:160},
                        { prop: 'dateOrderStop', label: '有效日期止' ,width:160},
                        {prop: 'sealingCoverTyping', label: "打字内容",visible: sealingCoverTypingFlag},
                        {prop: 'accuracyLevel', label: "精度等级",visible: accuracyLevelFlag},
                        {prop: 'vibrationLevel', label: "振动等级",visible: vibrationLevelFlag},
                        {prop: 'oil', label: "油脂",visible: oilFlag},
                        {prop: 'oilQuantity', label: "油脂量",visible: oilQuantityFlag},
                        {prop: 'clearance', label: "游隙",visible: clearanceFlag},
                        {prop: 'packagingMethod', label: "包装方式",visible: packagingMethodFlag},
                        {prop: 'specialRequire', label: "特殊要求",visible: specialRequireFlag},
                        {prop: 'material', label: "保持架材质",visible: materialFlag},
                        {prop: 'colour', label: "密封盖颜色",visible: colourFlag},
                        {prop: 'protrusion', label: "凸出量",visible: protrusionFlag},
                        {prop: 'preload', label: "预负荷",visible: preloadFlag},
                        {prop: 'specialRequire', label: "特殊要求"},
                        {prop: 'remark', label: "备注"},
                        {prop: 'createTime', label: '创建时间'},
                    ])

            }
            return true
        },
       async getOrderFiledMap() {
         const [{data:data1},{data:data2}] =   await Promise.all([
                getOrderFiledMap('sale'),
                getOrderFiledMap('gobal')
            ])

        return {
                sealingCoverTypingFlag : !!+data1.sealingCoverTyping,
                accuracyLevelFlag : !!+data1.accuracyLevel,
                vibrationLevelFlag : !!+data1.vibrationLevel,
                oilFlag : !!+data1.oil,
                oilQuantityFlag : !!+data1.oilQuantity,
                clearanceFlag : !!+data1.clearance,
                packagingMethodFlag : !!+data1.packagingMethod,
                specialRequireFlag : !!+data1.specialRequire,
                colourFlag : !!+data1.colour,
                materialFlag : !!+data1.material,
                protrusionFlag : !!+data2.protrusion,
                preloadFlag : !!+data2.preload,
            }
        },
        getCooperativeData,
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
        customerProductSubmitCustomerProduct(selectedIds, [{all}]){
            this.dataForm.productsId = all.productsId
            this.dataForm.drawingNo = all.drawingNo
            this.dataForm.productsCode = all.productCode
            this.dataForm.productCategoryId = ""
            this.dataForm.productsCategoryName =  all.productsCategoryName
        }
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
                                    <el-col :span="6" v-if="abProjectSwitchVisible">
                                        <el-form-item label="所属项目" prop="projectId" required>
                                            <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" style="width: 100%;"
                                                       :disabled="!abIsCommonUser || isView">
                                                <el-option v-for="(item, index) in abProjectList" :key="index" :label="item.label"
                                                           :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" v-if="isNotCustomerProductPage">
                                        <el-form-item label="工艺路线名称">
                                            <el-input readonly :placeholder="dataForm.routingName" v-model="dataForm.routingName"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <template v-if="!isNoProductPage">

                                        <el-col :span="6" v-if="isCustomerProductPage">
                                                <el-form-item label="客户名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                                                    <ComSelect-page clearable :treeNodeClick="treeNodeClick" :isdisabled="isView"
                                                                    :value="dataForm.cooperativePartnerName" ref="ComSelect-page" @change="supplierdata"
                                                                    :tableItems="PartnerTableItems" :placeholder="'请选择客戶'" title="选择客戶" treeTitle="客戶分类"
                                                                    :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                                                                    :listRequestObj="PartnerListRequestObj" :paramsObj="{}"
                                                                    :searchList="PartnerTableSearchList" />
                                                </el-form-item>
                                        </el-col>
                                        <el-col v-else :span="hasEnableMark ? 2 : 6" >
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
                                        <el-col :span="4" v-if="hasEnableMark">
                                            <el-form @submit.prevent :disabled="isView" style="padding-top: 0">
                                                <el-form-item label="启用状态">
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

                                    </template>


                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="品名规格" prop="drawingNo">
                                                <ComSelect-page
                                                    v-if="isNotCustomerProductPage"
                                                    placeholder="请选择品名规格"
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
                                                <ComSelect-page
                                                    v-else
                                                    placeholder="请选择品名规格"
                                                    :before-open="beforeChooseProduct"
                                                    ref="ComSelect-page"
                                                    v-model="dataForm.drawingNo"
                                                    @change="customerProductSubmitCustomerProduct"
                                                    :tableItems="customerProductProductTableItems"
                                                    :renderTree="false"
                                                    dialogTitle="选择产品"
                                                    title="选择产品"
                                                    :listMethod="customerProductListMethod"
                                                    :listRequestObj="customerProductListRequestObj"
                                                    :searchList="customerProductSearchList"
                                                    :elementShow="true"  />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="产品编码">
                                            <el-input  placeholder="请选择产品编码" :value="dataForm.productsCode" readonly/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="产品分类">
                                            <el-input  :value="dataForm.productsCategoryName" placeholder="请选择产品分类" readonly/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" v-if="!isFileUploadPage && !isNoProductPage">
                                        <el-form @submit.prevent   style="padding-top: 0;" >
                                            <el-form-item label="关联版本数">
                                                <el-input  readonly @click.native="versionCountHandler" v-model="dataForm.versionCount" class="pointer versionCount"/>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                    <el-col :span="6"  v-if="!isNoProductPage">
                                        <el-form-item label="版本号" prop="version">
                                            <el-input v-model="dataForm.version" placeholder="请输入版本号"  />
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
                                    :isFileUploadPage="isFileUploadPage"
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
                                :isFileUploadPage="isFileUploadPage"
                                :disabled="isView"
                                class="fileUpload"
                                v-model="normalFileList"></FileUploadDrop>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <CheckVersionCountDialog :current-id="dataForm.id" :applicationType="dataForm.applicationType" v-if="versionCountVisible" :visible.sync="versionCountVisible"  :search-drawing-no="dataForm.drawingNo"></CheckVersionCountDialog>
        </div>
    </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep .versionCount .el-input__inner{
    color: #409eff;
    cursor: pointer !important;
    background-color: #F5F7FA;
    border-color: #E4E7ED;
}
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
