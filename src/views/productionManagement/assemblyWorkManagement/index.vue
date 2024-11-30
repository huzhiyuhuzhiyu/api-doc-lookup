<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>


            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />

                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="dataForm.businessType" placeholder="业务类型" style="width: 100%;" clearable>
                  <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="danger" icon="el-icon-close" @click.native="Cancelshipment()"> 关单
              </el-button>
            </div>
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
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData" v-if="isProjectSwitchFlag"
            :fixedNO="true" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="processName" label="工序名称" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="processCode" label="工序编码" min-width="120" sortable="custom" />
            <el-table-column prop="processingType" label="加工类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.processingType == 'self_produced' ? '自制' : '外协' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="120" sortable="custom" />
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="140" sortable="custom" />
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="140"> </el-table-column>
            <el-table-column prop="personName" label="人员" min-width="160" sortable="custom" />
            <el-table-column prop="workGroupName" label="班组" min-width="160" sortable="custom" />
            <el-table-column prop="equipmentName" label="设备" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="pickingFlag" label="是否领料" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.pickingFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="firstInspection" label="是否首检" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.firstInspection == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="checkFlag" label="是否检验" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.checkFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="reportFlag" label="是否报工" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.reportFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="stockFlag" label="是否入库" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.pickingFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="160"
              sortable="custom"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="taskMethod" label="任务类型" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="taskMethod" label="任务状态" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="taskMethod" label="创建时间" min-width="160" sortable="custom"></el-table-column>
            <el-table-column label="操作" width="320" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="handleUserRelation(scope.row.orderNo, 'report')">报工记录</el-button>

              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

  </div>
</template>
<script>
import { detailordershengchan, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
 
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
// import TaskForm from './taskForm.vue'

export default {

  name: 'assemblyTaskManagement',

  components: { SuperQuery, Form, },
  mixins: [getProjectList],

  data() {

    return {
      columnList: ["pickingFlag", "firstInspection", "checkFlag", "reportFlag", "stockFlag",],
      list: [
        { label: "所有", value: "" },
        { label: "进行中", value: "normal" },
        { label: "关闭", value: "closed" },
        { label: "已完成", value: "finish" },
      ],
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      taskFormVisible: false,
      fullName: '',
      printVisible: false,
      BatchDispatchVisible: false,
      printBrowseVisible: false,

      workOrderVisible: false,

      dataForm: {
        processName: "",
        productionOrderNo: "",
        productionQuantity: '',
        prodOrderStatus: "",
        classAttribute: "finish_product",
        prodOrderStatus: "normal",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },


      reworkVisible: false,

      addOrderVisible: false,


      orderNoS: "",

      productDrawingNoS: "",

      productionPlanNoS: "",

      superQueryVisible: false,

      btnLoading: false,

      title: "更多查询",

      tableData: [],

      listLoading: false,

      detailFlag: false,

      orderForm: {},

      orderFormlist: {

        productDrawingNo: "",

        productionPlanNo: "",

        orderNo: "",

        orderStatus: "normal",

        classAttribute: "finish_product",

        pageNum: 1,

        pageSize: 20,

        superQuery: {

          condition: [],

          matchLogic: ""

        },

        orderItems: [{

          asc: false,

          column: ""

        }, {

          asc: false,

          column: "create_time"

        }],

      },

      total: 0,

      formVisible: false,
      selectArr: [],
      superQueryJson: [

        {

          prop: 'orderNo',

          label: "生产任务单号",

          type: 'input'

        },

        {

          prop: 'orderType',

          label: "任务类型",

          type: 'select',

          options: [

            { label: "正常订单", value: "normal" },

            { label: "返工订单", value: "rework" },

          ]

        },

        {

          prop: 'productDrawingNo',

          label: "品名规格",

          type: 'input'

        },

        {

          prop: 'productCode',

          label: "产品编码",

          type: 'input'

        },

        {

          prop: 'mainUnit',

          label: "单位",

          type: 'input'

        },

        {

          prop: 'productionQuantity',

          label: "总生产数量",

          type: 'input'

        },

        {

          prop: 'completedQuantity',

          label: "已完成数量",

          type: 'input'

        },

        {

          prop: 'routingName',

          label: "工艺路线名称",

          type: 'input'

        },

        {

          prop: 'routingCode',

          label: "工艺路线编码",

          type: 'input'

        },



        {

          prop: 'sealingCoverTyping',

          label: "打字内容",

          type: 'select',

          options: []

        },

        {

          prop: 'accuracyLevel',

          label: "精度等级",

          type: 'select',

          options: []

        },

        {

          prop: 'vibrationLevel',

          label: "振动等级",

          type: 'select',

          options: []

        },



        {

          prop: 'oil',

          label: "油脂",

          type: 'select',

          options: []

        },

        {

          prop: 'oilQuantity',

          label: "油脂量",

          type: 'select',

          options: []

        },

        {

          prop: 'clearance',

          label: "游隙",

          type: 'select',

          options: []

        },

        {

          prop: 'packagingMethod',

          label: "包装方式",

          type: 'select',

          options: []

        },

        {

          prop: 'specialRequire',

          label: "特殊要求",

          type: 'select',

          options: []

        },

        {

          prop: 'productionPlanNo',

          label: "生产计划单号",

          type: 'input'

        },



        {

          prop: 'urgentFlag',

          label: "是否紧急",

          type: 'select',

          options: [

            { label: "是", value: true },

            { label: "否", value: false },

          ]

        },

        {

          prop: 'createTime',

          label: '创建时间',

          type: 'daterange',

          valueFormat: "yyyy-MM-dd HH:mm:ss",

          startPlaceholder: '开始日期',

          endPlaceholder: '结束日期',

        },

        {

          prop: 'createByName',

          label: "创建人",

          type: 'input'

        },

      ],
    
  
      workOrderData: [],
      selectWorkOrder: [],
      flowCardCode: '',
      workOrderRule: {

        productionQuantity: [{ required: true, message: '请输入生产数量', trigger: 'blur' }],

        enCode: [{ required: true, message: '请选择打印模版', trigger: 'change' }]

      },
      printQuery: {

        category: 'Productionmanage'

      },
      enCode: '',
      printList: [],
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    // 改派
    updataDispatch(id) {
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(id, 'all')
      })
    },
    // 新建返工

    addTaskFun(id, type) {

      this.reworkVisible = true

      this.$nextTick(() => {

        this.$refs.reworkForm.init(id, type)

      })

    },

    // 追加
    addition2() {
      if (!this.selectArr.length) return this.$message.error("请选择您要追加生产的数据!")
      if (this.selectArr.length > 1) return this.$message.error("追加生产只支持单条数据操作")
      if (this.selectArr[0].orderType == 'rework') return this.$message.error("返工任务不可追加生产")
      this.form = this.selectArr[0]
      this.addOrderVisible = true
    },
    addition1(data) {
      this.form = data
      this.addOrderVisible = true
    },



    reassignmentFun2() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请选择您要改派的数据!")
      if (this.selectArr.length > 1) return this.$message.error("改派只支持单条数据操作")
      if (this.selectArr[0].taskMethod != 'appoint') return this.$message.error("改派只支持编排方式为指定加工对象的数据")
      this.BatchDispatchVisible = true

      this.$nextTick(() => {

        this.$refs.BatchDispatchForm.init(this.selectArr[0].id, 'all')

      })

    },

    reassignmentFun1(data) {



      this.BatchDispatchVisible = true

      this.$nextTick(() => {

        this.$refs.BatchDispatchForm.init(id, 'all')

      })

    },

 

    // 多选

    handleSelectionChange(val) {

      this.selectArr = val

    },

    //禁用复选框

    checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        return false
      } else {
        return true
      }
    },
 
 
    superQuerySearch(query) {

      this.orderForm.superQuery = query

      this.superQueryVisible = false

      this.search('super')

    },
    sortChange({ prop, order }) {

      let newProp;

      if (prop === 'partnerCode' || prop == 'projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo' || prop == 'productCode' || prop == 'routingName' || prop == 'routingCode') {

        if (prop === 'createByName') {

          newProp = 'create_by'

        } else {

          newProp = prop

        }

      } else {

        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }

      this.orderForm.orderItems[0].asc = order !== "descending"

      this.orderForm.orderItems[0].column = order === null ? "" : newProp



      this.initData()

    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {

      this.formVisible = false

      this.reworkVisible = false

      this.BatchDispatchVisible = false

      this.taskFormVisible = false

      this.search()

    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      ordershengchanList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.search('basic')
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQuotationsendlist(id).then(res => {
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
    },
    viewDetailFun(id) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm.init(id)
      })
    },
    columnSetFun() {

      this.$refs.dataTable.showDrawer()

    },

   
 
 
 
    handleSelectWork(val) {
      if (val.length) {
        this.workOrderData.forEach(item => {
          if (item.id != val[0].id) {
            item.selectFlag = true
          }
        });
        this.selectWorkOrder = val
      } else {
        this.workOrderData.forEach(item => {
          item.selectFlag = false
        });
      }
    },
    
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
</style>
