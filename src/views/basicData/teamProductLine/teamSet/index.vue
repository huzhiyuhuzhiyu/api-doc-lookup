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
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
                            </el-button>

                        </el-form-item>

                    </el-col>


                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <!-- <el-dropdown> -->
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="addSupplier('add')">
                        新建
                    </el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
                    custom-column >
                    <el-table-column prop="code" label="班组编码" sortable="custom" min-width="160">
                        <template slot-scope="scope">

                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.code
                            }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="班组名称" sortable="custom" min-width="160" />
                    <el-table-column prop="workType" label="做工类型" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.workType == 'same'">同道工序</div>
                            <div v-else-if="scope.row.workType == 'different'">不同工序</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportingType" label="报工类型" width="180">
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
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
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
    </div>
</template>
  
<script>
import { getGroupList, deleteGroupData } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
export default {
    name: 'quality',
    components: { DepForm, },
    data() {
        return {
            stateList: [{
                label: "启用",
                value: "enable"
            }, {
                label: "停用",
                value: "disabled "
            }],
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [],
            listLoading: false,
            tableQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                state: "",
                code: "",
                name: ""
            },

            total: 0,
            formVisible: false,
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val)
        }
    },
    created() {
        this.initData()
        // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
        sortChange({ prop, order }) {
            let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            if (newProp == 'create_by_name') {newProp = 'createBy'}
            this.tableQuery.orderItems[0].asc = order === "ascending"
            this.tableQuery.orderItems[0].column = order === null ? "" : newProp
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

            getGroupList(this.tableQuery).then(res => {
                // 
                this.tableDataList = res.data.records
                this.listLoading = false
                this.total = res.data.total
            }).catch(() => {
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
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                state: "",
                code: "",
                name: ""
            }
            this.search()
        },
        addSupplier(type) {

            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init("", type)
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
            }).then(() => {
                deleteGroupData(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
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
  