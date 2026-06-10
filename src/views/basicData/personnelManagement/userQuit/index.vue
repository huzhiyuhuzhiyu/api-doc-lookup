<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input width="200" v-model="listQuery.realName" placeholder="姓名" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-date-picker v-model="listQuery.changeDate" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" start-placeholder="离职开始日期" end-placeholder="离职结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <!-- <div class="JNPF-common-head">
                    <div></div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div> -->
                <JNPF-table v-loading="listLoading" :data="dataList" @sort-change="sortChange" custom-column fixedNO
                    ref="dataTable" customKey="JNPFTableKey_218419">
                    <el-table-column prop="realName" label="姓名" width="140" fixed="left" sortable="custom" />
                    <el-table-column prop="departmentName" label="原部门" width="200" />
                    <el-table-column prop="postName" label="原岗位" width="200" />
                    <el-table-column prop="changeDate" label="离职日期" :formatter="jnpf.tableDateFormatDay" width="140"
                        sortable="custom" />
                    <el-table-column prop="changeReason" label="离职原因" min-width="200" />
                    <el-table-column prop="createTime" label="创建时间" :formatter="jnpf.tableDateFormatDayTime" width="180"
                        sortable="custom" />
                    <el-table-column prop="remark" label="备注" min-width="200" />
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
    </div>
</template>

<script>
import { getQuitData } from "@/api/basicData/personnelManagement"
import moment from 'moment'

export default {
    data() {
        return {
            dataList: [],
            listLoading: true,
            total: 0,
            listQuery: {
                changeDate: [],
                departmentName: "",
                keyword: "",
                orderItems: [
                    {
                        asc: false,
                        column: ""
                    },
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '上个月',
                    onClick(picker) {
                        const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
                        const start = new Date()
                        end.setTime(end.getTime() - 3600 * 1000 * 24)
                        start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
        };
    },
    created() {
        this.initData()
    },
    methods: {
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.listQuery.orderItems[0].asc = order !== 'descending'
            this.listQuery.orderItems[0].column = newProp
            this.initData()
        },
        initData() {
            this.listLoading = true;
            if (this.listQuery.changeDate && this.listQuery.changeDate.length > 0) {
                this.listQuery.changeDateStartTime = this.listQuery.changeDate[0]
                this.listQuery.changeDateEndTime = this.listQuery.changeDate[1]
            } else {
                this.listQuery.changeDateStartTime = ""
                this.listQuery.changeDateEndTime = ""
            }
            getQuitData(this.listQuery).then(res => {
                this.dataList = res.data.records
                this.total = res.data.total;
                this.listLoading = false;
            })
        },
        search() {
            Object.keys(this.listQuery).forEach(key => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listQuery.pageNum = 1
            this.initData();
        },
        refresh(isrRefresh) {
            this.formVisible = false;
            if (isrRefresh) this.reset();
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.listQuery = {
                changeDate: [],
                departmentName: "",
                keyword: "",
                orderItems: [
                    {
                        asc: false,
                        column: ""
                    },
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            }
            this.search();
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

.el-tabs__nav-scroll {
    padding-left: 0;
}
</style>
