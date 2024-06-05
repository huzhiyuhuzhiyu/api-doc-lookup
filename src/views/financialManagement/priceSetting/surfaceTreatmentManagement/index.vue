<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="tableQuery.code" placeholder="请输入编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="tableQuery.name" placeholder="请输入名称" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-date-picker v-model="createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                                end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions">
                            </el-date-picker>
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
                    <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
                        新建
                    </el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" @sort-change="sortChange"
                    custom-column>
                    <el-table-column prop="code" label="编码"></el-table-column>
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="price" label="单价" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人"></el-table-column>
                    <el-table-column prop="updateTime" label="修改时间" width="180" sortable="custom" />
                    <el-table-column prop="updateByName" label="修改人"></el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)" />
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
import { delSurfaceTreatment, getSurfaceTreatmentList, } from '@/api/financialManagement/index'
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
                    column: "create_time"
                }],
                name: "",
                code: "",
                startTime: "",
                endTime: "",
            },
            createTimeArr: [],
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
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
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
            getSurfaceTreatmentList(this.tableQuery).then(res => {
                // 
                console.log("电镀价格", res);
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.tableQuery.pageNum = 1
            if (this.createTimeArr && this.createTimeArr.length > 0) {
                this.tableQuery.startTime = this.createTimeArr[0]
                this.tableQuery.endTime = this.createTimeArr[1]
            } else {
                this.tableQuery.startTime = ""
                this.tableQuery.endTime = ""
            }
            this.initData()
        },
        reset() {
            this.createTimeArr = []
            this.$refs['dataTable'].$refs.JNPFTable.clearSort()
            this.tableQuery = {
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
                name: "",
                startTime: "",
                endTime: "",
            }
            this.search()
        },
        addSupplier(id, type) {

            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, type)
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
                delSurfaceTreatment(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },

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
  