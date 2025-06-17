<template>
    <div class="JNPF-common-layout" v-loading="tableLoading">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.processName"
                                      placeholder="工序名称" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.drawingNo"
                                      placeholder="品名规格" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.productionOrderNo"
                                      placeholder="生产任务单号" clearable/>
                        </el-form-item>
                    </el-col>


                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                    $t('common.reset')
                                }}
                            </el-button>
                            <el-button type="primary" v-has="'btn_export'" icon="el-icon-download" @click="exportForm" :disabled="!tableData.length">导出</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="JNPF-common-head-right"
                            style="display:flex;justify-content:flex-end;align-items:center;float: right;line-height: 34px;padding-right: 16px !important;">
                        <el-tooltip content="高级查询" placement="top">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                     style="margin-left:12px" @click="superQueryVisibleShow"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" style="margin-left:12px"
                                     :underline="false" @click="columnSetFun()"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" style="margin-left:12px"
                                     :underline="false" @click="initData()"/>
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
                    ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_953430">
                    <el-table-column sortable="custom" prop="processName" label="工序名称" width="120"/>
                    <el-table-column sortable="custom" prop="processCode" label="工序编码" min-width="120"/>
                    <el-table-column sortable="custom" prop="planStartDate" label="计划开始日期" min-width="160"/>
                    <el-table-column sortable="custom" prop="planEndDate" label="计划结束日期" min-width="160"/>
                    <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
                    <el-table-column sortable="custom" prop="pairingModeName" label="配对方式" min-width="120"  v-if="isPairingModeSwitch === '1'"/>
                    <template v-if="mainUnitFlag">
                        <el-table-column sortable="custom" prop="mainUnit" label="单位（主）" width="140"/>
                        <el-table-column sortable="custom" prop="deputyUnit" label="单位（副）" width="140"/>
                    </template>
                    <el-table-column sortable="custom" v-else prop="mainUnit" label="单位" width="120"/>
                    <el-table-column prop="matchedQuantity" label="完成数量" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.pairingModeId ? scope.row.matchedQuantity : scope.row.completedQuantity }}
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="packagingQuantity" label="已包装数量" width="120"/>
                    <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
                    <el-table-column sortable="custom" prop="productionOrderNo" label="生产任务单号" width="180"/>
                    <el-table-column sortable="custom" prop="drawingNo" label="品名规格" width="120"/>
                    <el-table-column sortable="custom" prop="productName" label="产品名称" width="120"
                                     v-if="productNameFlag"/>
                    <el-table-column sortable="custom" prop="productCode" label="产品编码" v-if="isAssemble"
                                     width="120"/>
              <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
                    <el-table-column sortable="custom" prop="createTime" label="创建时间" width="180"/>
                    <el-table-column sortable="custom" prop="createByName" label="创建人" width="100"/>

                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="reportFun(scope.row)" v-if="isAssemble">报工
                            </el-button>
                            <el-button size="mini" type="text" @click="checkReportRecord(scope.row)" v-if="isHistory">
                                查看报工记录
                            </el-button>
<!--                            <el-button size="mini" type="text" @click="exportForm(scope.row)">导出</el-button>-->
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData"/>
            </div>
        </div>
        <ReportRecordForm ref="reportRecordForm" v-if="isHistory && reportRecordFormVisible"/>
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
        <ReportWorkForm v-if="isAssemble" v-model="reportWorkFormVisible" ref="reportWorkForm"/>
        <export-form @download="download" ref="exportForm" v-if="exportFormVisible"></export-form>
    </div>
</template>

<script>
import {
    getbimProductAttributesList, getbimProductAttributesListMap,
} from '@/api/masterDataManagement/index';
import ExportForm from '@/components/no_mount/ExportBox/index';
import {excelExport} from '@/api/basicData/index';

import SuperQuery from '@/components/SuperQuery/index.vue';
import {
    getBimFileUpload, switchEnableMark,
} from '@/api/esop/fileUpload/workinginstruction';

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
import AbProjectMixin from '@/mixins/generator/AbProjectMixin';
import ProductNameFlagMixin from '@/mixins/generator/ProductNameFlagMixin';
import MainUnitFlagMixin from '@/mixins/generator/MainUnitFlagMixin';
import {getWorkFinishList, reportPackageWork} from '@/api/productionManagement';
import BusinessFieldMixin from '@/mixins/generator/BusinessFieldMixin';
import jnpf from '@/utils/jnpf';
import ReportRecordForm from '@/views/productionManagement/assemblyplan/assembledForPackaging/recordForm.vue';
import ReportWorkForm from '@/views/productionManagement/assemblyplan/assembledForPackaging/reportWorkForm.vue';

export default {
    components: {ReportWorkForm, ReportRecordForm, ExportForm, SuperQuery},
    name: 'AssembledForPackaging',
    mixins: [AbProjectMixin, ProductNameFlagMixin, MainUnitFlagMixin, BusinessFieldMixin],
    props: {
        isHistory: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        isAssemble() {
            return !this.isHistory;
        },
    },
    data() {
        return {
            reportRecordFormVisible: false,
            reportWorkFormVisible: false,
            superQueryVisible: false,
            tableFormVisible: false,
            exportFormVisible: false,
            tableLoading: false,
            columnList: ['createByName'],
            tableData: [],
            listLoading: false,
            listQuery: this.getOriginListQuery(),
            total: 0,
            superQueryJson: filterArr([
                {
                    prop: 'processName',
                    label: '工序名称',
                    type: 'input',
                }, {
                    prop: 'processCode',
                    label: '工序编码',
                    type: 'input',
                }, {
                    prop: 'planStartDate',
                    label: '计划开始日期',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    pickerOptions: this.global.timePicker,
                },
                {
                    prop: 'planEndDate',
                    label: '计划结束日期',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    pickerOptions: this.global.timePicker,
                }, {
                    prop: 'vibrationLevel',
                    label: '振动等级',
                    type: 'select',
                    options: [],
                }, {
                    prop: 'pairingModeId',
                    label: '配对方式',
                    type: 'select',
                    options: [],
                }, {
                    prop: 'packagingMethod',
                    label: '包装方式',
                    type: 'select',
                    options: [],
                    visible: this.isHistory,
                }, {
                    prop: 'productionOrderNo',
                    label: '生产任务单号',
                    type: 'input',
                }, {
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input',
                }, {
                    prop: 'productName',
                    label: '产品名称',
                    type: 'input',
                }, {
                    prop: 'productCode',
                    label: '产品编码',
                    type: 'input',
                    visible: !this.isHistory,
                }, {
                    prop: 'createTime',
                    label: '创建时间',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    pickerOptions: this.global.timePicker,
                },
            ]),
            isPairingModeSwitch: '', // 配对方式显示隐藏
        };
    },
    async created() {
        await this.getPairingModeSwitch('product', 'enable_show_pairing_mode') // 配对方式显示隐藏
    },
    async mounted() {
        try {
            this.tableLoading = true;
            await Promise.all([

                this.awaitAbProject(),
                this.awaitGetProductNameFlag(),
                this.awaitMainUnitFlag(),
                this.getBusinessFieldFlag(),
            ]);
            await this.initData();
        } catch (e) {
            console.log(e);
        } finally {
            this.tableLoading = false;
            this.$refs.dataTable.doLayout();
        }
    },
    methods: {
     // 配对方式显示隐藏
     async getPairingModeSwitch(code, type) {
      try {
        this.isPairingModeSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.tableDataFlag = true
      } catch (error) { }
    },
        async checkReportRecord({id}) {
            this.reportRecordFormVisible = true;
            await this.$nextTick();
            this.$refs.reportRecordForm.init(id);
        },
        exportForm(exportTableRef) {
            this.exportFormVisible = true
            let columnList = this.$refs['dataTable'].columnList.filter(item => !!item.label && !!item.prop)
            columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
            this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
        },
        download(data) {
            this.exportFormVisible = false
            let includeFieldMap = {}
            for (let i = 0; i < data.selectKey.length; i++) {
                includeFieldMap[data.selectKey[i]] = data.selectVal[i];
            }
            const targetListQuery = this.listQuery
            let _data = {
                ...targetListQuery,
                exportType: "1241",
                exportName: '完工包装',
                includeFieldMap,
                pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
            }
            excelExport(_data).then(res => {
                this.exportFormVisible = false
                if (!res.data.url) return
                this.jnpf.downloadFile(res.data.url, res.data.name)
            })
        },
        async reportFun(item) {
            try {
                this.reportWorkFormVisible = true;
                await this.$nextTick();
                const formData = await this.$refs.reportWorkForm.reportWork(item);
                formData.reportingQuantity = +formData.reportingQuantity * formData.pairingModeQuantity;
                const res = await reportPackageWork({
                    ...item,
                    ...formData,
                    workFinishId: item.id,
                });
                if (res.code === 200) {
                    this.$message.success('报工成功');
                    this.initData();
                } else {
                    this.$message.error(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
        async superQueryVisibleShow() {
            const res = await this.jnpf.getpairingModeListFun();
            this.superQueryJson.forEach(item => {
                if (item.prop === 'vibrationLevel') {
                    item.options = this.vibrationLevelList;

                } else if (item.prop === 'pairingModeId') {
                    item.options = res.map(item => ({
                        label: item.name,
                        value: item.id,
                    }));
                } else if (item.prop === 'packagingMethod') {
                    item.options = this.packagingMethodList;
                }
            });
            this.superQueryVisible = true;
        },
        getOriginListQuery() {
            return {
                createByName: '',
                drawingNo: '',
                endTime: '',
                endUpdateTime: '',
                keyword: '',
                orderEndDate: '',
                orderItems: [
                    {
                        asc: false,
                        column: 'create_time',
                    },
                ],
                orderStartDate: '',
                pageNum: 1,
                pageSize: 20,
                processName: '',
                productionOrderNo: '',
                projectId: null,
                startTime: '',
                startUpdateTime: '',
                superQuery: {
                    condition: [
                        {
                            field: '',
                            fieldValue: '',
                            symbol: '',
                        },
                    ],
                    matchLogic: '',
                },
                totalRowFlag: false,
                type: +this.isHistory,
            };
        },
        superQuerySearch(query) {
            this.superQueryVisible = false;
            this.search({superQuery: query});
        },
        columnSetFun() {
            console.log('this.$refs.dataTable', this.$refs.dataTable);
            this.$refs.dataTable.showDrawer();
        },
        sortChange(item) {
            const noSnakeCase = [
                'accuracyLevel',
                'classAttribute',
                'completedQuantity',
                'createTime',
                'matchedQuantity',
                'packagingMethod',
                'packagingQuantity',
                'pairingModeId',
                'productionOrderId',
                'receivedQuantity',
                'vibrationLevel',
            ];
            this.listQuery.orderItems[0] = getSortField(item, noSnakeCase);
            this.initData();
        },
        async initData(query = {}) {
            this.listLoading = true;
            const params = {...this.listQuery, ...query};
            if (this.abProjectFlag) {
                params.projectId = this.abProjectId;
            }
            const {data} = await getWorkFinishList(params);
            this.tableData = data.records;
            this.total = data.total;
            this.listLoading = false;
        },
        search(query) {
            trim(executeQueryTime(this.listQuery, this.createTimeArr));
            this.listQuery.pageNum = 1;
            this.initData(query);
        },
        reset() {
            this.$refs['dataTable'].clearSort(); // 清除排序箭头高亮
            this.listQuery = this.getOriginListQuery();
            this.$refs.SuperQuery.conditionList = [];
            this.initData();
        },
    },
};
</script>
<style scoped>
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
