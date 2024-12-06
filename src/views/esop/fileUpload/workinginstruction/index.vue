<template>
    <div class="JNPF-common-layout" v-loading="!tableFlag">
        <div v-if="!formVisible" class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.superQuery.condition[0].fieldValue" placeholder="品名规格" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-date-picker v-model="createTimeArr" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                            style="width: 100%" start-placeholder="创建开始时间" end-placeholder="创建结束时间" clearable></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="!hasTableTopOpts" :span="6" class="JNPF-common-head-right" style="display:flex;justify-content:flex-end;align-items:center;float: right;line-height: 34px;padding-right: 16px !important;">
                        <el-tooltip content="高级查询" placement="top">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" style="margin-left:12px" @click="superQueryVisibleShow" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" style="margin-left:12px" :underline="false" @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" style="margin-left:12px" :underline="false" @click="initData()" />
                        </el-tooltip>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding: 8px;display: -webkit-box" v-if="hasTableTopOpts">
                    <topOpts @add="addOrUpdateHandle(ModelType.ADD)">
                        <el-button  type="danger" size="mini" v-has="BtnType.batchRemove.enCode" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                    </topOpts>
                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisibleShow" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table
                    v-if="tableFlag"
                    v-loading="listLoading"
                    :data="tableData"
                    :fixedNO="true"
                    @sort-change="sortChange"
                    custom-column
                    enabled-checkbox-plus
                    :hasC="hasTableTopOpts"
                    ref="dataTable" :setColumnDisplayList="columnList">
                    <!--                    <el-table-column prop="orderNo" label="上传单编码" sortable="custom" min-width="150" />-->
                    <template v-if="!isNoProductPage || isImage">
                        <el-table-column prop="drawingNo" label="品名规格" min-width="305" />
                        <el-table-column prop="productsCode" label="产品编码" min-width="120" />
                        <el-table-column prop="productsCategoryName" label="产品分类" width="140" />
                    </template>
                    <template  v-if="isNoProductPage">
                        <el-table-column prop="categoryName" label="文件分类" min-width="120" />
                    </template>
                    <el-table-column prop="projectName" label="所属项目" width="120"  v-if="abProjectSwitchVisible" />
                    <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
                        <template slot-scope="{row}">
                            <el-tag type="warning" v-if="row.documentStatus === 'draft'">草稿</el-tag>
                            <el-tag type="success" v-else-if="row.documentStatus === 'submit'">提交</el-tag>
                            <el-tag type="danger"  v-else-if="row.documentStatus === 'back'">退回</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="version" label="版本号" width="80" v-if="!isNoProductPage" />
                    <el-table-column prop="version" label="版本号" width="80" v-if="!isNoProductPage" />
                    <el-table-column prop="fileCount" label="文件数量" width="120" />
                    <template v-if="!isNoProductPage">
                        <el-table-column prop="versionCount" label="关联版本" width="120"  v-if="(isFileManagementPage || isFileCheckPage)">
                            <template slot-scope="scope">
                                <el-link :underline="false" type="primary" @click="searchVersion(scope.row.drawingNo)">{{scope.row.versionCount}}</el-link>
                            </template>
                        </el-table-column>
                    </template>

                    <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                    <el-table-column prop="createByName" label="创建人" width="100" />
                    <template v-if="!isNoProductPage">
                        <el-table-column prop="status" label="启用状态" width="120" align="center" v-if="(isFileManagementPage || isFileCheckPage)">
                            <template slot-scope="scope">
                                <el-switch @change="changeState(scope.row)" v-model="scope.row.enabledMark" :disabled="isFileCheckPage"
                                           :active-value="true" :inactive-value="false">
                                </el-switch>
                            </template>
                        </el-table-column>
                    </template>

                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts
                                v-if="!isFileCheckPage"
                                :isJudgePer="true"
                                :del-disabled="getDelDisabled(scope)"
                                :edit-disabled="getDelDisabled(scope)"
                                :edit-text="tableOptsEditText"
                                :del-text="tableOptsDelText"
                                :has-del="tableOptsDelShow"
                                @edit="tableOptsEditHandle(ModelType.EDIT,scope.row.id)"
                                @del="handleDel(scope.row.id)">
                                <el-dropdown hide-on-click>
                                                  <span class="el-dropdown-link">
                                                    <el-button type="text" size="mini">
                                                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                                    </el-button>
                                                  </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-if="isFileManagementPage" @click.native="copy2FileUpload(scope.row.id)">
                                            复制
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="addOrUpdateHandle(ModelType.VIEW,scope.row.id)">
                                            查看详情
                                        </el-dropdown-item>

                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                            <el-button v-if="isFileCheckPage" type="text" size="mini" @click="addOrUpdateHandle(ModelType.VIEW,scope.row.id)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData" />
            </div>
        </div>
        <slot name="editForm" :data="this">
            <EditWorkingInstructionUpload
                v-if="formVisible && recreateFlag" @recreate="recreate"
                :flowCode="flowCode"
                :type="uploadType"
                :id.sync="fileUploadId"
                :applicationType="applicationType"
                :isFileManagementPage="isFileManagementPage"
                :isFileTrashPage="isFileTrashPage"
                :isFileUploadPage="isFileUploadPage"
                :page-type="pageType"
                :isFileCheckPage="isFileCheckPage"
                :isNoProductPage="isNoProductPage"
                @back="editBack" />
        </slot>
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
    </div>
</template>

<script>
import {
    uploadDimProductsModel
} from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import JNPFForm from './Form'
import { mapGetters, mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import EditWorkingInstructionUpload from "@/views/esop/fileUpload/workinginstruction/Form.vue";
import {
    addBimFileUpload, backBimFileUpload,
    batchDeleteBimFileUpload,
    deleteBimFileUpload, detailBimFileUpload,
    getBimFileUpload, switchEnableMark
} from "@/api/esop/fileUpload/workinginstruction";
import moment from "moment";
import {
    ApplicationType,
    DocumentStatus,
    FileCheckPageSet,
    FileManagementPageType2FileUploadUrl,
    FileManagePageSet,
    FileTrashPageSet,
    FileUploadPageSet, isModelType,
    ModelType, ORDER_CODE_FILE_UPLOAD,
    PageType,

} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";
import {getQueryConfirm, getSuccessInfo, isEmpty, mapIfNonePutArr, notEmpty, trim} from "@/utils";
import RecreateMixin from "@/views/esop/utils/RecreateMixin";
import {
    BtnType,
    executeQueryTime,
    getTimeForSearchTimeType,
    getUploadFileSaveData,
    isNoProductPage
} from "@/views/esop/utils/utils";
import {getBimRecycleBin, revertBimRecycleBin} from "@/api/esop/fileTrash";
import {getBusinessFlowInfo} from "@/api/workFlow/FlowEngine";
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";



export default {
    components: {EditWorkingInstructionUpload, JNPFForm, ExportForm, SuperQuery },
    name:"FileUploadWorkingInstruction",
    props:{
        pageType:{
            type:String,
            default:PageType.FileUploadWork
        },
        applicationType:{
            type:String,
            default:ApplicationType.WORK
        },
        flowCode:{
            type: String,
            default: FlowCode.WORK
        },
        documentStatus:{
            type:String,
            default:DocumentStatus.DRAFT
        },
        approvalStatus:{
            type:String,
            default:""
        }
    },
    watch:{
        "$route.query.type":{
            immediate:true,
            handler(val){
                if(!this.isFileUploadPage && !this.isFileManagementPage){
                    return
                }
                const type = this.$route.query.type
                if(isModelType(type) && notEmpty(val)){
                    if(type === ModelType.SEARCH){
                        return this.modelTypeSearchHandler(type,this.$route.query)
                    }
                    return this.modelTypeDefaultHandler(type,this.$route.query)
                }
            }
        }
    },
    mixins:[RecreateMixin,AbProjectMixin],
    data() {
        return {
            tableFlag:false,
            recreateFlag: true,
            ModelType,
            uploadType:ModelType.ADD,
            fileUploadId:"",
            tableFormVisible: false,
            exportFormVisible: false,
            columnList: ['remark', 'createByName'],
            createTimeArr: [],
            title: '更多查询',
            visible: false,
            tableData: [],
            listLoading: false,
            listQuery: this.getOriginListQuery(),
            formType:ModelType.ADD,
            total: 0,
            formVisible: false,

            uploadVisib: false,
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: '上传单编码',
                    label: '型号',
                    type: 'orderNo'
                },
                {
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input'
                },

                {
                    prop: 'productsCode',
                    label: '产品编码',
                    type: 'input'
                },
                {
                    prop: 'productsCategoryName',
                    label: '产品分类',
                    type: 'input'
                },

            ],
        }
    },
    computed: {

        isImage(){
            return this.applicationType === ApplicationType.IMAGE
        },
        isNoProductPage(){
            return isNoProductPage(this.applicationType)
        },
        getListFn(){
            if(this.isFileTrashPage){
                return getBimRecycleBin
            }
            return getBimFileUpload
        },
        BtnType() {
            return BtnType
        },
        ...mapGetters(['userInfo']),
        ...mapState('user', ['token']),
        isFileManagementPage(){
            return  FileManagePageSet.has(this.pageType)
        },
        isFileTrashPage(){
            return FileTrashPageSet.has(this.pageType)
        },
        isFileUploadPage(){
            return FileUploadPageSet.has(this.pageType)
        },
        isFileCheckPage(){
            return FileCheckPageSet.has(this.pageType)
        },
        hasTableTopOpts(){
            return this.isFileUploadPage
        },
        tableOptsDelText(){
            return this.isFileTrashPage ? '还原' : '删除'
        },
        tableOptsDelShow(){
            return !this.isFileTrashPage
        },
        tableOptsEditText(){
            if(this.isFileManagementPage){
                return '退回'
            }
            if(this.isFileTrashPage){
                return '还原'
            }
            return '编辑'
        },
        tableOptsEditHandle(){
            if(this.isFileManagementPage){
                return this.backFileUpload
            }
            if(this.isFileTrashPage){
                return this.revertBimRecycle
            }
            return this.addOrUpdateHandle
        },
    },
    async created() {
        if(notEmpty(this.$route.query.type)){
            return
        }
        try {
            this.initData()
            await this.awaitAbProject()
        }catch (e) {

        }finally {
            this.tableFlag = true
        }


    },
    methods: {
        getDelDisabled(scope){
            if(this.isNoProductPage){
                return false
            }
            return this.isFileManagementPage && scope.row.enabledMark
        },
        modelTypeDefaultHandler(type, {id}){
            return this.addOrUpdateHandle(type,id)
        },
        modelTypeSearchHandler(type,{searchTimeType}){
            if(isEmpty(searchTimeType)){
                return
            }
            const [startTime,endTime]= getTimeForSearchTimeType(searchTimeType)
            this.createTimeArr = [startTime,endTime]
            this.search()
        },
        async getFlowData(){
            const resObj ={
                flowData:null,
                approvalFlag:false
            }
            try{
                const res = await getBusinessFlowInfo(this.flowCode)
                if (res.data) {
                    resObj.approvalFlag = res.data.enabledMark
                    resObj.flowData = res.data.enabledMark? res.data : null
                }

            }catch (e) {
            }
            return resObj
        },
        async copy2FileUpload(id){
            this.listLoading = true
            try {
                const [{data}, {number},{ flowData,approvalFlag }] =
                    await Promise.all([
                        detailBimFileUpload(id),
                        this.jnpf.getBillRuleConfigFun(ORDER_CODE_FILE_UPLOAD),
                        this.getFlowData()
                    ])

                data.id = null
                notEmpty(data.bimFileUploadLineVOList) &&
                data.bimFileUploadLineVOList.forEach(item=>{
                    item.id = null
                    item.fileUploadId = null
                })
                data.orderNo = number
                data.documentStatus = DocumentStatus.DRAFT
                data.flowData =flowData
                data.approvalFlag = approvalFlag
                data.bimFileUploadLineList =  data.bimFileUploadLineVOList

                const res = await addBimFileUpload(getUploadFileSaveData(data))
                if(res.data){
                    getSuccessInfo()
                    this.$router.push({
                        path: FileManagementPageType2FileUploadUrl[this.pageType],
                        query:{
                            id:res.data,
                            type:ModelType.EDIT
                        }
                    })
                }
            }catch (e) {
                this.$message.error(e.message)
            }finally {
                this.listLoading = false
            }


        },
        async backFileUpload(type,id){
            console.log('type',type)
            try {
                await getQueryConfirm(this,'是否要退回此记录？')
                const res = await backBimFileUpload(id)
                getSuccessInfo()
                this.initData()
            }catch (e) {
                this.$message.error(e.message)
            }

        },
        superQueryVisibleShow(){
            const common =[     {
                prop: 'documentStatus',
                label: "单据状态",
                type: 'select',
                options: [
                    { label: '草稿', value: 'draft' },
                    { label: '提交', value: 'submit' },
                    { label: '退回', value: 'back' }
                ]
            },

                {
                    prop: 'createTime',
                    label: '创建时间',
                    type: 'daterange',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss',
                    startPlaceholder: '开始日期',
                    endPlaceholder: '结束日期',
                    pickerOptions: this.global.timePickerOptions
                },
                {
                    prop: 'createByName',
                    label: '创建人',
                    type: 'input'
                },]

            let res =[];
            if(!this.isNoProductPage || this.isImage){
                res=[
                    {
                        prop: 'drawingNo',
                        label: '品名规格',
                        type: 'input'
                    },  {
                        prop: 'productsCode',
                        label: '产品编码',
                        type: 'input'
                    },{
                        prop: 'productsCategoryName',
                        label: '产品分类',
                        type: 'input'
                    },
                ]
            }else{


                res =[
                    {
                        prop: 'categoryName',
                        label: '文件分类',
                        type: 'input'
                    },
                ]
            }
            this.superQueryJson =[
                ...res,
                ...common
            ]
            this.superQueryVisible = true
        },
        async changeState({productsCode,id,enabledMark}) {
            const {data} = await switchEnableMark(id)
            this.$message.success('操作成功')
            this.initData()
        },
        getOriginListQuery() {
            return {
                applicationType:this.applicationType,
                approvalStatus: this.approvalStatus,
                createByName: "",
                documentStatus: this.documentStatus,
                endTime: "",
                endUpdateTime: "",
                keyword: "",
                orderItems: [
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                orderNo: "",
                pageNum: 1,
                pageSize: 20,
                startTime: "",
                startUpdateTime: "",
                superQuery: {
                    condition: [
                        {
                            field: "drawingNo",
                            fieldValue: "",
                            symbol: "like"
                        },
                    ],
                    matchLogic: ""
                },
                totalRowFlag: false
            }
        },
        editBack() {
            this.formVisible = false
            this.search()
        },
        superQuerySearch(query) {
            this.superQueryVisible = false
            this.search({superQuery:query})
        },


        columnSetFun() {
            console.log('this.$refs.dataTable', this.$refs.dataTable)
            this.$refs.dataTable.showDrawer()
        },
        sortChange({prop, order}) {
            let newProp = ''
            if (prop == 'steelBall' || prop == 'outerCircle' || prop == 'innerCircle' || prop == 'createByName') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
            }
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },
        executeUploadPageParams(params) {
            if (this.isFileUploadPage) {
                params.uploadListFlag = 1
                delete params.documentStatus
            }
        },
        async initData(query={}) {
            this.listLoading = true
            const params = {...this.listQuery,...query}
            params.superQuery.condition[0].fieldValue === '' && delete params.superQuery
            this.executeUploadPageParams(params)
            const {data} = await this.getListFn(params)
            this.tableData = data.records
            this.total = data.total
            this.listLoading = false
        },
        searchVersion(drawingNo) {
            this.createTimeArr = []
            this.listQuery.superQuery.condition[0].fieldValue = drawingNo
            this.search()
        },
        search(query) {
            trim(executeQueryTime(this.listQuery, this.createTimeArr))
            this.listQuery.pageNum = 1
            this.initData(query)
        },
        refresh(isrRefresh) {
            this.formVisible = false
            this.tableFormVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.createTimeArr = []
            this.listQuery = this.getOriginListQuery()
            this.$refs.SuperQuery.conditionList = []
            this.initData()
        },
        addOrUpdateHandle(type, id) {
            this.fileUploadId = id
            this.uploadType = type
            this.formVisible = true
        },
        /**
         * 此处的type 无意义 仅为参数归一化
         * @param type
         * @param id
         * @returns {Promise<void>}
         */
        async revertBimRecycle(type, id) {
            try {
                await getQueryConfirm(this, '是否要还原此记录？')
                const res = revertBimRecycleBin(id)
                getSuccessInfo()
                this.initData()
            } catch (e) {

            }
        },

        async handleDel(id) {
            try {
                await getQueryConfirm(this)
                const {msg} = await deleteBimFileUpload(id)
                if (msg === 'Success') {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1500
                    })
                }
            } catch (e) {

            }
        },
        async batchDelete() {
            const arr = this.$refs.dataTable.getCurrentSelection()
            if (isEmpty(arr)) {
                return this.$message.info('请选择要删除的数据')
            }
            try {
                await getQueryConfirm(this)
                const {msg} = await batchDeleteBimFileUpload(arr.map(({id}) => id))
                if (msg === 'Success') {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1500
                    })
                }
            } catch (e) {

            }
        }
    }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
    margin-right: 0;
    border-right: 1px solid #cacaca;
  }

  ::v-deep .el-tabs__content {
    height: calc(100vh - 163px);
  } */

::v-deep .el-tabs__header {
    margin-bottom: 5px;
    padding: 0 10px;
}

.JNPF-common-search-box {
    padding: 8px 0 0 0;
    margin-left: 0 !important;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 8px !important;
}

.pagination-container {
    background-color: #f5f7fa;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding: 0;
}

::v-deep.el-tree-node__content {
    height: 30px;
    line-height: 30px;
}

.JNPF-common-el-tree {
    margin: 5px 0;
}

::v-deep .icon-piliang-copy {
    margin-right: 8px;
}
</style>
