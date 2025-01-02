<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
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
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.deliveryDateArr"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>

            </template>
            <el-col :span="5">
              <el-form-item>
                <el-date-picker v-model="deliveryDateArr" start-placeholder="交货开始日期" end-placeholder="交货结束日期" clearable
                  type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
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
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')">
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('dataTable')">导出</el-button>
                <el-button :disabled="tableData.length <= 0" size="mini" type="primary" icon="iconfont-menu  icon-chehui" @click="backFn">撤回</el-button>

            </topOpts>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                      hasC
                      :checkSelectable="checkSelectable"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="订单号" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="120" />
            <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="160" sortable="custom" />
            <el-table-column prop="orderType" label="订单类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-for="(item, index) in orderList" :key="index">
                  <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="saleContractNoSwitch === '1'" prop="contractNo" label="客户合同号" min-width="200"></el-table-column>
            <el-table-column prop="departmentName" label="所属部门" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="salesName" label="所属销售 " min-width="140" sortable="custom" />
            <el-table-column prop="orderDate" label="订单日期" min-width="140" sortable="custom"></el-table-column>
            <el-table-column prop="contractNo" label="客户合同号" min-width="140" sortable="custom"></el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期" min-width="140" sortable="custom"></el-table-column>
            <el-table-column prop="num" label="订单数量" min-width="140" sortable="custom"></el-table-column>
            <el-table-column prop="orderState" label="订单状态" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderState == 'not_finish'"><el-tag type="danger">未完成</el-tag></div>
                <div v-else-if="scope.row.orderState == 'finish'"><el-tag type="success">已完成</el-tag></div>
                <div v-else-if="scope.row.orderState == 'part_finish'"><el-tag type="warning">部分完成</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="单据状态" min-width="140" sortable="custom"
              :showOverflowTooltip="false" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                <div v-if="scope.row.documentStatus == 'back'"><el-tag type="danger">撤回</el-tag></div>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="changesCount" label="变更次数" min-width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.changesCount ? scope.row.changesCount : 0 }}</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" sortable="custom" min-width="120" />


            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft'||scope.row.documentStatus=='back' ? false : true"
                  @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>

                <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft'||scope.row.documentStatus=='back' ? false : true"
                  @click="handleDel(scope.row.id)">删除</el-button>
                <!-- :disabled="scope.row.documentStatus == 'draft' ? false : true" -->
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
                    <el-dropdown-item
                      :disabled="scope.row.documentStatus == 'draft' || scope.row.orderState == 'finish' ? true : false"
                      @click.native="closeOrdersFun(scope.row.id)">
                      关单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="getCopyOrders(scope.row.id, 'copy')">
                      复制订单
                    </el-dropdown-item>
                    <el-dropdown-item :disable="scope.row.documentStatus === 'draft'"
                      @click.native="printFun(scope.row.id)">
                      打印
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">
          </pagination>
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList"
      :saleContractNoSwitch="saleContractNoSwitch" />


    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>

<script>
import { UserListAll, } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, closeOrders ,batchRevokeSaleOrder} from '@/api/salesManagement/assemblyOrders'
import Form from './Form'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
import {getQueryConfirm} from '@/utils';
import {batchRevokeOrder} from '@/api/purchasingAndOutsourcingOrders';
import {ApprovalStatus, DocumentStatus} from '@/views/esop/fileUpload/workinginstruction/utils/constant';
export default {
  name: 'orderList',
  components: { Form, ExportForm, SuperQuery,      PrintBrowse,
    PrintDialog, },
  data() {
    return {
      printVisible: false,
      printBrowseVisible: false,

      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },

      ],


      superQueryVisible: false,
      columnList: ["cooperativePartnerCode", "departmentName", "workOrderNo", "contractNo", "changesCount", "createByName",],
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      treeData: [],
      tableData: [],
      tableData1: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: "orderList",
      salespersonList: [],
      detailFlag: false,
      orderStateList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "部分完成", value: "part_finish" },
      ],
      partialList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "已停止", value: "stopped" },
      ],
      orderList: [
        { label: "正常任务", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      orderProduceStateList: [
        { label: "未开始", value: "not_started" },
        { label: "已排计划", value: "planned" },
        { label: "已开始生产", value: "start_production" },
        { label: "已生产完成", value: "production_completed" },

      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],

      departMentList: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" },
      ],
      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {
        orderNo: "",
        cooperativePartnerName: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },

      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // 获取6个月前的日期
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setHours(0, 0, 0, 0);
          // 如果选择的日期范围超过6个月，或者结束日期不是当前日期，则禁用
          return time.getTime() < sixMonthsAgo || time.getTime() > today;
        }
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      createTimeArr: [],
      deliveryDateArr: [],
      orderDateArr: [],
      CompletionDate: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      filterText: '',

      superQueryJson: [
        {
          prop: 'orderNo',
          label: "订单号",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: "客户名称",
          type: 'input'
        },

        {
          prop: 'orderType',
          label: "订单类型",
          type: 'select',

          options: [
            { label: "正常任务", value: "normal" },
            { label: "预测订单", value: "prediction" },
            { label: "样品订单", value: "sample" },
            { label: "备货订单", value: "stock_up" },
            { label: "急件订单", value: "urgent" },
          ]

        },
        {
          prop: 'departmentName',
          label: "所属部门",
          type: 'custom',
          component: 'com-select',
        },
        {
          prop: 'salesName',
          label: "所属销售",
          type: 'custom',
          component: 'user-select',
        },

        {
          prop: 'orderDate',
          label: '订单日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'contractNo',
          label: "客户合同号",
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }, {
          prop: 'orderState',
          label: "订单状态",
          type: 'select',
          options: [
            { label: "未完成", value: "not_finish" },
            { label: "已完成", value: "finish" },
            { label: "部分完成", value: "part_finish" },
          ]
        },



      ],
      totalDataForm: {},
      saleContractNoSwitch: null,
      prindId: '',
      formId: '',
      enCode: "",
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed: {
    totalNum: function () {
      var totalNum = 0;
      for (var i = 0; i < this.tableData1.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.tableData1[i].num])
      }
      return totalNum
    },



  },

  async created() {
    await Promise.all([
      this.jnpf.getMainUnitFun('orderField', 'customerContractNo'),
    ]).then(([
      saleContractNoSwitch,
    ]) => {
      this.saleContractNoSwitch = saleContractNoSwitch
    }).catch(error => {
      console.error('请求失败:', error);
    });
    this.getUserList()
    this.superForm = this.orderForm
    this.search('basic')
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
      checkSelectable(row) {
          return row.orderState === 'not_finish'
              && row.documentStatus === DocumentStatus.SUBMIT
              && row.approvalStatus !== ApprovalStatus.ING
      },
      async backFn(){
          await getQueryConfirm(this,'是否确认撤回')
          const arr =this.$refs.dataTable.getCurrentSelection()

          if(arr.length === 0){
              this.$message.error('请选择要撤回的数据')
              return
          }
          console.log(arr);
          const res =await batchRevokeSaleOrder(arr.map(item=>item.id))
          if(res.code === 200){
              this.$message.success('撤回成功')
              this.initData()
          }else{
              this.$message.error(res.msg)
          }

      },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

          this.printVisible = false
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    printFun(id) {
      this.enCode = 'p002' // 筛选出 businessType 等于 type 的项
      this.formId = id
      this.fullName = "销售单" // 筛选出 businessType 等于 type 的项
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    closePrint() {
            this.printVisible = false
        },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    closeOrdersFun(id) {
      this.$confirm("您确定关闭该订单吗？", this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        closeOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "关闭成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },

    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },



    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'salesName' || prop == 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },



    // 获取销售人员
    getUserList() {
      let obj = {
        currentPage: 1,
        pageSize: -1
      }
      UserListAll(obj).then(res => {
        this.salespersonList = res.data.list
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    initData() {
      this.listLoading = true



      getsaleOrderList(this.orderForm).then(res => {
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
      if (this.deliveryDateArr.length) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0]
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }
      this.orderForm.pageNum = 1 // 重置页码
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
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
      this.deliveryDateArr = []
      this.superForm = this.orderForm = {
        orderNo: "",
        cooperativePartnerName: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      }
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },

      ]
      this.$refs.SuperQuery.conditionList = []

      this.search('basic')
    },


    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    getCopyOrders(id, btntype) {
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
          this.$refs.Form.init(id, btntype)
        })
        // }, 600);
      }
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
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
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: '1004',
        exportName: '销售订单',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
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



.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
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

.JNPF-common-head {
  padding: 8px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
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
