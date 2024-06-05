<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="保养任务" name="orderList">
                    <div class="JNPF-common-layout-center JNPF-flex-main">
                        <el-row class="JNPF-common-search-box" :gutter="16">
                            <el-form @submit.native.prevent>

                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model.trim="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable
                                            @keyup.enter.native="search()" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model.trim="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable
                                            @keyup.enter.native="search()" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <!-- <el-date-picker v-model="createRequirementDate" type="datetimerange"
                                            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择保养开始时间"
                                            end-placeholder="请选择保养结束时间" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions">
                                        </el-date-picker> -->
                                        <el-date-picker v-model="createRequirementDate" type="daterange"
                                            value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="保养开始时间"
                                            end-placeholder="保养结束时间" clearable :picker-options="pickerOptions">
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
                                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                                    icon="icon-ym icon-ym-report-icon-search-setting"
                                    @click="visible = true">更多查询</el-button>
                            </el-form>
                        </el-row>
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <JNPF-table v-if="flag" v-loading="listLoading" highlight-current-row :fixedNO="true"
                                ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column>
                                <el-table-column prop="name" label="任务名称" min-width="200" sortable="custom" fixed="left">
                                </el-table-column>
                                <el-table-column prop="cycleType" label="周期类型" min-width="120" fixed="right" align="center"
                                    sortable="custom">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                                        <div v-else-if="scope.row.cycleType == 'disposable'">
                                            <el-tag type="success">一次</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" fixed="left" />
                                <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"
                                    fixed="left" />
                                <el-table-column prop="departmentIdName" label="计划保养部门" min-width="150" />
                                <el-table-column prop="maintainerIdName" min-width="120" label="计划保养人" />
                                <el-table-column prop="cycle" label="周期" min-width="150" />
                                <el-table-column prop="unit" label="单位" width="120" />
                                <el-table-column prop="nextMaintenanceTime" label="下次保养时间" min-width="180"
                                    sortable="custom" />
                                <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                                        <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="200" />
                                <el-table-column prop="createByName" label="创建人" width="120" />
                                <el-table-column prop="remark" label="备注" min-width="200" />
                                <el-table-column label="操作" min-width="90" fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" :disabled="scope.row.istime"
                                            @click="maintenanceaction(scope.row.id, 'maintenance')"
                                            size="mini">保养</el-button>
                                    </template>
                                </el-table-column>
                            </JNPF-table>
                            <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                                :limit.sync="listQuery.pageSize" @pagination="initData" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="超期保养任务" name="detailList">
                    <div class="JNPF-common-layout-center JNPF-flex-main">
                        <el-row class="JNPF-common-search-box" :gutter="16">
                            <el-form @submit.native.prevent>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model.trim="listsQuery.equipmentIdCode" placeholder="请输入设备编码" clearable
                                            @keyup.enter.native="searchDetail()" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model.trim="listsQuery.equipmentIdName" placeholder="请输入设备名称" clearable
                                            @keyup.enter.native="searchDetail()" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <!-- <el-date-picker v-model="createRequirementDate" type="datetimerange"
                                            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                                            style="width: 100%;" start-placeholder="请选择保养开始时间" end-placeholder="请选择保养结束时间"
                                            clearable :picker-options="pickerOptions">
                                        </el-date-picker> -->
                                        <el-date-picker v-model="createRequirementDate" type="daterange"
                                            value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="保养开始时间"
                                            end-placeholder="保养结束时间" clearable :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        <el-button size="mini" type="primary" icon="el-icon-search" @click="searchDetail()">
                                            {{ $t('common.search') }}</el-button>
                                        <el-button size="mini" icon="el-icon-refresh-right" @click="resetDetail()">{{
                                            $t('common.reset') }}
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                                    icon="icon-ym icon-ym-report-icon-search-setting"
                                    @click="detailVisible = true">更多查询</el-button>
                            </el-form>
                        </el-row>
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="detailTableData"
                                :data="detailTableData" @sort-change="sortChangeDetail" custom-column>
                                <el-table-column prop="name" label="任务名称" min-width="200" sortable="custom" fixed="left">
                                </el-table-column>
                                <el-table-column prop="cycleType" label="周期类型" min-width="120" fixed="right" align="center"
                                    sortable="custom">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                                        <div v-else-if="scope.row.cycleType == 'disposable'">
                                            <el-tag type="success">一次</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" fixed="left" />
                                <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"
                                    fixed="left" />
                                <el-table-column prop="departmentIdName" label="计划保养部门" min-width="150" />
                                <el-table-column prop="maintainerIdName" min-width="120" label="计划保养人" />
                                <el-table-column prop="cycle" label="周期" min-width="150" />
                                <el-table-column prop="unit" label="单位" width="120" />
                                <el-table-column prop="nextMaintenanceTime" label="下次保养时间" min-width="180"
                                    sortable="custom" />
                                <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                                        <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="200" />
                                <el-table-column prop="createByName" label="创建人" width="120" />
                                <el-table-column prop="remark" label="备注" min-width="200" />

                                <el-table-column label="操作" width="90" fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" :disabled="scope.row.istime"
                                            @click="maintenanceaction(scope.row.id, 'maintenance')"
                                            size="mini">保养</el-button>
                                    </template>
                                </el-table-column>

                            </JNPF-table>
                            <pagination :total="total" :page.sync="listsQuery.pageNum" :background="background"
                                :limit.sync="listsQuery.pageSize" @pagination="detailData" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
            <el-row :gutter="20">

                <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">


                    <el-col :span="12">
                        <el-form-item label="任务名称">
                            <el-input v-model="listQuery.name" placeholder="请输入任务名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="周期类型">
                            <el-select v-model="listQuery.cycleType" placeholder="请选择周期类型" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in cycleTypeStateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编码">
                            <el-input v-model="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-input v-model="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-select v-model="listQuery.state" placeholder="请选择状态" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下次保养时间">
                            <!-- <el-date-picker v-model="createRequirementDate" type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" clearable
                                :picker-options="pickerOptions">
                            </el-date-picker> -->
                            <el-date-picker v-model="createRequirementDate" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" clearable
                                :picker-options="pickerOptions">
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
                <el-button type="primary" @click="search()">
                    {{ $t('common.search') }}
                </el-button>
            </span>
        </el-dialog>

        <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="detailVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
            <el-row :gutter="20">

                <el-form ref="diaForm" :model="listsQuery" label-width="120px" label-position="top">

                    <el-col :span="12">
                        <el-form-item label="任务名称">
                            <el-input v-model="listQuery.name" placeholder="请输入任务名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="周期类型">
                            <el-select v-model="listQuery.cycleType" placeholder="请选择周期类型" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in cycleTypeStateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编码">
                            <el-input v-model="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-input v-model="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-select v-model="listQuery.state" placeholder="请选择状态" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下次保养时间">
                            <!-- <el-date-picker v-model="createRequirementDate" type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" clearable
                                :picker-options="pickerOptions">
                            </el-date-picker> -->
                            <el-date-picker v-model="createRequirementDate" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" clearable
                                :picker-options="pickerOptions">
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
                <el-button @click="detailVisible = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="searchDetail()">
                    {{ $t('common.search') }}
                </el-button>
            </span>
        </el-dialog>
        <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    </div>
</template>
    
<script>

import Form from '@/views/dailyManagement/Maintenance/maintenanceRecords/Form.vue'
import { checkmaintenanceList, chaocheckmaintenanceList } from '@/api/dailyManagement/Maintenance'
import moment from 'moment'
export default {
    name: 'taskQuery',
    components: { Form },
    data() {
        return {
            formVisible: false,
            submitDate: [],
            createRequirementDate: [],
            background: true,//分页器背景颜色
            visible: false,
            detailVisible: false,
            tableDataList: [
            ],
            detailTableData: [],
            flag: true,
            activeName: "orderList",
            listLoading: false,
            cycleTypeStateList: [
                { label: "周期", value: "cycle" },
                { label: "一次", value: "disposable" },
            ],
            stateList: [
                { label: "禁用", value: "disabled" },
                { label: "启用", value: "enable" }
            ],
            //保养任务
            listQuery: {
                name: "",
                listType: 'onTime',
                taskType: 'maintenance',
                cycleType: "",
                equipmentIdCode: "",
                equipmentIdName: '',
                state: 'enable',
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
                    asc: true,
                    column: "next_maintenance_time" /* 使用正序日期作为默认排序 */
                }],
            },
            // 超期保养任务
            listsQuery: {
                name: "",
                listType: 'overtime',
                taskType: 'maintenance',
                cycleType: "",
                equipmentIdCode: "",
                equipmentIdName: '',
                state: 'enable',
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
                    asc: true,
                    column: "next_maintenance_time" /* 使用正序日期作为默认排序 */
                }],
            },
            total: 0,
            // pickerOptions: {
            //     shortcuts: [
            //         {
            //             text: '当天',
            //             onClick(picker) {
            //                 const end = new Date(moment((new Date().getTime())).format('YYYY-MM-DD'))
            //                 const start = new Date()
            //                 // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            //                 end.setTime(end.getTime() - 0)
            //                 start.setTime(end.getTime() - 3600 * 1000 * 24 + 1000)
            //                 picker.$emit('pick', [start, end])
            //             }
            //         }, {
            //             text: '近三天',
            //             onClick(picker) {
            //                 const end = new Date(moment((new Date().getTime())).format('YYYY-MM-DD'))
            //                 const start = new Date()
            //                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            //                 picker.$emit('pick', [start, end])
            //             }
            //         }, {
            //             text: '近一周',
            //             onClick(picker) {
            //                 const end = new Date(moment((new Date().getTime())).format('YYYY-MM-DD'))
            //                 const start = new Date()
            //                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            //                 picker.$emit('pick', [start, end])
            //             }
            //         }, {
            //             text: '近一个月',
            //             onClick(picker) {
            //                 const end = new Date(moment((new Date().getTime())).format('YYYY-MM-DD'))
            //                 const start = new Date()
            //                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            //                 picker.$emit('pick', [start, end])
            //             }
            //         }]
            // },
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
        }
    },
    created() {
        this.initData()
    },
    methods: {
        // 关闭新建页面
        closeForm(isRefresh = 'ture') {
            this.formVisible = false
            if (isRefresh && this.activeName == 'orderList') {
                this.initData()
            } else {
                this.resetDetail()
            }
        },
        // 点击切换tab
        handleClick(e) {
            if (e.index == '0') {
                this.reset()
            } else {
                this.resetDetail()
            }
        },
        //保养任务排序
        sortChange({ prop, order }) {
            let newProp
            if (prop === 'equipmentIdName') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            }
            this.listQuery.orderItems[0].asc = order !== 'descending'
            this.listQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        //超期保养任务排序
        sortChangeDetail({ prop, order }) {
            let newProp
            if (prop === 'equipmentIdName') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            }
            this.listsQuery.orderItems[0].asc = order !== 'descending'
            this.listsQuery.orderItems[0].column = order === null ? "" : newProp
            this.detailData()
        },
        //保养任务列表
        initData() {
            this.listLoading = true
            if (this.createRequirementDate && this.createRequirementDate.length > 0) {
                this.listQuery.nextMaintenanceStartTime = this.createRequirementDate[0]
                this.listQuery.nextMaintenanceEndTime = this.createRequirementDate[1]
            } else {
                this.listQuery.nextMaintenanceStartTime = ''
                this.listQuery.nextMaintenanceEndTime = ''
            }
            if (this.submitDate && this.submitDate.length > 0) {
                this.listQuery.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
                this.listQuery.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
            } else {
                this.listQuery.startTime = ''
                this.listQuery.endTime = ''
            }
            checkmaintenanceList(this.listQuery).then(res => {
                // this.tableDataList = res.data.records
                this.total = res.data.total
                res.data.records.map((item) => {
                    if (item.cycleType == 'cycle') {
                        const end = new Date(Date.parse(item.nextMaintenanceTime))
                        if (item.unit == '天') {
                            end.setDate(end.getDate() - item.cycle * 1);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '周') {
                            end.setDate(end.getDate() - item.cycle * 7);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '月') {
                            end.setMonth(end.getMonth() - item.cycle * 1);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '季') {
                            end.setMonth(end.getMonth() - item.cycle * 3);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '年') {
                            end.setFullYear(end.getFullYear() - 1 * item.cycle);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        }
                    } else {
                        item.istime = false
                    }
                })
                this.tableDataList = res.data.records
                this.listLoading = false
                this.visible = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        //超期保养任务列表
        detailData() {
            this.listLoading = true
            if (this.createRequirementDate && this.createRequirementDate.length > 0) {
                this.listQuery.nextMaintenanceStartTime = this.createRequirementDate[0]
                this.listQuery.nextMaintenanceEndTime = this.createRequirementDate[1]
            } else {
                this.listQuery.nextMaintenanceStartTime = ''
                this.listQuery.nextMaintenanceEndTime = ''
            }
            if (this.submitDate && this.submitDate.length > 0) {
                this.listQuery.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
                this.listQuery.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
            } else {
                this.listQuery.startTime = ''
                this.listQuery.endTime = ''
            }
            checkmaintenanceList(this.listsQuery).then(res => {
                // this.detailTableData = res.data.records
                this.total = res.data.total
                res.data.records.map((item) => {
                    if (item.cycleType == 'cycle') {
                        const end = new Date(Date.parse(item.nextMaintenanceTime))
                        if (item.unit == '天') {
                            end.setDate(end.getDate() - item.cycle * 1);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '周') {
                            end.setDate(end.getDate() - item.cycle * 7);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '月') {
                            end.setMonth(end.getMonth() - item.cycle * 1);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '季') {
                            end.setMonth(end.getMonth() - item.cycle * 3);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        } else if (item.unit == '年') {
                            end.setFullYear(end.getFullYear() - 1 * item.cycle);
                            end.setTime(end.getTime())
                            let statime = Date.parse(end) + 1000 * 3600 * 24
                            var date = new Date()
                            var y = date.getFullYear()
                            var m = date.getMonth() + 1
                            m = m < 10 ? ('0' + m) : m
                            var d = date.getDate()
                            d = d < 10 ? ('0' + d) : d
                            const time = y + '-' + m + '-' + d
                            let endtime = Date.parse(time)
                            if (statime > endtime) {
                                item.istime = true
                            } else {
                                item.istime = false
                            }
                        }
                    } else {
                        item.istime = false
                    }
                })
                this.detailTableData = res.data.records
                this.listLoading = false
                this.detailVisible = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        //保养任务搜索
        search() {
            Object.keys(this.listQuery).forEach(key => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listQuery.pageNum = 1
            this.initData()
        },
        //超期保养任务搜索
        searchDetail() {
            Object.keys(this.listsQuery).forEach(key => {
                let item = this.listsQuery[key]
                this.listsQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listsQuery.pageNum = 1
            this.detailData()
        },
        //保养任务重置
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()
            this.listQuery = {
                name: "",
                listType: 'onTime',
                taskType: 'maintenance',
                cycleType: "",
                equipmentIdCode: "",
                equipmentIdName: '',
                state: 'enable',
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
                    asc: true,
                    column: "next_maintenance_time" /* 使用正序日期作为默认排序 */
                }],
            },
                this.submitDate = []
            this.createRequirementDate = []
            this.search()
        },
        //超期保养任务重置
        resetDetail() {
            this.$refs['detailTableData'].$refs.JNPFTable.clearSort()
            this.listsQuery = {
                name: "",
                listType: 'overtime',
                taskType: 'maintenance',
                cycleType: "",
                equipmentIdCode: "",
                equipmentIdName: '',
                state: 'enable',
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
                    asc: true,
                    column: "next_maintenance_time" /* 使用正序日期作为默认排序 */
                }],
            },
                this.submitDate = []
            this.createRequirementDate = []
            this.searchDetail()
        },
        //保养
        maintenanceaction(id, type) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id, type)
            })
        },
    }
}
</script>
<style scoped>
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
    padding-top: 5px;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.pagination-container {
    background-color: #ebeef5;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.main {
    padding: 10px 30px 0;
}

::v-deep .el-table__body tr.current-row>td.el-table__cell {
    background-color: #fff;
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
    