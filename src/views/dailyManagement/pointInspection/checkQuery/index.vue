<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="点检任务" name="orderList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <!-- <el-date-picker v-model="createRequirementDate" type="datetimerange"
                                            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择点检开始时间"
                                            end-placeholder="请选择点检结束时间" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions">
                                        </el-date-picker> -->
                    <el-date-picker v-model="createRequirementDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="点检开始时间" end-placeholder="点检结束时间" clearable :picker-options="pickerOptions">
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
                <topOpts @add="handleUserRelation('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-if="flag" v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="name" label="任务名称" min-width="200" sortable="custom" fixed="left">
                </el-table-column>
                <el-table-column prop="cycleType" label="周期类型" min-width="120" fixed="right" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                    <div v-else-if="scope.row.cycleType == 'disposable'">
                      <el-tag type="success">一次</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" fixed="left" />
                <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom" fixed="left" />
                <el-table-column prop="departmentIdName" label="计划点检部门" min-width="150" />
                <el-table-column prop="maintainerIdName" min-width="120" label="计划点检人" />
                <el-table-column prop="level" label="点检等级" min-width="150" />
                <el-table-column prop="cycle" label="周期" min-width="150" />
                <el-table-column prop="unit" label="单位" width="120" />
                <el-table-column prop="nextMaintenanceTime" label="下次点检时间" min-width="180" sortable="custom" />
                <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                    <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="200" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column label="操作" min-width="180" fixed="right" align="center">
                  <template slot-scope="scope">
                    <tableOpts @edit="handleUserRelation(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :disabled="scope.row.istime" @click.native="maintenanceaction(scope.row.id, 'maintenance')">
                            点检
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                    <!-- <el-button type="text" :disabled="scope.row.istime" @click="maintenanceaction(scope.row.id, 'maintenance')" size="mini">点检</el-button> -->
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery partentOrChild="orderList" :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="超期点检任务" name="detailList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listsQuery.equipmentIdCode" placeholder="请输入设备编码" clearable @keyup.enter.native="searchDetail()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listsQuery.equipmentIdName" placeholder="请输入设备名称" clearable @keyup.enter.native="searchDetail()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-date-picker v-model="createRequirementDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="点检开始时间" end-placeholder="点检结束时间" clearable :picker-options="pickerOptions">
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
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div style="height: 32px;"></div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible1 = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun1()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="detailTableData" :data="detailTableData" @sort-change="sortChangeDetail" custom-column>
                <el-table-column prop="name" label="任务名称" min-width="200" sortable="custom" fixed="left">
                </el-table-column>
                <el-table-column prop="cycleType" label="周期类型" min-width="120" fixed="right" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                    <div v-else-if="scope.row.cycleType == 'disposable'">
                      <el-tag type="success">一次</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" fixed="left" />
                <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom" fixed="left" />
                <el-table-column prop="departmentIdName" label="计划点检部门" min-width="150" />
                <el-table-column prop="maintainerIdName" min-width="120" label="计划点检人" />
                <el-table-column prop="level" label="点检等级" min-width="150" />
                <el-table-column prop="cycle" label="周期" min-width="150" />
                <el-table-column prop="unit" label="单位" width="120" />
                <el-table-column prop="nextMaintenanceTime" label="下次点检时间" min-width="180" sortable="custom" />
                <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                    <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="200" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column prop="remark" label="备注" min-width="200" />

                <el-table-column label="操作" width="180" fixed="right" align="center">
                  <template slot-scope="scope">
                    <tableOpts @edit="handleUserRelation(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :disabled="scope.row.istime" @click.native="maintenanceaction(scope.row.id, 'maintenance')">
                            点检
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                    <!-- <el-button type="text" :disabled="scope.row.istime" @click="maintenanceaction(scope.row.id, 'maintenance')" size="mini">点检</el-button> -->
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="total" :page.sync="listsQuery.pageNum" :background="background" :limit.sync="listsQuery.pageSize" @pagination="detailData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery partentOrChild="detailList" :show="superQueryVisible1" ref="SuperQuery1" :columnOptions="superQueryJson1" @superQuery="superQuerySearch1" @close="superQueryVisible1 = false" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <deForm v-if="formVisible1" ref="deForm" @refreshDataList="initData" @close="closeForm1" />

  </div>
</template>
    
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from '@/views/dailyManagement/pointInspection/inspectionRecords/Form.vue'
import { checkmaintenanceList, deletecheckmaintenance } from '@/api/dailyManagement/Maintenance'
import deForm from './Form'
export default {
  name: 'taskQuery',
  components: { Form, deForm, SuperQuery },
  data() {
    return {
      superQueryJson: [
        {
          prop: 'name',
          label: "任务名称",
          type: 'input'
        },
        {
          prop: 'cycleType',
          label: "周期类型",
          type: 'select',
          options: [
            { label: "周期", value: "cycle" },
            { label: "一次", value: "disposable" }
          ]
        },
        {
          prop: 'equipmentIdCode',
          label: "设备编码",
          type: 'input'
        },
        {
          prop: 'equipmentIdName',
          label: "设备名称",
          type: 'input'
        },
        {
          prop: 'departmentIdName',
          label: "计划点检部门",
          type: 'input'
        },
        {
          prop: 'maintainerIdName',
          label: "计划点检人",
          type: 'input'
        },
        {
          prop: 'cycle',
          label: "周期",
          type: 'input'
        },
        {
          prop: 'unit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'nextMaintenanceTime',
          label: '下次点检时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'state',
          label: "状态",
          type: 'select',
          options: [
            { label: "禁用", value: "disabled" },
            { label: "启用", value: "enable" }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryJson1: [
        {
          prop: 'name',
          label: "任务名称",
          type: 'input'
        },
        {
          prop: 'cycleType',
          label: "周期类型",
          type: 'select',
          options: [
            { label: "周期", value: "cycle" },
            { label: "一次", value: "disposable" }
          ]
        },
        {
          prop: 'equipmentIdCode',
          label: "设备编码",
          type: 'input'
        },
        {
          prop: 'equipmentIdName',
          label: "设备名称",
          type: 'input'
        },
        {
          prop: 'departmentIdName',
          label: "计划点检部门",
          type: 'input'
        },
        {
          prop: 'maintainerIdName',
          label: "计划点检人",
          type: 'input'
        },
        {
          prop: 'cycle',
          label: "周期",
          type: 'input'
        },
        {
          prop: 'unit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'nextMaintenanceTime',
          label: '下次点检时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'state',
          label: "状态",
          type: 'select',
          options: [
            { label: "禁用", value: "disabled" },
            { label: "启用", value: "enable" }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryVisible: false,
      superQueryVisible1: false,
      formVisible1: false,
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
      //点检任务
      listQuery: {
        name: "",
        listType: 'onTime',
        taskType: 'inspection',
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
        superQuery:{}
      },
      // 超期点检任务
      listsQuery: {
        name: "",
        listType: 'overtime',
        taskType: 'inspection',
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
        superQuery:{}
      },
      total: 0,
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
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    superQuerySearch1(query) {
      this.listsQuery.superQuery = query
      this.superQueryVisible1 = false
      this.searchDetail()
    },
    columnSetFun() {
      this.$refs['tableForm'].showDrawer()
    },
    columnSetFun1() {
      this.$refs['detailTableData'].showDrawer()
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
      this.formVisible1 = true
      this.$nextTick(() => {
        this.$refs.deForm.init(id, btnType)
      })
    },
    // 关闭新建编辑页面
    closeForm1(isRefresh) {
      this.formVisible1 = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
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
    //点检任务排序
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
    //超期点检任务排序
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
    //点检任务列表
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
    //超期点检任务列表
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
    //点检任务搜索
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    //超期点检任务搜索
    searchDetail() {
      Object.keys(this.listsQuery).forEach(key => {
        let item = this.listsQuery[key]
        this.listsQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listsQuery.pageNum = 1
      this.detailData()
    },
    //点检任务重置
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        name: "",
        listType: 'onTime',
        taskType: 'inspection',
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
      }
      this.submitDate = []
      this.$refs.SuperQuery.conditionList = []
      this.createRequirementDate = []
      this.search()
    },
    //超期点检任务重置
    resetDetail() {
      this.$refs['detailTableData'].$refs.JNPFTable.clearSort()
      this.listsQuery = {
        name: "",
        listType: 'overtime',
        taskType: 'inspection',
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
      }
      this.submitDate = []
      this.$refs.SuperQuery1.conditionList = []
      this.createRequirementDate = []
      this.searchDetail()
    },
    //点检
    maintenanceaction(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
      })
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
    