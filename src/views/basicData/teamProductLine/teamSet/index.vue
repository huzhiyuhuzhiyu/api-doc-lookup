<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.code" placeholder="请输入班组编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.name" placeholder="请输入班组名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select clearable v-model="tableQuery.state" placeholder="请选择状态" style="width: 100%;">
                                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset')
                                }}</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <!-- <el-dropdown> -->
                    <div>
                        <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="addSupplier('add')">
                            新建
                        </el-button>
                        <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
                            icon="el-icon-download" @click="exportForm">
                            导出
                        </el-button>
                    </div>

                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                @click="superQueryVisible = true" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
                    custom-column :setColumnDisplayList="columnList">
                    <el-table-column prop="code" label="班组编码" sortable="custom" min-width="160">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                                {{ scope.row.code }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="班组名称" sortable="custom" min-width="160" />
                    <el-table-column prop="workType" label="做工类型" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.workType == 'same'">同道工序</div>
                            <div v-else-if="scope.row.workType == 'different'">不同工序</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportingType" label="报工类型" sortable="custom" width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.reportingType == 'by_process'">按工序和人报工</div>
                            <div v-else-if="scope.row.reportingType == 'by_total'">按工序总数报工</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" sortable="custom">
                        <template slot-scope="scope">
                            <el-tag type="danger" disable-transitions v-if="scope.row.state === 'disabled'">停用</el-tag>
                            <el-tag type="success" disable-transitions v-else>启用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="180" sortable="custom" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                                @del="handleDel(scope.row.id, scope.row.parentId)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>

        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
            @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    </div>
</template>

<script>
import { getGroupList, deleteGroupData } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
    name: 'quality',
    components: { DepForm, ExportForm, SuperQuery },
    data() {
        return {
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: 'code',
                    label: '班组编码',
                    type: 'input'
                },
                {
                    prop: 'name',
                    label: '班组名称',
                    type: 'input'
                },

                {
                    prop: 'workType',
                    label: '做工类型',
                    type: 'select',
                    options: [{ label: '同道工序', value: 'same' }, { label: '不同工序', value: 'different' }]
                },
                {
                    prop: 'reportingType',
                    label: '报工类型',
                    type: 'select',
                    options: [{ label: '按工序和人报工', value: 'by_process' }, { label: '按工序总数报工', value: 'by_total' }]
                },
                {
                    prop: 'state',
                    label: '状态',
                    type: 'select',
                    options: [
                        {
                            label: '启用',
                            value: 'enable'
                        },
                        {
                            label: '停用',
                            value: 'disabled'
                        }
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
                },
                {
                    prop: 'remark',
                    label: '备注',
                    type: 'input'
                }
            ],
            exportFormVisible: false,
            stateList: [
                {
                    label: '启用',
                    value: 'enable'
                },
                {
                    label: '停用',
                    value: 'disabled '
                }
            ],
            depFormVisible: false,
            background: true, //分页器背景颜色
            visible: false,
            tableDataList: [],
            listLoading: false,
            tableQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'createTime'
                    }
                ],
                state: '',
                code: '',
                name: ''
            },

            total: 0,
            formVisible: false,
            filterText: '',
            columnList: ['remark', 'createByName']
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val)
        }
    },
    mounted() {
        this.getProductClassFun()
    },
    created() {
        this.initData()
        // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
        superQuerySearch(query) {
            this.tableQuery.superQuery = query
            this.superQueryVisible = false
            this.search()
        },
        // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
        getProductClassFun() {
            let obj1 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa007',
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
            }

            getbimProductAttributesList(obj1).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj2 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa006',
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
            }

            getbimProductAttributesList(obj2).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj3 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa005',
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
            }
            getbimProductAttributesList(obj3).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj4 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa002',
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
            }
            getbimProductAttributesList(obj4).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj5 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa003',
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
            }
            getbimProductAttributesList(obj5).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj6 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa001',
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
            }

            getbimProductAttributesList(obj6).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj7 = {
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
            }
            getbimProductAttributesList(obj7).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })

            // 获取税率(数据字典)
            getbimProductAttributes('585438081021126405').then((res) => {
                res.data.list.forEach((item) => {
                    item.taxRate = item.enCode.replace('%', '') * 1
                })
                this.taxRateList = res.data.list
                console.log('税率', this.taxRateList)
            })
        },
        sortChange({ prop, order }) {
            let newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
            if (newProp == 'create_by_name') {
                newProp = 'createBy'
            }
            this.tableQuery.orderItems[0].asc = order === 'ascending'
            this.tableQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData() {
            getGroupList(this.tableQuery)
                .then((res) => {
                    //
                    this.tableDataList = res.data.records
                    this.listLoading = false
                    this.total = res.data.total
                })
                .catch(() => {
                    this.listLoading = false
                })
        },
        search() {
            this.tableQuery.pageNum = 1
            this.initData()
        },
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()
            this.tableQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'createTime'
                    }
                ],
                state: '',
                code: '',
                name: ''
            }
            this.$refs.SuperQuery.conditionList = []
            this.search()
        },
        addSupplier(type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init('', type)
            })
        },
        addOrUpdateHandle(id, type) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, type)
                })
                // }, 600);
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            })
                .then(() => {
                    deleteGroupData(id).then((res) => {
                        this.initData()
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                            duration: 1500
                        })
                    })
                })
                .catch(() => { })
        },
        handleUserRelation(id, parentId, btnType) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, parentId, btnType)
            })
        },
        columnSetFun() {
            this.$refs.tableForm.showDrawer()
        },
        // 导出
        exportForm() {
            this.exportFormVisible = true
            let columnList = this.$refs.tableForm.columnList.filter((item) => !!item.label && !!item.prop)
            columnList = columnList.map((item) => {
                return { label: item.label, prop: item.prop }
            })
            console.log(columnList, 'columnList')
            this.$nextTick(() => {
                this.$refs.exportForm.init(columnList)
            })
        },
        download(data) {
            console.log(data, 'data')
            if (data) {
                this.exportFormVisible = false
                let includeFieldMap = {}
                for (let i = 0; i < data.selectKey.length; i++) {
                    includeFieldMap[data.selectKey[i]] = data.selectVal[i]
                }
                let _data = {
                    ...this.tableQuery,
                    exportType: '1037',
                    exportName: '班组设置信息',
                    includeFieldMap,
                    pageSize: data.dataType == 0 ? this.tableQuery.pageSize : -1
                }
                excelExport(_data)
                    .then((res) => {
                        this.exportFormVisible = false
                        if (!res.data.url) return
                        this.jnpf.downloadFile(res.data.url)
                    })
                    .catch(() => { })
            }
        }
    }
}
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

.el-tabs__nav-scroll {
    padding-left: 0;
}
</style>
