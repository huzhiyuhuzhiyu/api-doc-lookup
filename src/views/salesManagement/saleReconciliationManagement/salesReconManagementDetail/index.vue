<template>
  <div class="JNPF-common-layout">
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
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button v-has="'btn_export'" :disabled="tableDataList.length > 0 ? false : true" size="mini"
              type="primary" icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
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

        <JNPF-table  highlight-current-row ref="tableForm" :data="tableDataList" v-if="isProjectSwitchFlag==true"
          @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="orderNo" label="对账单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.accountsReceivableId, 'look')">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reconciliationDate" label="对账日期" min-width="180" sortable="custom" />
          <el-table-column prop="ordersNo" label="销售订单号" min-width="200" sortable="custom" />
          <el-table-column prop="noticeNo" label="销售通知单号" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" sortable="custom" />
          <el-table-column prop="totalReconciliationAmount" label="出入库金额" width="140" sortable="custom">
            <template slot-scope="scope">
              <div :class="scope.row.totalReconciliationAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalReconciliationAmount > 0
                    ? '+' + scope.row.totalReconciliationAmount
                    : scope.row.totalReconciliationAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalReconciliationAmount" label="对账金额" width="130" sortable="custom">
            <template slot-scope="scope">
              <div :class="scope.row.totalReconciliationAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalReconciliationAmount > 0
                    ? '+' + scope.row.totalReconciliationAmount
                    : scope.row.totalReconciliationAmount
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="totalPaymentAmount" label="已收款金额" width="130" sortable="custom">
            <template slot-scope="scope">
              <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalPaymentAmount > 0 ? '+' + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalInvoicingAmount" label="已开票金额" width="130" sortable="custom">
            <template slot-scope="scope">
              <div :class="scope.row.totalInvoicingAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalInvoicingAmount > 0
                    ? '+' + scope.row.totalInvoicingAmount
                    : scope.row.totalInvoicingAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="stockMoveOrderNo" label="出入库单号" width="180" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" width="180" sortable="custom" />
          <el-table-column prop="productName" label="产品名称"  sortable="custom" width="160" v-if="isProductNameSwitch === '1'"
          show-overflow-tooltip></el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" width="180" sortable="custom" />
          <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
          v-if="isProjectSwitch == 1" />
          <el-table-column prop="mainUnit" label="单位" width="80" />
          <el-table-column prop="reconciliationUnitPrice" label="数量" width="80" sortable="custom" />
          <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="120" />
          <el-table-column prop="totalExcludingTaxAmount" label="金额(不含税)" width="120" />
          <el-table-column prop="price" label="单价(含税)" width="100" />
          <el-table-column prop="totalIncludingTaxAmount" label="金额(含税)" width="130" sortable="custom" />
          <el-table-column prop="stockMoveDate" label="出入库日期" sortable="custom" width="180" />

          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="handleUserRelation(scope.row.accountsReceivableId, 'look')" :editText="'查看详情'"
                :hasDel="false"></tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getbuyInquirySheetList, deletebuyInquirySheet } from '@/api/purchasingManagement/purchaseInquirySheet'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getfinAccountLineList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import JNPFForm from '../salesReconManagement/Form.vue'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import withdrawnForm from '../salesReconManagement/withranForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'salesReconManagementDetail',
  components: { JNPFForm, withdrawnForm, SuperQuery, ExportForm },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch:"",
      isProjectSwitchFlag:false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '对账单号',
          type: 'input'
        },
        {
          prop: 'reconciliationDate',
          label: '对账日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'ordersNo',
          label: "销售订单号",
          type: 'input'
        },
        {
          prop: 'noticeNo',
          label: "销售通知单号",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '客户名称',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '客户编码',
          type: 'input'
        },
        {
          prop: 'stockMoveOrderNo',
          label: '出入库单号',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'stockMoveDate',
          label: '出入库日期',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        }
      ],
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '对账单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '客户名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        {
          field: 'stockMoveOrderNo',
          fieldValue: '',
          label: '出入库单号',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        {
          field: 'drawingNo',
          fieldValue: '',
          label: '品名规格',
          symbol: 'like',
          searchType: 1,
          width: 120
        }
      ],
      columnList: ['cooperativePartnerCode', 'totalReconciliationAmount'],
      exportFormVisible: false,
      withdrawnVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      formVisible: false,
      listLoading: false,
      reconciliationDate: [],
      createRequirementDate: [],
      listQuery: {
        active: true,
        approvalStatus: '',
        cooperativePartnerName: '',
        createByName: '',
        createEndTime: '',
        createStartTime: '',
        documentStatus: '',
        endTime: '',
        keyword: '',
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        reconciliationEndDate: '',
        reconciliationStartDate: '',
        reconciliationType: 'receivable',
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: 'stockMoveDate'
          }
        ]
      },
      total: 0,
      formVisible: false,
      isProductNameSwitch: '',

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
 async created() {
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {
          this.superQueryJson.splice(6, 0, {
            prop: 'productName',
            label: '产品名称',
            type: 'input'
          })
    }
    this.superForm = this.listQuery
    this.search('basic')
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag=true
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type) 
      } catch (error) { }
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    sortChange({ prop, order }) {
      let newProp
      if (
        [
          'orderNo',
          'cooperativePartnerName',
          'cooperativePartnerCode',
          'stockMoveOrderNo',
          'productCode',
          'stockMoveDate',
          'productName'
        ].includes(prop)
      ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef)
        let columnList = domRef.columnList.filter((item) => !!item.label && !!item.prop)
        columnList = columnList.map((item) => {
          return { label: item.label, prop: item.prop }
        })
        console.log(columnList, 'columnList')
        this.$nextTick(() => {
          this.$refs.exportForm.init(columnList)
        })
      } else {
        this.$message({
          message: '暂无数据导出',
          type: 'error',
          duration: 1500
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableDataList, 'tableForm')
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1226',
          exportName: '对账单明细',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.withdrawnVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.withdrawnVisible = false
      this.reset()
    },
    moreQueries() {
      this.visible = true
    },

    initData() {
      if (this.reconciliationDate && this.reconciliationDate.length > 0) {
        this.listQuery.reconciliationStartDate = this.reconciliationDate[0]
        this.listQuery.reconciliationEndDate = this.reconciliationDate[1]
      } else {
        this.listQuery.reconciliationStartDate = ''
        this.listQuery.reconciliationEndDate = ''
      }
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.createStartTime = this.createRequirementDate[0] + ' 00:00:00'
        this.listQuery.createEndTime = this.createRequirementDate[1] + ' 23:59:59'
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      if (localStorage.getItem('loginTenant')) {
        this.listQuery.tenant = localStorage.getItem('loginTenant')
      }
      this.listLoading = true
      getfinAccountLineList(this.listQuery)
        .then((res) => {
          console.log(res, '对账单列表')
          res.data.records.forEach((item) => {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.excludingTaxAmount - item.adjustExcludingTaxAmount)
            item.taxAmount = this.jnpf.numberFormat(item.taxAmount - item.adjustTaxAmount)
          })
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
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
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.superForm = this.listQuery = {
        approvalStatus: '',
        cooperativePartnerName: '',
        createByName: '',
        createEndTime: '',
        createStartTime: '',
        documentStatus: '',
        endTime: '',
        keyword: '',
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        reconciliationEndDate: '',
        reconciliationStartDate: '',
        reconciliationType: 'receivable',
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: 'stockMoveDate'
          }
        ]
      }
      this.reconciliationDate = []
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '对账单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '客户名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        {
          field: 'stockMoveOrderNo',
          fieldValue: '',
          label: '出入库单号',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        {
          field: 'drawingNo',
          fieldValue: '',
          label: '品名规格',
          symbol: 'like',
          searchType: 1,
          width: 120
        }
      ]
      this.createRequirementDate = []
      this.search('basic')
    },
    addSupplier(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, type)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deletebuyInquirySheet(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    // 重新提交和撤回
    withdrawnAddHandle(id, type) {
      let row = {}
      let dataFormTwo = []
      getfinAccountDetail(id).then((res) => {
        console.log(res, '详情')
        row = {
          cooperativePartnerName: res.data.cooperativePartnerName,
          cooperativePartnerId: res.data.cooperativePartnerId,
          excludingTaxAmount: res.data.excludingTaxAmount,
          includingTaxAmount: res.data.includingTaxAmount,
          taxAmount: res.data.taxAmount,
          reconciliationDate: res.data.reconciliationDate,
          totalReconciliationAmount: res.data.totalReconciliationAmount,
          id: '',
          reconciliationType: 'receivable',
          reasonRejection: '',
          documentStatus: 'submit',
          orderNo: '',
          remark: res.data.remark,
          submitDate: '',
          backAmount: '', // 退货总金额
          receiptAmount: '', // 收货总金额
          brTotalAmount: '' // 收/退货总金额
        }
        res.data.reconciliationLines.forEach((item) => {
          if (item.noticeBillVO) {
            dataFormTwo.push(item.noticeBillVO)
          } else {
            dataFormTwo.push(item)
          }
        })
        this.withdrawnVisible = true
        this.$nextTick(() => {
          this.$refs.withdrawnForm.init(row, dataFormTwo, type)
        })
      })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          withdrawn(_data).then((res) => {
            this.$message({
              type: 'success',
              message: '撤回成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    }
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

.red {
  color: red;
}

.green {
  color: #67c23a;
}
</style>
