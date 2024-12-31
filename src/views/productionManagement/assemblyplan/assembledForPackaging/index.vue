<template>
    <div class="JNPF-common-layout" v-loading="tableLoading">
        <div   class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.superQuery.condition[0].fieldValue" placeholder="工序名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.superQuery.condition[1].fieldValue" placeholder="品名规格" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.superQuery.condition[2].fieldValue" placeholder="生产任务单号" clearable />
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
                    <el-col :span="6" class="JNPF-common-head-right" style="display:flex;justify-content:flex-end;align-items:center;float: right;line-height: 34px;padding-right: 16px !important;">
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

                <JNPF-table
                    v-loading="listLoading"
                    :data="tableData"
                    :fixedNO="true"
                    @sort-change="sortChange"
                    custom-column
                    enabled-checkbox-plus
                    :hasC="false"
                    ref="dataTable" :setColumnDisplayList="columnList">
                    <!--                    <el-table-column prop="orderNo" label="上传单编码" sortable="custom" min-width="150" />-->
                    <el-table-column prop="processName" label="工序名称" width="120"  />
                    <el-table-column prop="productCode" label="工序编码" min-width="305" />
                    <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" />
                    <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" />
                    <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" />
                    <el-table-column prop="pairingModeName" label="配对方式" min-width="120" />
                    <el-table-column prop="unit" label="单位" width="120"/>
                    <el-table-column prop="num" label="完成数量" width="120">
                        <template slot-scope="scope">
                            {{scope.row.pairingModeName ? scope.row.pairingModeNum : scope.row.num}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="packageNum" label="已包装数量" width="120"/>
                    <el-table-column prop="packageMethod" label="包装方式" v-if="isHistory" width="120"/>
                    <el-table-column prop="productTaskNo" label="生产任务单号" width="120"/>
                    <el-table-column prop="drawingNo" label="品名规格" width="120"/>
                    <el-table-column prop="productName" label="产品名称" width="120" v-if="productNameFlag"/>
                    <el-table-column prop="code" label="产品编码" v-if="isAssemble" width="120"/>
                    <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                    <el-table-column prop="createByName" label="创建人" width="100" />

                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="reportFun(scope.row)">报工</el-button>
                            <el-button size="mini" type="text" @click="reportRecordsFun(scope.row)">导出</el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData" />
            </div>
        </div>
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <el-dialog title="报工" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="reportFormVisible"
                   @close="reportFormVisible = false" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" append-to-body>
            <el-row :gutter="20">

                <el-form ref="reportRef" :model="reportForm" :rules="reportFormProps" label-width="120px" label-position="top">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="包装方式" prop="packagingMethod">
                                <el-select v-model="reportForm.packagingMethod" placeholder="包装方式" style="width: 100%;">
                                    <el-option v-for="(item, index) in packagingMethodList" :key="index" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="包装人" prop="packagePersonId">
                                <user-select v-model="reportForm.packagePersonId" placeholder="请选择包装人" clearable style="width: 100%"  @change="handlePackagePerson">
                                </user-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="包装数量" prop="packageNum">
                                <el-input v-model="reportForm.packageNum" placeholder="包装数量" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </el-row>

            <span slot="footer" class="dialog-footer">
      <el-button @click="reportFormVisible">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitReportFun()">
        提交</el-button>
    </span>
        </el-dialog>
        <PersonSelect v-if="choosePersonVisible" ref="personnelRef"  placeholder="请选择所属人员" style="width: 100%;"/>

    </div>
</template>

<script>
import {
    getbimProductAttributesList,
} from '@/api/masterDataManagement/index';
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'

import SuperQuery from '@/components/SuperQuery/index.vue'
import {
    getBimFileUpload, switchEnableMark
} from "@/api/esop/fileUpload/workinginstruction";

import {getQueryConfirm, getSuccessInfo, isEmpty, mapIfNonePutArr, notEmpty, trim} from "@/utils";
import {
    executeQueryTime,
} from "@/views/esop/utils/utils";
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import ProductNameFlagMixin from '@/mixins/generator/ProductNameFlagMixin';



export default {
    components: {   ExportForm, SuperQuery },
    name:"historyPackageRecord",
    mixins:[AbProjectMixin,ProductNameFlagMixin],
    props:{
        isHistory:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        isAssemble(){
            return !this.isHistory
        }
    },
    data() {
        return {
            choosePersonVisible:false,
            reportForm:{
                packagingMethod:"",
                packagePersonId:"",
                packagePersonName:"",
                packageNum:100,
                computedNum:100,
                packagedNum:0,
            },
            btnLoading:false,
            packagingMethodList:[],
            reportFormProps:{
                packagingMethod:[
                    { required: true, message: '请选择包装模式', trigger: 'change' },
                ],
                packagePerson:[
                    { required: true, message: '请选择包装人', trigger: 'change' },
                ],
                packageNum:[
                    { required: true, message: '请输入包装数量', trigger: 'blur' },
                ],
            },
            reportFormVisible: false,
            tableLoading: false,
            recreateFlag: true,
            fileUploadId:"",
            tableFormVisible: false,
            exportFormVisible: false,
            columnList: ['remark', 'createByName','code'],
            createTimeArr: [],
            title: '更多查询',
            visible: false,
            tableData: [],
            listLoading: false,
            listQuery: this.getOriginListQuery(),
            total: 0,
            formVisible: false,
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
    async mounted() {
        try {
            this.tableLoading = true
            await Promise.all([
                this.initData(),
                this.awaitAbProject(),
                this.awaitGetProductNameFlag()
            ])
        }catch (e) {

        }finally {
            this.tableLoading = false
            this.$refs.dataTable.doLayout()
        }
    },
    methods: {
       async handlePackagePerson(){
           await this.$nextTick()
           this.$refs.reportRef.validateField('packagePersonId')
       },
       async reportFun(){

            const res = await getbimProductAttributesList({
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa015',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            })

           this.packagingMethodList = res.data.records.map((item) => ({
                    label: item.name,
                    value: item.name
            }))

            this.reportFormVisible = true
        },
        submitReportFun(){

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
                            field: "processName",
                            fieldValue: "",
                            symbol: "like"
                        },
                        {
                            field: "drawingNo",
                            fieldValue: "",
                            symbol: "like"
                        },
                        {
                            field: "code",
                            fieldValue: "",
                            symbol: "like"
                        },
                    ],
                    matchLogic: ""
                },
                totalRowFlag: false
            }
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
            const {data} = await getBimFileUpload(params)
            this.tableData = data.records
            this.total = data.total
            this.listLoading = false
        },

        search(query) {
            trim(executeQueryTime(this.listQuery, this.createTimeArr))
            this.listQuery.pageNum = 1
            this.initData(query)
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.createTimeArr = []
            this.listQuery = this.getOriginListQuery()
            this.$refs.SuperQuery.conditionList = []
            this.initData()
        },



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
