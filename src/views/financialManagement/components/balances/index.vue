<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4" v-for="item in searchList" :key="item.prop">

            <el-form-item>
              <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                clearable />
              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;">
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery[item.prop]" type="month"
                value-format="yyyy-MM" style="width: 100%;" :clearable="false" popper-class="date_form"
                @change="search()">
              </el-date-picker>
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
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button type="primary" size="mini" icon="el-icon-plus"
              @click="addOrUpdateHandle(listQuery.accountPeriod, reconciliationType, 'normal')" :disabled="!tableData.length
                || tableData[0].accountPeriod !== listQuery.accountPeriod
                || tableData[0].accountPeriod !== accountPeriodList[0]">结存</el-button>
            <el-button type="primary" size="mini" icon="el-icon-refresh-left"
              @click="addOrUpdateHandle(listQuery.accountPeriod, reconciliationType, 'reverse')" :disabled="!tableData.length
                || tableData[0].accountPeriod !== listQuery.accountPeriod
                || accountPeriodList.includes(tableData[0].accountPeriod)
                || accountPeriodList.length > 1
                || isInCurrentOrLastMonth(tableData[0].accountPeriod)">反结存</el-button>
            <el-button type="primary" size="mini" :disabled="!tableData.length" icon="el-icon-download"
              @click="exportForm">导出</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <!-- show-summary :summary-method="getSummaries"  合计行处理 后续需要 放入 -->
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO custom-column>
          <template v-for="item in tableItems">
            <el-table-column v-if="item.prop == 'balanceState'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 130" align="center" :sortable="item.sortable">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.balanceState === 'not_finished'">未完成</el-tag>
                <el-tag type="success" v-else-if="scope.row.balanceState === 'finished'">已完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.prop == 'paymentCycle'" :prop="item.prop" :key="item.prop"
              :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130"
              :sortable="item.sortable">
              <template slot-scope="scope">
                <div v-if="scope.row.paymentCycle === '30DAY'">30天</div>
                <div v-else-if="scope.row.paymentCycle === '45DAY'">45天</div>
                <div v-else-if="scope.row.paymentCycle === '60DAY'">60天</div>
                <div v-else-if="scope.row.paymentCycle === '75DAY'">75天</div>
                <div v-else-if="scope.row.paymentCycle === '90DAY'">90天</div>
                <div v-else-if="scope.row.paymentCycle === 'DELIVERY'">票到付款</div>
                <div v-else-if="scope.row.paymentCycle === 'KDFH'">款到发货</div>
                <div v-else>{{ scope.row.paymentCycle }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="['currentBillingAmount', 'currentInboundOutboundAmount', 'duePaymentAmount', 'currentActualAmount', 'overduePaymentAmount'].includes(item.prop)"
              :prop="item.prop" :key="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 130" :sortable="item.sortable">
              <!-- <template slot-scope="scope">
                <el-link type="primary" @click.native="linesTable(item.prop, scope.row)">
                  {{ scope.row[item.prop] }}
                </el-link>
              </template> -->
            </el-table-column>
            <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 130" :sortable="item.sortable" />

          </template>

        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <lineTables v-if="lineVisible" ref="lineForm" :reconciliationType="reconciliationType" :listMethod="lineMathods"
      :listRequestObj="lineRequestObj" :tableItems="lineTableItems" :searchList="lineSearchList"
      :searchListMore="lineSearchListMore" @close="closeForm" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import Form from './Form'
import lineTables from './lineTables.vue'
import { paymentBalanceCan, paymentStockLine } from '@/api/balances/index'
import { excelExport } from '@/api/basicData/index'
import { getfinInvoiceRecords, getfinPaymentRecords } from '@/api/financialManagement/index'
import { getfinAccountsReport } from '@/api/ReconciliaRePayments/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'payment',
  components: { Form, ExportForm, lineTables, SuperQuery },
  props: {
    reconciliationType: {
      type: String,
      required: true
    },
    showLabel: {
      type: String,
      required: true
    },
    showLabel2: {
      type: String,
      required: true
    },
    showLabel3: {
      type: String,
      required: true
    },
    tableItems: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchList: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchListMore: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },
    /* 列表数据请求体 */
    listRequestObj: {
      type: Object | Function,
      required: true
      /* 
        对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        函数写法：(rowIndex) => {
          let id = this.linesList[rowIndex].id
          return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        }
      */
    },
    superQueryJson: {
      type: Array,
      default: () => []
    },
    columnList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      superQueryVisible: false,
      title: '更多查询',
      tableData: [],
      listLoading: false,
      visible: false,
      lineVisible: false,
      listQuery: {},
      accountPeriodList: [],
      exportFormVisible: false,
      total: 0,
      formVisible: false,
      cooperativePartnerId: '',
      totalList: [],
      // 明细列表数据
      lineMathods: null,
      lineRequestObj: {},
      lineTableItems: [],
      lineSearchList: [],
      lineSearchListMore: [],

      // 开票 列表参数
      // makeMathods:getfinInvoiceRecords,
      initmakeQuery: {
        cooperativePartnerId: '',
        createByName: "",
        endTime: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }
        ],
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        invoiceStartDate: '',
        invoiceEndDate: '',
        reconciliationType: this.reconciliationType,
        startTime: "",
        accountPeriod: '',
        invoiceDateArr: [],
        reconciliationDateArr: [],
      },
      makeTableItem: [
        { prop: "orderNo", label: "对账单流水号", minWidth: 180 },
        { prop: "reconciliationDate", label: "对账日期", minWidth: 180 },
        { prop: "invoicingAmount", label: this.showLabel3 + '票金额', },
        { prop: "invoiceDate", label: this.showLabel3 + '票日期' },
        { prop: "invoiceCode", label: "发票代码" },
        { prop: "invoiceNumber", label: "发票号码" },
        { prop: "createTime", label: "创建时间", minWidth: '180' },
        { prop: "createByName", label: "创建人" },
      ],
      makeSearchList: [
        { prop: "orderNo", label: "对账单流水号", type: 'input' },
        { prop: "invoiceDateArr", label: this.showLabel3 + '票日期', type: 'date', placeholder: this.showLabel3 + '票' },
        { prop: "invoiceCode", label: "发票代码", type: 'input' },
        { prop: "invoiceNumber", label: "发票号码", type: 'input' },
      ],
      makeSearchListMore: [
        { prop: "orderNo", label: "对账单流水号", type: 'input' },
        { prop: "reconciliationDateArr", label: "对账日期", type: 'date', placeholder: '对账' },
        { prop: "invoiceDateArr", label: this.showLabel3 + '票日期', type: 'date', placeholder: this.showLabel3 + '票' },
        { prop: "invoiceCode", label: "发票代码", type: 'input' },
        { prop: "invoiceNumber", label: "发票号码", type: 'input' },
      ],
      // 出入库
      inboundAndOutQuery: {
        accountPeriod: "",
        batchNumber: "",
        cooperativePartnerId: '',
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        moveOrderNo: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }
        ],
        pageNum: 1,
        pageSize: 20,
        productsCode: "",
        productsDrawingNo: "",
        productsName: "",
        reconciliationType: this.reconciliationType,
        documentType: this.reconciliationType !== 'receivable' ? 'inbound' : 'outbound',
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        createTimeArr: [],
      },
      inboundAndOutTableItem: [
        { prop: 'moveOrderNo', label: this.showLabel2 + '库单号', minWidth: '180' },
        { prop: 'productsCode', label: '产品编码', minWidth: '140' },
        { prop: 'productsName', label: '产品名称' },
        { prop: 'productsDrawingNo', label: '产品图号', minWidth: '300' },
        { prop: 'batchNumber', label: '批次号', minWidth: '180' },
        { prop: 'mainUnit', label: '单位', minWidth: '80' },
        { prop: 'num', label: this.showLabel2 + '库数量' },
        // { prop: 'costPrice', label: this.showLabel2 + '库单价' },
        // { prop: 'totalAmount', label: this.showLabel2 + '库金额' },
        { prop: 'costPrice', label: this.showLabel2 + '库单价(含税)', minWidth: '140' },
        { prop: 'totalWithTaxAmount', label: this.showLabel2 + '库金额(含税)', minWidth: '140' },
        { prop: 'createTime', label: '创建时间', minWidth: '180' },
        { prop: "createByName", label: "创建人" },
      ],
      inboundAndOutSearchList: [
        { prop: "moveOrderNo", label: this.showLabel2 + '库单号', type: 'input' },
        { prop: 'productsName', label: '产品名称', type: 'input' },
        { prop: 'productsDrawingNo', label: '产品图号', type: 'input' },
      ],
      inboundAndOutSearchListMore: [
        { prop: "moveOrderNo", label: this.showLabel2 + '库单号', type: 'input' },
        { prop: 'productsCode', label: '产品编码', minWidth: '140', type: 'input' },
        { prop: 'productsName', label: '产品名称', type: 'input' },
        { prop: 'productsDrawingNo', label: '产品图号', type: 'input' },
        { prop: 'batchNumber', label: '批次号', type: 'input', minWidth: '180' },
        { prop: 'createTimeArr', label: '创建时间', type: 'dateTime', placeholder: '创建' },
      ],
      // 到期
      dueQuery: {
        accountPeriod: "",
        approvalStatus: "",
        billingStatus: "",
        cooperativePartnerCode: "",
        cooperativePartnerId: '',
        cooperativePartnerName: "",
        createByName: "",
        createEndTime: "",
        createStartTime: "",
        documentStatus: "",
        dueBillFlag: true,
        endTime: "",
        endUpdateTime: "",
        invoiceStatus: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }
        ],
        orderNo: "",
        overdueBillFlag: false,
        pageNum: 1,
        pageSize: 20,
        paymentStatus: "",
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: this.reconciliationType,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
      },
      dueTableItem: [
        { prop: "orderNo", label: "对账单流水号", minWidth: 180 },
        { prop: "reconciliationDate", label: "对账日期", minWidth: 180 },
        { prop: "totalReconciliationAmount", label: '对账' + this.showLabel + '款总金额', minWidth: 150 },
        { prop: "totalPaymentAmount", label: '已' + this.showLabel + '款总金额', },
        { prop: "totalUnpaidAmount", label: '未' + this.showLabel + '款总金额', },
        { prop: "approvalCompletionDate", label: "审批通过时间", minWidth: 180 },

        { prop: "paymentCycle", label: this.showLabel + '款周期', },
        { prop: "paymentDate", label: "到期时间", },

        { prop: "createTime", label: "创建时间", minWidth: '180' },
        { prop: "createByName", label: "创建人" },
      ],
      dueSearchList: [
        { prop: "orderNo", label: "对账单流水号", type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date', placeholder: '对账' },
      ],
      dueSearchListMore: [],

      // 本期
      currentQuery: {
        accountPeriod: "",
        cooperativePartnerId: '',
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }
        ],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        paymentEndDate: "",
        paymentStartDate: "",
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: this.reconciliationType,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
      },
      currentTableItem: [
        { prop: "type", label: "付款类型", width: 120 },
        { prop: "orderNo", label: "对账单流水号", minWidth: 180 },
        { prop: "reconciliationDate", label: "对账日期", minWidth: 180 },
        { prop: "paymentAmount", label: this.showLabel + '款金额', },
        { prop: "paymentDate", label: this.showLabel + '款日期', minWidth: 180 },
        { prop: "paymentMethod", label: this.showLabel + '款方式' },
        { prop: "createTime", label: "创建时间", minWidth: '180' },
        { prop: "createByName", label: "创建人" },
      ],
      currentSearchList: [
        { prop: "orderNo", label: "对账单流水号", type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date', placeholder: '对账' },
      ],
      currentSearchListMore: [],
      // 逾期
      overdueQuery: {
        accountPeriod: "",
        approvalStatus: "",
        billingStatus: "",
        cooperativePartnerCode: "",
        cooperativePartnerId: '',
        cooperativePartnerName: "",
        createByName: "",
        createEndTime: "",
        createStartTime: "",
        documentStatus: "",
        dueBillFlag: false,
        endTime: "",
        endUpdateTime: "",
        invoiceStatus: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }
        ],
        orderNo: "",
        overdueBillFlag: true,
        pageNum: 1,
        pageSize: 20,
        paymentStatus: "",
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: this.reconciliationType,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
      },
      overdueTableItem: [
        { prop: "orderNo", label: "对账单流水号", minWidth: 180 },
        { prop: "reconciliationDate", label: "对账日期", minWidth: 180 },
        { prop: "totalReconciliationAmount", label: '对账' + this.showLabel + '款总金额', },
        { prop: "totalPaymentAmount", label: '已' + this.showLabel + '款总金额', },
        { prop: "totalUnpaidAmount", label: '未' + this.showLabel + '款总金额', },
        { prop: "approvalCompletionDate", label: "审批通过时间", },

        { prop: "paymentCycle", label: this.showLabel + "款周期", },
        { prop: "paymentDate", label: "到期时间", },

        { prop: "createTime", label: "创建时间", minWidth: '180' },
        { prop: "createByName", label: "创建人" },
      ],
      overdueSearchList: [
        { prop: "orderNo", label: "对账单流水号", type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date', placeholder: '对账' },
      ],
      overdueSearchListMore: [],

      // // 账单列表
      // makeMathods:getfinAccountsReport,
      // // 出入库列表
      // makeMathods:paymentStockLine,

    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.lineVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = this.totalList.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
        } else {
          sums[index] = null;
        }
      });
      return sums;

    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.visible = false
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.totalList = []
      // this.jnpf.searchTimeFormat(this.listQuery, 'reconciliationDateArr', 'reconciliationStartDate', 'reconciliationEndDate')
      this.listMethod(this.listQuery).then(res => {
        this.tableData = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.total = res.data.page ? res.data.page.total : 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
      paymentBalanceCan(this.reconciliationType).then(res => {
        this.accountPeriodList = res.data || [] // 可结存期
      })
    },

    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.getData()
    },

    addOrUpdateHandle(accountPeriod, reconciliationType, type = 'normal') {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(accountPeriod, reconciliationType, type)
      })
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.listQuery,
          exportType: '1118',
          exportName: '收付款结存',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 明细列表
    linesTable(type, row) {
      this.lineVisible = true
      if (type === 'currentBillingAmount') {
        // 收开票
        this.lineMathods = getfinInvoiceRecords
        this.initmakeQuery.accountPeriod = row.accountPeriod
        this.initmakeQuery.cooperativePartnerId = row.cooperativePartnerId
        this.lineRequestObj = JSON.parse(JSON.stringify(this.initmakeQuery))
        this.lineRequestObj.cooperativePartnerId = row.cooperativePartnerId
        this.lineTableItems = this.makeTableItem
        this.lineSearchList = this.makeSearchList
        this.lineSearchListMore = this.makeSearchListMore
      } else if (type === 'currentInboundOutboundAmount') {
        // 出入库
        this.lineMathods = paymentStockLine
        this.inboundAndOutQuery.accountPeriod = row.accountPeriod
        this.inboundAndOutQuery.cooperativePartnerId = row.cooperativePartnerId
        this.lineRequestObj = JSON.parse(JSON.stringify(this.inboundAndOutQuery))
        this.lineRequestObj.cooperativePartnerId = row.cooperativePartnerId
        this.lineTableItems = this.inboundAndOutTableItem
        this.lineSearchList = this.inboundAndOutSearchList
        this.lineSearchListMore = this.inboundAndOutSearchListMore


      } else if (type === 'duePaymentAmount') {
        // 到期应付
        this.lineMathods = getfinAccountsReport
        this.dueQuery.accountPeriod = row.accountPeriod
        this.dueQuery.cooperativePartnerId = row.cooperativePartnerId
        this.lineRequestObj = JSON.parse(JSON.stringify(this.dueQuery))
        this.lineRequestObj.cooperativePartnerId = row.cooperativePartnerId
        this.lineTableItems = this.dueTableItem
        this.lineSearchList = this.dueSearchList
        this.lineSearchListMore = this.dueSearchListMore
      } else if (type === 'currentActualAmount') {
        // 本期实付
        this.lineMathods = getfinPaymentRecords
        this.currentQuery.accountPeriod = row.accountPeriod
        this.currentQuery.cooperativePartnerId = row.cooperativePartnerId
        this.lineRequestObj = JSON.parse(JSON.stringify(this.currentQuery))
        this.lineRequestObj.cooperativePartnerId = row.cooperativePartnerId
        this.lineTableItems = this.currentTableItem
        this.lineSearchList = this.currentSearchList
        this.lineSearchListMore = this.currentSearchList
      } else if (type === 'overduePaymentAmount') {
        // 逾期应付
        this.lineMathods = getfinAccountsReport
        this.overdueQuery.accountPeriod = row.accountPeriod
        this.overdueQuery.cooperativePartnerId = row.cooperativePartnerId
        this.lineRequestObj = JSON.parse(JSON.stringify(this.overdueQuery))
        this.lineRequestObj.cooperativePartnerId = row.cooperativePartnerId
        this.lineTableItems = this.overdueTableItem
        this.lineSearchList = this.overdueSearchList
        this.lineSearchListMore = this.overdueSearchListMore
      }

      this.$nextTick(() => {
        this.$refs.lineForm.getData(type)
      })
    },
    isInCurrentOrLastMonth(dateString) {
      // 获取当前日期  
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 月份从0开始，0代表1月，11代表12月  

      // 解析输入的日期字符串  
      const [month, day] = dateString.split('-').map(Number);

      // 创建指定日期对象  
      const targetDate = new Date(currentYear, month - 1, day); // month - 1 因为月份从0开始  

      // 获取指定日期的月份  
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      // 检查是否在本月或上月  
      if (targetYear === currentYear) {
        if (targetMonth === currentMonth || targetMonth === currentMonth - 1) {
          return true;
        }
      } else if (targetYear === currentYear - 1 && currentMonth === 0 && targetMonth === 11) {
        // 处理跨年情况：去年12月  
        return true;
      }

      return false;
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />