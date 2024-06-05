<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.name" placeholder="请输入管理员名称" clearable />
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
                    <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier()">
                        新建
                    </el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="tableDataList" @sort-change="sortChange" custom-column>
                    <el-table-column prop="personName" label="管理员名称">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" width="180" />
                    <el-table-column prop="createTime" label="创建时间" width="180" />
                    <el-table-column prop="createByName" label="创建人" width="180" />
                    <el-table-column label="操作" width="90">
                        <template slot-scope="scope">
                            <!-- <el-button type="text"
                                @click="addOrUpdateHandle(scope.row.id, scope.row.warehouseId, 'edit')">编辑</el-button> -->
                            <el-button size="mini" type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                                style=" color: #ff3a3a">删除</el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
                @pagination="initData" />
            </div>
        </div>


        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
  
<script>
import { getApprovalAdministratorList, deleteApprovalAdministrator } from '@/api/basicData/approvalAdministrator'
import DepForm from './depForm'
import moment from 'moment'
export default {
    name: 'quality',
    components: { DepForm, },
    data() {
        return {
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [
            ],
            listLoading: false,
            tableQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time" /* 使用倒序日期作为默认排序 */
                }],
                code: "",
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
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
            this.tableQuery.orderItems[0].asc = order !== 'descending'
            this.tableQuery.orderItems[0].column = newProp
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

            getApprovalAdministratorList(this.tableQuery).then(res => {
                // 
                console.log("货位表格", res)
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.initData()
        },
        reset() {
            this.tableQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: true,
                    column: ""
                }],
                code: "",
            }
            this.search()
        },
        addSupplier() {

            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init("", this.tableQuery.warehouseId)
            })
        },
        addOrUpdateHandle(id, warehouseId) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, warehouseId)
                })
                // }, 600);
            }


        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteApprovalAdministrator(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                        onClose: () => {
                            this.initData()
                        }
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
  