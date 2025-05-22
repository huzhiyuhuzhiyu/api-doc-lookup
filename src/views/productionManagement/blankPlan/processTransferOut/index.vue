<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4" v-if="item.hasOwnProperty('render') ? item.render : true">
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
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleProcessOut()">创建外协订单</el-button>
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
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData"
            :fixedNO="true"  @selection-change="handleSelectionChange" hasC
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="viewDetailFun(scope.row.productionOrderId)">{{
                  scope.row.productionOrderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType === 'normal'">正常任务</div>
                <div v-if="scope.row.orderType === 'rework'">返工任务</div>
                <div v-if="scope.row.orderType === 'manually'">新建任务</div>
              </template>
            </el-table-column>
            <el-table-column prop="prodOrderStatus" label="任务状态" min-width="120" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.prodOrderStatus === 'finish'" type="success">已完成</el-tag>
                <el-tag v-else-if="scope.row.prodOrderStatus === 'normal'" type="warning">进行中</el-tag>
                <el-tag v-else-if="scope.row.prodOrderStatus === 'suspend'" type="danger">暂停</el-tag>
                <el-tag v-else-if="scope.row.prodOrderStatus === 'closed'" type="danger">关闭</el-tag>
                <el-tag v-else>{{ scope.row.prodOrderStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="工单单号" min-width="200" />
            <el-table-column prop="productCode" label="产品编码" min-width="120" />
            <el-table-column prop="productName" label="产品名称" width="160" v-if="$store.getters.configData.product.enable_productName"
              show-overflow-tooltip></el-table-column>
            <el-table-column  prop="productDrawingNo" label="品名规格" min-width="300"></el-table-column>
            <el-table-column prop="productionQuantity" label="计划数量" width="120" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" width="120" />
            <el-table-column prop="outsourcingQuantity" label="已外协数量" width="120" />
            <el-table-column prop="waitOutsourcingQuantity" label="可外协数量" width="120" />
            <el-table-column prop="sort" label="工序所在工艺路线序号" width="200" />
            <el-table-column prop="processName" label="工序名称" min-width="170" />
            <el-table-column prop="processCode" label="工序编码" width="130"></el-table-column>
            <el-table-column prop="processingType" label="加工类型" width="100">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="routingName" label="工艺路线名称" min-width="160" />
            <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" />
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" />
            <el-table-column prop="planStartDate" label="计划开始日期" width="160" />
            <el-table-column prop="planEndDate" label="计划结束日期" width="160" />
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>
    <!-- <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" /> -->
    <TaskForm v-if="taskFormVisible" ref="taskForm" @refreshDataList="initData" @close="closeForm"></TaskForm>
    <OutSouringForm v-if="outSouringFormVisible" ref="OutSouringForm" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { prodOrderClose, prodOrderStart, prodOrderSuspend } from '@/api/productOrdes/finishedProductOrders.js'
import { addOrderNum, detailordershengchan, addProdPurchase } from '@/api/productOrdes/index.js';
import { workTodoOutSouringList } from '@/api/productOrdes/index.js'
import OutSouringForm from '@/views/outsourcingManagement/processOutsourcingOrders/orderCreation/index.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import TaskForm from '../blankTaskManagement/taskFormCopy.vue'
import { getPrintBusInfo } from '@/api/system/printDev'
import { getPrintList } from '@/api/system/printDev'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'processTransferOut',
  components: { OutSouringForm, TaskForm, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      addTaskFormVisible: false,
      purchaseVisible: false,
      taskFormVisible: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [],
      initSearchList: [
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        // { field: 'orderNo', fieldValue: '', label: '工单单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        // { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planDate', fieldValue: '', label: '计划日期', dateType: 'daterange', symbol: '==', searchType: 3, width: 120 },
        { field: 'waitOutsourcingQuantity', fieldValue: '0', label: '计划日期', dateType: 'daterange', symbol: '>', searchType: 3, width: 120,render:false },
        // {
        //   prop: 'aaa',
        //   label: '日期区间',
        //   type: 'daterange',
        //   searchType: 3,
        //   symbol: '==',
        //   valueFormat: "yyyy-MM-dd",
        //   startPlaceholder: '开始日期',
        //   endPlaceholder: '结束日期',
        //   pickerOptions: { ...this.global.timePickerOptions, disabledDate: void (0) }
        // },
        // { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        // {
        //   field: 'prodOrderStatus', fieldValue: 'normal', label: '任务状态', symbol: '==', searchType: 4, width: 120,
        //   options: [
        //     { value: 'finish', label: "已完成" },
        //     { value: 'normal', label: "进行中" },
        //     { value: 'suspend', label: "暂停" },
        //     { value: 'closed', label: "关闭" },
        //   ]
        // },
      ],
      form: {
        appendQuantity: "",
        productionQuantity: "",
        orderNo: ""
      },
      fullName: '',
      printBrowseVisible: false,
      workOrderVisible: false,
      workOrderForm: {
        productionQuantity: '',
        enCode: ''
      },
      BatchDispatchVisible: false,
      reworkVisible: false,
      addOrderVisible: false,
      columnList: [
        // 'productionOrderNo', // 生产任务单号
        'orderType', // 任务类型
        'prodOrderStatus', // 任务状态
        // 'orderNo', // 工单单号
        'productCode', // 产品编码
        // 'productName', // 产品名称
        // 'productDrawingNo', // ="$store
        // 'productionQuantity', // 计划数量
        // 'qualifiedQuantity', // 合格数量
        // 'outsourcingQuantity', // 已外协数量
        // 'waitOutsourcingQuantity', // 可外协数量
        // 'sort', // 工序所在工艺路线序号
        // 'processName', // 工序名称
        'processCode', // 工序编码
        // 'processingType', // 加工类型
        'routingName', // 工艺路线名称
        'routingCode', // 工艺路线编码
        'productionPlanNo', // 生产计划单号
        // 'mainUnit', // 单位
        'planStartDate', // 计划开始日期
        'planEndDate', // 计划结束日期
      ],

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
        // prodOrderStatus: "normal",
        processingType:'external_production',
        notFinishFlag:true,
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
        productSource:'produce'
      },
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        },
        {
          prop: 'orderNo',
          label: "工单号",
          type: 'input'
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'planDate',
          label: '计划日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '计划日期开始',
          endPlaceholder: '计划日期结束',
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
      isProductNameSwitch: "",
      selectDateDialog: false,
      dateForm: {
        planStartDate: "",
        planEndDate: ""
      },
      dateRules: {
        planStartDate: [{ required: true, message: '计划开始日期不能为空', trigger: 'change' }],
        planEndDate: [{ required: true, message: '计划结束日期不能为空', trigger: 'change' }],
      },
      startPickerOptions: {

        disabledDate: (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 将时间设置为当天的凌晨

          return date.getTime() < today.getTime();
        },
      },
      endPickerOptions: {

        disabledDate: (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 将时间设置为当天的凌晨

          return date.getTime() < today.getTime();
        },
      },
      processOutFormVisible: false,
      activeOrderLines: [],
      outSouringFormVisible: false,
    }
  },

  async created() {
    this.searchList = JSON.parse(JSON.stringify(this.initSearchList))

    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.$store.dispatch('base/getBusinessConfig', 'gobal')
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    viewDetailFun(id) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.taskForm);
        this.$refs.taskForm.init(id)
      })
    },
    // 新建返工
    addReworkTaskFun(id, type) {
      this.reworkVisible = true
      this.$nextTick(() => {
        this.$refs.reworkForm.init(id, type)
      })
    },
    // 新建任务
    addTaskFun() {
      this.addTaskFormVisible = true
      this.$nextTick(() => {
        this.$refs.addTaskForm.init('add')
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
    // 改派
    updataDispatch(id) {
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(id, 'all')
      })
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

    // 追加生产数量 提交
    submitFun() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.btnLoading = true
          addOrderNum(this.form).then(res => {
            this.addOrderVisible = false
            this.btnLoading = false
            this.$message.success("追加生产数量成功")
            this.search('basic')
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })

    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //禁用复选框
    checkSelectable(row) {
      return row.processingType !== "self_produced"
    },

    // 关单
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请选择您要关单的任务")
      this.$confirm('您确认关闭选中的任务吗？', this.$t('common.tipTitle'), {
        type: 'warning',
        customClass: 'custom-confirm',
      }).then(() => {

        let arr = this.selectArr.map(item => {
          return item.id
        })
        console.log(arr)
        prodOrderClose(arr).then(res => {
          console.log(555);
          this.$message.success("关单成功")
          this.search('basic')
        }).catch(() => {
        })
      }).catch(() => { })
    },

    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop == 'projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo' || prop == 'productCode' || prop == 'productName' || prop == 'routingName' || prop == 'routingCode') {
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
      this.addTaskFormVisible = false
      this.taskFormVisible = false
      this.selectDateDialog = false
      this.purchaseVisible = false
      this.processOutFormVisible = false
      this.outSouringFormVisible = false
      this.search('basic')
    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      workTodoOutSouringList(this.orderForm).then(res => {
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

      this.searchList = JSON.parse(JSON.stringify(this.initSearchList))
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
      console.log(id);
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    handleProcessOut(submitType) {
      if (!this.selectArr.length) return this.$message.error('请选择要转外协的工序！')
      if (this.selectArr.some(item => item.productionOrderId !== this.selectArr[0].productionOrderId)) return this.$message.error('选择的工序必须是来自同一生产任务！')
      if (!this.isSortedCorrectly(this.selectArr)) return this.$message.error('选择的工序必须连贯！')

      this.selectArr.sort((a,b)=> a.sort - b.sort)
      // 临时存储传递数据到会话
      const processList = this.selectArr.map((item,index) => ({
        projectName: item.projectName,
        projectId: item.projectId,
        productSource: item.productSource, // 产品来源
        classAttribute: item.classAttribute,
        productsId: item.productsId, // 产品id
        productName: item.productName, // 产品名称
        productCode: item.productCode, // 产品编码
        productDrawingNo: item.productDrawingNo, // 品名规格
        ratio: item.ratio, // 转换系数
        calculationDirection: item.calculationDirection, // 计算方向
        mainUnit: item.mainUnit, // 单位
        purchaseQuantity: this.selectArr[0].waitOutsourcingQuantity, // 数量
        price: '', // 含税单价
        totalAmount: '', // 金额(含税)
        taxRate: '', // 税率
        excludingTaxPrice: '', // 不含税单价
        taxAmount: '', // 税额
        excludingTaxAmount: '', // 金额(不含税)
        deputyUnit: item.deputyUnit, // 副单位
        planQuantity: '', //计划数量
        planQuantity2: '', //计划数量副
        remark: item.remark,
        //   增加首选 末选标记
        firstSwitchFlag: item.firstFlag ? true : index === 0,
        lastSwitchFlag :item.lastFlag ? true : index === this.selectArr.length - 1,
        //   增加首道 末道标记
        firstFlag:!!item.firstFlag,
        lastFlag:!!item.lastFlag,
        receiveFlag:item.lastFlag ? true : index === this.selectArr.length - 1,
        deliveryDate: '', // 交期
        processId: item.processId,
        processName: item.processName,
        qty: item.qty,
        waitOutsourcingQuantity: this.selectArr[0].waitOutsourcingQuantity,
        workOrderId: item.id,
      }))
      const preData = {
        productionOrderId: this.activeOrderLines[0].productionOrderId,
        firstUseMaterialList: this.selectArr[0].shipmentList,
        preProcessData: this.selectArr[0],
        processList,
        transferOutFlag:true
      }

      sessionStorage.setItem('preData', JSON.stringify(preData))
      this.outSouringFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs.OutSouringForm.init(null, 'add', preData)
      // })
      return
      // 跳转页面并传递参数到会话
      this.$router.push({
        path: '/outsourcingManagement/processOutsourcingOrders/orderCreation',
        query: { alert: '新建' },
      })
      this.goBack()
      // this.btnLoading = true
      // addOutSouringByWorkLine(this.selectArr.map(item => item.id)).then(res => {
      //   this.btnLoading = false
      // }).catch(error => {
      //   this.btnLoading = false
      // })
    },
    isSortedCorrectly(data) {
        this.activeOrderLines = this.tableData.filter(item => item.productionOrderId === this.selectArr[0].productionOrderId)
        const sortValues = this.activeOrderLines.map(item => item.sort);
        const sortValues2 = data.map(item => item.sort);
        if (data.length === 1) return true
        return JSON.stringify(sortValues) === JSON.stringify(sortValues2);
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
