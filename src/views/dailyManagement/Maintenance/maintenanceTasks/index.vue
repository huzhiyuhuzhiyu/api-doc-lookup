<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.name" placeholder="请输入任务名称" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.equipmentIdCode" placeholder="请输入设备编码" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.equipmentIdName" placeholder="请输入设备名称" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-button style="float: right;margin-right: 10px;" size="mini" type="primary"
                        icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <topOpts @add="addSupplier('', 'add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>

                <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO
                    custom-column style="padding-bottom: 50px;">
                    <el-table-column prop="name" label="任务名称" width="200" fixed="left" sortable="custom">
                        <!-- <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.orderNo
                            }}</el-link>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="cycle" label="周期" width="120"></el-table-column>
                    <el-table-column prop="unit" label="单位" width="110"></el-table-column>
                    <el-table-column prop="equipmentIdCode" label="设备编码" width="200" fixed="left" />
                    <el-table-column prop="equipmentIdName" label="设备名称" width="200" fixed="left"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                            <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cycleType" label="周期类型" width="120" sortable="custom" fixed="right"
                        align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                            <div v-else-if="scope.row.cycleType == 'disposable'">
                                <el-tag type="success">一次</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="departmentIdName" label="计划保养部门" width="120" />
                    <el-table-column prop="maintainerIdName" label="计划保养人" width="120"></el-table-column>

                    <el-table-column prop="nextMaintenanceTime" label="下次保养时间" width="180"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="300"></el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
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
                        <!-- <template slot-scope="scope">
                            <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                            <el-button type="text" @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn">删除</el-button>
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
                        </template> -->
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
        <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
            <el-row :gutter="20">

                <el-form ref="diaForm" :model="orderForm" label-width="120px" label-position="top">
                    <el-col :span="12">
                        <el-form-item label="任务名称">
                            <el-input v-model="orderForm.name" placeholder="请输入任务名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="周期类型">
                            <el-select v-model="orderForm.cycleType" placeholder="请选择周期类型" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in cycleTypeStateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编码">
                            <el-input v-model="orderForm.equipmentIdCode" placeholder="请输入设备编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-input v-model="orderForm.equipmentIdName" placeholder="请输入设备名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-select v-model="orderForm.state" placeholder="请选择状态" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下次保养时间">
                            <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" start-placeholder="开始时间" end-placeholder="结束时间" clearable :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width: 100%;"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit()">
                    搜索</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { checkmaintenanceList, deletecheckmaintenance } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
    name: 'maintenanceTasks',
    components: { Form, },
    data() {
        return {
            visible: false,
            submitDate: [],
            tableData: [],
            orderDateArr: [],
            listLoading: false,
            cycleTypeStateList: [
                { label: "周期", value: "cycle" },
                { label: "一次", value: "disposable" },
            ],
            stateList: [
                { label: "禁用", value: "disabled" },
                { label: "启用", value: "enable" }
            ],
            orderForm: {
                name: "",
                taskType: 'maintenance',
                cycleType: "",
                equipmentIdCode: "",
                equipmentIdName: '',
                state: '',
                nextMaintenanceStartTime: '',
                nextMaintenanceEndTime: '',
                startTime: '',
                endTime: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time" /* 使用倒序日期作为默认排序 */
                }],
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: '当天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            // end.setTime(end.getTime() )
                            // start.setTime(end.getTime() )
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '近三天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }]
            },
            total: 0,
            formVisible: false,
        }
    },
    created() {
        this.initData()
    },
    methods: {
        //更多查询
        moreQueries() {
            this.visible = true
        },
        sortChange({ prop, order }) {
            let newProp
            if (prop === 'equipmentIdName') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            }
            this.orderForm.orderItems[0].asc = order !== "descending"
            this.orderForm.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        dataFormSubmit() {
            if (this.orderDateArr && this.orderDateArr.length > 0) {
                this.orderForm.nextMaintenanceStartTime = this.orderDateArr[0]
                this.orderForm.nextMaintenanceEndTime = this.orderDateArr[1]
            } else {
                this.orderForm.nextMaintenanceStartTime = ''
                this.orderForm.nextMaintenanceEndTime = ''
            }
            if (this.submitDate && this.submitDate.length > 0) {
                this.orderForm.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
                this.orderForm.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
            } else {
                this.orderForm.startTime = ''
                this.orderForm.endTime = ''
            }
            Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
                let item = this.orderForm[key]
                this.orderForm[key] = typeof item === 'string' ? item.trim() : item
            })
            this.orderForm.pageNum = 1 // 重置页码
            this.initData()
        },
        // 关闭新建编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.keyword = ''
                this.initData()
            }
        },
        initData() {
            this.listLoading = true
            checkmaintenanceList(this.orderForm).then(res => {
                console.log("res++", res);
                this.tableData = res.data.records
                this.total = res.data.total
                this.listLoading = false
                this.visible = false
            }).catch(() => {
                this.listLoading = false
            })
        },

        search() {
            this.dataFormSubmit()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.submitDate = []
            this.orderDateArr = []
            this.orderForm = {
                name: "",
                taskType: 'maintenance',
                cycleType: "",
                equipmentIdCode: "",
                equipmentIdName: '',
                state: '',
                nextMaintenanceStartTime: '',
                nextMaintenanceEndTime: '',
                startTime: '',
                endTime: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time" /* 使用倒序日期作为默认排序 */
                }],
            }
            this.search()
        },

        addSupplier(id, btntype) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id, btntype)
            })
        },
        addOrUpdateHandle(id, btntype) {
            this.formVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.Form.init(id, btntype,)
                })
                // }, 600);
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deletecheckmaintenance(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, btnType) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id, btnType)
            })
        }
    }
}
</script>
<style  scoped>
.el-tab-pane {
    height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
    height: calc(100% - 40px);
}

.el-tabs {
    height: 100%;
}

.el-tabs__nav-scroll {
    padding-left: 10px;
}

.JNPF-common-head {
    padding: 10px;
}

.JNPF-common-search-box {
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.pagination-container {
    background-color: #f5f7fa;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.main {
    padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
    padding: 0 !important;
    padding-bottom: 10px !important;
    margin-bottom: 0;
    padding-left: 10px !important;
    background: #fff;
}

.el-button--small {
    padding: 1;
}

::v-deep .JNPF-common-page-header {
    padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding-bottom: 0;
}
</style>
  
  