<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="listQuery.code" placeholder="请输入终端编码" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="listQuery.name" placeholder="请输入终端名称" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="listQuery.state" placeholder="请选择状态" clearable style="width: 100%;">
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
                    <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
              icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->

                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <!-- <el-dropdown> -->
                    <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('add')" size="mini">
                        新建
                    </el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>

                <JNPF-table ref="tableForm" v-loading="listLoading" :data="tableDataList" :fixedNO="true"
                    @sort-change="sortChange" custom-column >
                    <el-table-column prop="code" label="终端编码" width="220"></el-table-column>
                    <el-table-column prop="name" label="终端名称" width="220" sortable="custom" />
                    <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                            <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable="custom" width="200" />
                    <el-table-column prop="createByName" label="创建人" width="120" />
                    <el-table-column prop="remark" label="备注" min-width="260"></el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text"
                                @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                            <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                @click="handleDel(scope.row.id)">删除</el-button>
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
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                    :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
        <Form v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
    
<script>
import { getTerminalList, deleteTerminalData } from '@/api/basicData/index'
import Form from './Form'

export default {
    name: 'terminalManagement',
    components: { Form, },
    data() {
        return {
            stateList: [
                { label: "禁用", value: "disabled" },
                { label: "启用", value: "enable" }
            ],
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [
            ],
            listLoading: false,
            listQuery: {
                state: '',
                code: "",
                name: "",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
            },
            total: 0,
            formVisible: false,
        }
    },
    created() {
        this.initData()
    },
    methods: {
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.listQuery.orderItems[0].asc = order !== 'descending'
            this.listQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.depFormVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        moreQueries() {
            this.visible = true
        },
        initData() {
            this.listLoading = true
            getTerminalList(this.listQuery).then(res => {
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
                this.visible = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listQuery.pageNum = 1 // 重置页码
            this.initData()
        },
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()
            this.listQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                code: "",
                state: '',
                name: ""
            },
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
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, type)
                })
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteTerminalData(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, type)
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
::v-deep .el-table .cell.el-tooltip{
    width: 98% !important;
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
    