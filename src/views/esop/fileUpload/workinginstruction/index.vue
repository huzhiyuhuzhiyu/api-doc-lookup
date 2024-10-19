<template>
    <div class="JNPF-common-layout">
        <div v-if="!formVisible" class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input  @keyup.enter.native="search" v-model="listQuery.superQuery.condition[0].fieldValue" placeholder="品名规格" clearable />
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
                    v-loading="listLoading"
                    :data="tableData"
                    :fixedNO="true"
                    @sort-change="sortChange"
                    custom-column
                    enabled-checkbox-plus
                    :hasC="hasTableTopOpts"
                            ref="dataTable" :setColumnDisplayList="columnList">
                    <el-table-column prop="orderNo" label="上传单编码" sortable="custom" min-width="150" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="150" />
                    <el-table-column prop="productsCode" label="产品编码" min-width="120" />
                    <el-table-column prop="productsCategoryName" label="产品分类" width="140" />
                    <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
                        <template slot-scope="{row}">
                            <el-tag type="warning" v-if="row.documentStatus === 'draft'">草稿</el-tag>
                            <el-tag type="success" v-else-if="row.documentStatus === 'submit'">提交</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="version" label="版本号" width="80" />
                    <el-table-column prop="fileCount" label="文件数量" width="120" />
                    <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                    <el-table-column prop="createByName" label="创建人" width="100" />
                    <el-table-column prop="status" label="启用状态" width="120" align="center" v-if="isFileManagementPage">
                        <template slot-scope="scope">
                            <el-switch @change="changeState(scope.row)" v-model="scope.row.enabledMark"
                                       :active-value="true" :inactive-value="false">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
<!--                            :delDisabled="scope.row.documentStatus !== 'draft'"-->
<!--                            :editDisabled="scope.row.documentStatus !== 'draft'"-->
                            <tableOpts :isJudgePer="true"
                                       :del-text="isFileTrashPage?'还原':undefined"
                                       @edit="addOrUpdateHandle(ModelType.EDIT,scope.row.id)"
                                       @del="handleDel(scope.row.id)">
                                        <el-dropdown hide-on-click v-if="isFileManagementPage">
                                              <span class="el-dropdown-link">
                                                <el-button type="text" size="mini">
                                                  {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                                </el-button>
                                              </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click.native="addOrUpdateHandle(ModelType.VIEW,scope.row.id)">
                                                    查看详情
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                            </tableOpts>
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
                :id="fileUploadId"
                :applicationType="applicationType"
                :isFileManagementPage="isFileManagementPage"
                :isFileTrashPage="isFileTrashPage"
                :isFileUpload="isFileUpload"
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
    batchDeleteBimFileUpload,
    deleteBimFileUpload,
    getBimFileUpload, switchEnableMark
} from "@/api/esop/fileUpload/workinginstruction";
import moment from "moment";
import {
    ApplicationType,
    DocumentStatus, FileManagePageSet, FileTrashPageSet,
    ModelType,
    PageType
} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";
import {getQueryConfirm, getSuccessInfo, isEmpty, mapIfNonePutArr, trim} from "@/utils";
import RecreateMixin from "@/views/esop/utils/RecreateMixin";
import {BtnType, executeQueryTime} from "@/views/esop/utils/utils";
import {getBimRecycleBin, revertBimRecycleBin} from "@/api/esop/fileTrash";



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
    mixins:[RecreateMixin],
    data() {
        return {
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
            selectList: [],
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
        isFileUpload(){
            return !this.isFileManagementPage && !this.isFileTrashPage
        },
        hasTableTopOpts(){
            return this.isFileUpload
        }
    },
    async created() {
        this.initData()

    },
    methods: {
        superQueryVisibleShow(){
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
                        }
                    ],
                    matchLogic: ""
                },
                totalRowFlag: false
            }
        },
        editBack(){
            this.formVisible = false
            this.search()
        },
        superQuerySearch(query) {
            this.listQuery.superQuery = query
            this.superQueryVisible = false
            this.search()
        },

        handleSelectionChange(val) {
            this.selectList = val
        },


        columnSetFun() {
            console.log('this.$refs.dataTable', this.$refs.dataTable)
            this.$refs.dataTable.showDrawer()
        },
        sortChange({ prop, order }) {
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
       async initData() {

           this.listLoading = true
           const params ={...this.listQuery}
           params.superQuery.condition[0].fieldValue === '' && delete params.superQuery
           const {data} = await this.getListFn(params)
           this.tableData = data.records
           this.total = data.total
           this.listLoading = false

        },

        search() {
            trim(executeQueryTime(this.listQuery,this.createTimeArr))
            this.listQuery.pageNum = 1
            this.initData()
        },
        refresh(isrRefresh) {
            this.formVisible = false
            this.tableFormVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.createTimeArr = []
            this.listQuery =this.getOriginListQuery()
            this.$refs.SuperQuery.conditionList = []
            this.initData()
        },
        addOrUpdateHandle(type,id) {
            this.fileUploadId = id
            this.uploadType = type
            this.formVisible = true
        },
        async revertBimRecycle(id){
            try {
                await getQueryConfirm(this,'是否要还原此记录？')
                const res = revertBimRecycleBin(id)
                getSuccessInfo()
                this.initData()
            }catch (e) {

            }
        },

        async handleDel(id) {
            if(this.isFileTrashPage){
                return this.revertBimRecycle(id)
            }
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
            }catch (e) {

            }
        },
        async batchDelete(){
            const arr =this.$refs.dataTable.getCurrentSelection()
             if(isEmpty(arr)){
                 return this.$message.info('请选择要删除的数据')
             }
            try {
                await getQueryConfirm(this)
                const {msg} = await batchDeleteBimFileUpload(arr.map(({id})=>id))
                if (msg === 'Success') {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1500
                    })
                }
            }catch (e) {

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
