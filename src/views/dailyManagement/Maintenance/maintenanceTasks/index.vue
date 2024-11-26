<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.name" placeholder="请输入任务名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.equipmentIdCode" placeholder="请输入设备编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.equipmentIdName" placeholder="请输入设备名称" clearable @keyup.enter.native="search()" />
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
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')" />
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

        <JNPF-table ref="dataTable" v-if="istable" :data="tableData" @sort-change="sortChange" fixedNO custom-column>
          <el-table-column prop="name" label="任务名称" min-width="200" sortable="custom">
          </el-table-column>
          <el-table-column prop="level" label="保养等级" min-width="140"></el-table-column>
          <el-table-column prop="cycle" label="周期" width="90"></el-table-column>
          <el-table-column prop="unit" label="单位" width="90"></el-table-column>
          <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" />
          <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
          <!-- <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
              <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
            </template>
          </el-table-column> -->
          <el-table-column prop="cycleType" label="周期类型" width="120" sortable="custom" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
              <div v-else-if="scope.row.cycleType == 'disposable'">
                <el-tag type="success">一次</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="departmentIdName" label="计划保养部门" min-width="150" />
          <el-table-column prop="maintainerIdName" label="计划保养人" width="120"></el-table-column>
          <el-table-column prop="nextMaintenanceTime" label="计划保养日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
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
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { checkmaintenanceList, deletecheckmaintenance } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  mixins: [getProjectList],
  // name: 'maintenanceTasks',
  components: { Form, SuperQuery },
  data() {
    return {
      istable: false,
      isProjectSwitch: '',
      superQueryJson: [
        {
          prop: 'name',
          label: "任务名称",
          type: 'input'
        },
        { // 下拉选
          prop: 'level',
          label: '保养等级',
          type: 'select',
          options: [
            { label: "日常保养", value: "日常保养" },
            { label: "二级保养", value: "二级保养" },
            { label: "三级保养", value: "三级保养" },
            { label: "四级保养", value: "四级保养" },
            { label: "年度保养", value: "年度保养" }
          ]
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
          prop: 'equipmentIdCode',
          label: "设备编码",
          type: 'input'
        },
        {
          prop: 'equipmentIdName',
          label: "设备名称",
          type: 'input'
        },
        { // 下拉选
          prop: 'state',
          label: '状态',
          type: 'select',
          options: [
            { label: '禁用', value: 'disabled' },
            { label: '启用', value: 'enable' }
          ]
        },
        { // 下拉选
          prop: 'cycleType',
          label: '周期类型',
          type: 'select',
          options: [
            { label: '周期', value: 'cycle' },
            { label: '一次', value: 'disposable' }
          ]
        },
        {
          prop: 'departmentIdName',
          label: "计划保养部门",
          type: 'input'
        },
        {
          prop: 'maintainerIdName',
          label: "计划保养人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'nextMaintenanceTime',
          label: '计划保养日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: {}
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryVisible: false,
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
        projectId: '',
        classAttribute: "equipment",
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
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.istable = true
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
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
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      checkmaintenanceList(this.orderForm).then(res => {
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
        classAttribute: "equipment",
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
      this.$refs.SuperQuery.conditionList = []
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
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  
  