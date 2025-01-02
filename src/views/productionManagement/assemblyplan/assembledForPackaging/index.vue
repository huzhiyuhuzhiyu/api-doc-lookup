<template>
    <div class="JNPF-common-layout" v-loading="tableLoading">
        <div   class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.processName" placeholder="工序名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.drawingNo" placeholder="品名规格" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.productionOrderNo" placeholder="生产任务单号" clearable />
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
                    :hasC="false"
                    ref="dataTable" :setColumnDisplayList="columnList">
                    <el-table-column sortable="custom" :key="111" prop="processName" label="工序名称" width="120"  />
                    <el-table-column sortable="custom" :key="112" prop="processCode" label="工序编码" min-width="120" />
                    <el-table-column sortable="custom" :key="113" prop="planStartDate" label="计划开始日期" min-width="160" />
                    <el-table-column sortable="custom" :key="114" prop="planEndDate" label="计划结束日期" min-width="160" />
                    <el-table-column sortable="custom" :key="115" prop="vibrationLevel" label="振动等级" min-width="120" />
                    <el-table-column sortable="custom" :key="116" prop="pairingModeName" label="配对方式" min-width="120" />
                    <template v-if="mainUnitFlag">
                        <el-table-column sortable="custom"  :key="117"  prop="mainUnit" label="单位（主）" width="120" />
                        <el-table-column sortable="custom"  :key="118" prop="deputyUnit" label="单位（副）" width="120" />
                    </template>
                    <el-table-column  sortable="custom" v-else :key="119"  prop="mainUnit" label="单位" width="120" />
                    <el-table-column prop="matchedQuantity" :key="120"  label="完成数量" width="120">
                        <template slot-scope="scope">
                            {{scope.row.pairingModeId ? scope.row.matchedQuantity : scope.row.completedQuantity}}
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" :key="121"  prop="packagingQuantity" label="已包装数量" width="120"/>
                    <el-table-column sortable="custom" :key="122"  prop="packagingMethod" label="包装方式" v-if="isHistory" width="120"/>
                    <el-table-column sortable="custom" :key="123"  prop="productionOrderNo" label="生产任务单号" width="180"/>
                    <el-table-column sortable="custom" :key="124"  prop="drawingNo" label="品名规格" width="120"/>
                    <el-table-column sortable="custom" :key="125"  prop="productName" label="产品名称" width="120" v-if="productNameFlag"/>
                    <el-table-column sortable="custom" :key="126"  prop="productCode" label="产品编码" v-if="isAssemble" width="120"/>
                    <el-table-column sortable="custom" :key="127"  prop="createTime" label="创建时间"  width="180" />
                    <el-table-column sortable="custom" :key="128"   prop="createByName" label="创建人" width="100" />

                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="reportFun(scope.row)">报工</el-button>
<!--                            <el-button size="mini" type="text" @click="reportRecordsFun(scope.row)">导出</el-button>-->
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
                   @close="closeReportForm" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" append-to-body>
            <el-row :gutter="20">

                <el-form ref="reportRef" :model="reportForm" :rules="reportFormProps" label-width="120px" label-position="top">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="包装方式" prop="packagingMethod">
                                <el-select :disabled="packagingMethodDisabled" v-model="reportForm.packagingMethod" placeholder="包装方式" style="width: 100%;">
                                    <el-option v-for="(item, index) in packagingMethodList" :key="index" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="包装人" prop="producerId">
                                <user-select v-model="reportForm.producerId" placeholder="请选择包装人" clearable style="width: 100%"  @change="handlePackagePerson">
                                </user-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label="`包装数量（${reportForm.mainUint}）`" prop="reportingQuantity">
                                <el-input v-model.number="reportForm.reportingQuantity" placeholder="包装数量" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </el-row>

            <span slot="footer" class="dialog-footer">
      <el-button @click="closeReportForm">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitReportFun()">
        提交</el-button>
    </span>
        </el-dialog>

    </div>
</template>

<script>
import {
    getbimProductAttributesList, getbimProductAttributesListMap,
} from '@/api/masterDataManagement/index';
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'

import SuperQuery from '@/components/SuperQuery/index.vue'
import {
    getBimFileUpload, switchEnableMark
} from "@/api/esop/fileUpload/workinginstruction";

import {
    getPromise,
    getQueryConfirm,
    getSortField,
    getSuccessInfo,
    isEmpty,
    mapIfNonePutArr,
    notEmpty,
    trim,
} from '@/utils';
import {
    executeQueryTime, filterArr,
} from '@/views/esop/utils/utils';
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import ProductNameFlagMixin from '@/mixins/generator/ProductNameFlagMixin';
import MainUnitFlagMixin from '@/mixins/generator/MainUnitFlagMixin';
import {getWorkFinishList, reportPackageWork} from '@/api/productionManagement';
import BusinessFieldMixin from '@/mixins/generator/BusinessFieldMixin';
import jnpf from '@/utils/jnpf';



export default {
    components: { ExportForm, SuperQuery },
    name:"AssembledForPackaging",
    mixins:[AbProjectMixin,ProductNameFlagMixin,MainUnitFlagMixin,BusinessFieldMixin],
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
            reportForm:{
                packagingMethod:"",
                producerId:"",
                reportingQuantity:"",
                mainUint:'',
                pairingModeQuantity:1,
                id:'',
            },
            btnLoading:false,
            packagingMethodList:[],
            packagingMethodDisabled:false,
            reportFormProps:{
                packagingMethod:[
                    { required: true, message: '请选择包装模式', trigger: 'change' },
                ],
                producerId:[
                    { required: true, message: '请选择包装人', trigger: 'change' },
                ],
                reportingQuantity:[
                    { required: true, message: '请输入包装数量', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur' },
                ],
            },
            reportFormVisible: false,
            tableLoading: false,
            recreateFlag: true,
            fileUploadId:"",
            tableFormVisible: false,
            exportFormVisible: false,
            columnList: ['createByName'],
            createTimeArr: [],
            title: '更多查询',
            visible: false,
            tableData: [],
            listLoading: false,
            listQuery: this.getOriginListQuery(),
            total: 0,
            formVisible: false,
            superQueryVisible: false,
            reportFormPromise: null,
            reportFormResolve: null,
            reportFormReject: null,

            superQueryJson:filterArr([
                {
                    prop: 'processName',
                    label: '工序名称',
                    type: 'input'
                },{
                    prop: 'processCode',
                    label: '工序编码',
                    type: 'input'
                }, {
                    prop: 'planStartDate',
                    label: '计划开始日期',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    pickerOptions: this.global.timePicker
                },
                {
                    prop: 'planEndDate',
                    label: '计划结束日期',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    pickerOptions: this.global.timePicker
                },{
                    prop: 'vibrationLevel',
                    label: '振动等级',
                    type: 'select',
                    options: []
                },{
                    prop: 'pairingModeId',
                    label: '配对方式',
                    type: 'select',
                    options: []
                },{
                    prop: 'packagingMethod',
                    label: '包装方式',
                    type: 'select',
                    options: [],
                    visible: this.isHistory
                }, {
                    prop: 'productionOrderNo',
                    label: '生产任务单号',
                    type: 'input',
                },{
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input',
                },{
                    prop: 'productName',
                    label: '产品名称',
                    type: 'input',
                },{
                    prop: 'productCode',
                    label: '产品编码',
                    type: 'input',
                    visible: !this.isHistory
                },{
                    prop: 'createTime',
                    label: '创建时间',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    pickerOptions: this.global.timePicker
                },
            ]) ,
        }
    },
    async mounted() {
        try {
            this.tableLoading = true
            await Promise.all([

                this.awaitAbProject(),
                this.awaitGetProductNameFlag(),
                this.awaitMainUnitFlag(),
                this.getBusinessFieldFlag()
            ])
            await this.initData()
        }catch (e) {
            console.log(e);
        }finally {
            this.tableLoading = false
            this.$refs.dataTable.doLayout()
        }
    },
    methods: {
       async handlePackagePerson(){
           await this.$nextTick()
           this.$refs.reportRef.validateField('producerId')
       },
       async reportFun(item){

            try{
                const formData =  await this.reportWork(item)
                formData.reportingQuantity = +formData.reportingQuantity * formData.pairingModeQuantity
                console.log('formData', formData);
                const res = await reportPackageWork(formData)

                if(res.code === 200){
                    this.$message.success('报工成功')

                    this.initData()

                }else{
                    this.$message.error(res.message)
                }
            }catch (e) {
                console.error(e);
            }finally {
                this.closeReportForm()
            }
        },
        async reportWork(item){
           if(this.reportFormPromise !== null){
               return this.reportFormPromise
           }
            this.reportFormVisible = true
             getbimProductAttributesList({
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
            }).then(res=>{
                 this.packagingMethodList = res.data.records
                 .map((item) => ({label: item.name, value: item.name}))
             })



            this.setReportFormPromise(true)
            this.packagingMethodDisabled = notEmpty(item.packagingMethod)
            this.reportForm = {
                packagingMethod: this.packagingMethodDisabled ? item.packagingMethod : "",
                producerId:"",
                reportingQuantity: item.completedQuantity - item.packagingQuantity,
                id:item.id,
                mainUint:item.mainUnit,
                pairingModeQuantity: item.packagingMethod ? item.pairingModeQuantity : 1,
            }
            await this.$nextTick()
            this.$refs.reportRef.resetFields()
            return this.reportFormPromise
        },
        async submitReportFun(){
            const res=  await this.$refs.reportRef.validate()
            if(!res){
                return
            }
            this.reportFormResolve({...this.reportForm})
            this.setReportFormPromise()
        },
        closeReportForm(){
            this.reportFormVisible = false
            this.reportFormReject && this.reportFormReject("cancel")
            this.setReportFormPromise()
        },
        setReportFormPromise(setPromise=false){
            if(setPromise){
                const {promise,resolve,reject} = getPromise()
                this.reportFormPromise = promise
                this.reportFormResolve = resolve
                this.reportFormReject = reject
                return;
            }
            this.reportFormPromise = null
            this.reportFormResolve = null
            this.reportFormReject = null

        },
       async superQueryVisibleShow(){
           const res=   await this.jnpf.getpairingModeListFun()
            this.superQueryJson.forEach(item=>{
                if(item.prop === 'vibrationLevel') {
                    item.options = this.vibrationLevelList

                }else if(item.prop === 'pairingModeId') {
                    item.options = res.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                } else if(item.prop === 'packagingMethod') {
                    item.options = this.packagingMethodList
                }
            })
            this.superQueryVisible = true
        },
        getOriginListQuery() {
            return{
                createByName: "",
                drawingNo: "",
                endTime: "",
                endUpdateTime: "",
                keyword: "",
                orderEndDate: "",
                orderItems: [
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                orderStartDate: "",
                pageNum: 1,
                pageSize: 20,
                processName: "",
                productionOrderNo: "",
                projectId: null,
                startTime: "",
                startUpdateTime: "",
                superQuery: {
                    condition: [
                        {
                            field: "",
                            fieldValue: "",
                            symbol: ""
                        }
                     ],
                    matchLogic: ""
                },
                totalRowFlag: false,
                type: +this.isHistory
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
        sortChange(item) {
            const noSnakeCase =['accuracyLevel','classAttribute','completedQuantity','createTime','matchedQuantity','packagingMethod','packagingQuantity',
                'pairingModeId','productionOrderId','receivedQuantity','vibrationLevel',
            ]
            this.listQuery.orderItems[0] = getSortField(item,noSnakeCase)
            this.initData()
        },

        async initData(query={}) {
            this.listLoading = true
            const params = {...this.listQuery,...query}
            if(this.abProjectFlag){
                params.projectId = this.abProjectId
            }
            const {data} = await getWorkFinishList(params)
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
            // this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
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
