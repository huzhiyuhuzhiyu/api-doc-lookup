<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="tableQuery.type" placeholder="不良类型" clearable>
                                <el-option v-for="item in typeData" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()" v-model.trim="tableQuery.name" placeholder="不良名称"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-date-picker v-model="timeArr" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" start-placeholder="请选择创建开始日期"
                                end-placeholder="请选择创建结束日期"></el-date-picker>
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
                    <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addSupplier('add')">
                        新建
                    </el-button>
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
                <JNPF-table v-if="tableDataFlag" v-loading="listLoading" :data="tableDataList" ref="dataTable"
                    @sort-change="sortChange" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_368745">
                    <el-table-column prop="projectName" label="所属项目" width="120"
                        v-if="abProjectSwitchVisible"></el-table-column>
                    <el-table-column prop="name" label="不良名称" sortable="custom" />
                    <el-table-column prop="price" label="单价" sortable="custom" width="120"></el-table-column>
                    <el-table-column prop="type" label="不良类型" align="center" sortable="custom" width="160">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type == 'responsibility_fee'">责废</div>
                            <div v-if="scope.row.type == 'material_fee'">料废</div>
                            <div v-if="scope.row.type == 'rework'">返工</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="120" sortable="custom" />
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row)" @del="handleDel(scope.row.id)" />
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>

        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
            @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    </div>
</template>

<script>
import { deleteScrapCategoryData, getScrapCategoryList } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
export default {
    name: 'scrappedType',
    components: { DepForm, SuperQuery },
    mixins: [AbProjectMixin],
    data() {
        return {
            isProjectSwitch: '',
            tableDataFlag: false,
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: 'name',
                    label: '不良名称',
                    type: 'input'
                },
                {
                    prop: 'price',
                    label: '单价',
                    type: 'input'
                },
                {
                    prop: 'type',
                    label: '不良类型',
                    type: 'select',
                    options: [
                        {
                            value: 'responsibility_fee',
                            label: '责废'
                        },
                        {
                            value: 'material_fee',
                            label: '料废'
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
                }
            ],
            columnList: [],
            depFormVisible: false,
            background: true, //分页器背景颜色
            visible: false,
            tableDataList: [],
            listLoading: false,
            timeArr: [],
            tableQuery: {
                type: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [
                    {
                        asc: false,
                        column: 'create_time'
                    }
                ],
                name: '',
                code: ''
            },

            total: 0,
            typeData: [
                {
                    value: 'responsibility_fee',
                    label: '责废'
                },
                {
                    value: 'material_fee',
                    label: '料废'
                },
                {
                    value: 'rework',
                    label: '返工'
                }
            ],
            formVisible: false,
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val)
        }
    },
    async created() {
        await this.awaitAbProject()
        this.tableDataFlag = true
        this.initData()

    },
    methods: {
        superQuerySearch(query) {
            this.superQuery = query
            this.superQueryVisible = false
            this.search()
        },
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        sortChange({ prop, order }) {
            let newProp = ''
            if (['createByName'].includes(prop)) {
                newProp = 'create_by'
            } else {
                newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
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
            if (this.timeArr&& this.timeArr.length) {
                this.tableQuery.startTime = this.timeArr[0] + ' 00:00:00'
                this.tableQuery.endTime = this.timeArr[1] + ' 23:59:59'
            } else {
                this.tableQuery.startTime = ''
                this.tableQuery.endTime = ''
            }
            if (this.abProjectSwitchVisible) {
                this.tableQuery.projectId = this.abProjectId
            }
            getScrapCategoryList(this.tableQuery)
                .then((res) => {
                    this.tableDataList = res.data.records
                    this.total = res.data.total
                    this.listLoading = false
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
            this.$refs['dataTable'].$refs.JNPFTable.clearSort()
            this.tableQuery = {
                type: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'create_time'
                    }
                ],
                code: '',
                name: ''
            }
            this.timeArr = []
            this.search()
        },
        addSupplier() {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init('')
            })
        },
        addOrUpdateHandle(row) {
            this.depFormVisible = true
            if (row) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(row)
                })
                // }, 600);
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            })
                .then(() => {
                    deleteScrapCategoryData(id).then((res) => {
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
