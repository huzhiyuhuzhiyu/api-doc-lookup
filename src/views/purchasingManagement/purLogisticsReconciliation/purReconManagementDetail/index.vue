<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="tableForm" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                @click="$refs.tableForm.showSortDrawer()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table highlight-current-row ref="tableForm" :data="tableDataList" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_862275" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="orderNo" label="对账单号" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.accountsReceivableId, 'look')">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reconciliationDate" label="对账日期" min-width="180" />
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="200" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="200" />
          <el-table-column prop="totalReconciliationAmount" label="出入库金额" width="140">
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
          <el-table-column prop="totalReconciliationAmount" label="对账金额" width="130">
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

          <el-table-column prop="totalPaymentAmount" label="已付款金额" width="130">
            <template slot-scope="scope">
              <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalPaymentAmount > 0 ? '+' + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalInvoicingAmount" label="已收票金额" width="130">
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
          <el-table-column prop="logisticsMode" label="物流方式" min-width="180" />
          <el-table-column prop="weight" label="重量" min-width="120" />
          <el-table-column prop="pickMaterial" label="提货费" min-width="90" />
          <el-table-column prop="deliveryMaterial" label="送货费" min-width="90" />
          <el-table-column prop="freight" label="运费" min-width="90" />
          <el-table-column prop="totalReconciliationAmount" label="金额" width="90">
            <template slot-scope="scope">
              <div style="color:red">
                -{{ scope.row.totalReconciliationAmount }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="handleUserRelation(scope.row.accountsReceivableId, 'look')" :editText="'查看详情'"
                :hasDel="false"></tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>
    <PayableLogisticsForm v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
<!--    <JNPF-Form v-else-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />-->
<!--    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />-->
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { deletebuyInquirySheet } from '@/api/purchasingManagement/purchaseInquirySheet'

import { getfinAccountLineList, getfinAccountDetail } from '@/api/ReconciliaRePayments'
// import JNPFForm from '../purReconciliation/Form.vue'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
// import withdrawnForm from '../purReconciliation/withranForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData'
import PayableLogisticsForm from "@/views/purchasingManagement/purReconciliationManagement/purReconciliation/PayableLogisticsForm.vue";
export default {
  name: 'purReconManagementDetail',
  components: { PayableLogisticsForm, SuperQuery, ExportForm },
  props: {
    // queryObject: {
    //   type: Object,
    //   default: () => ({})
    // }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [{
            prop: 'orderNo',
            symbol: 'like',
            fixed: true
          }, {
            prop: 'cooperativePartnerName',
            symbol: 'like',
            fixed: true
          }, {
            prop: 'stockMoveOrderNo',
            symbol: 'like',
            fixed: true
          }],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'stockMoveDate'
            }
          ]
        },
      }],
      superQueryVisible: false,
      superQueryJson: [],
      columnList: ['cooperativePartnerCode', 'totalReconciliationAmount'],
      withdrawnVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      listLoading: false,
      reconciliationDate: [],
      createRequirementDate: [],
      listQuery: {
        active: true,
        reconciliationType: 'payable_logistics',
        // ...this.queryObject,
      },
      total: 0,
      formVisible: false,
      exportFormVisible: false
    }
  },
  async created() {},
  methods: {
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
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
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },

    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();


      this.listLoading = true
      getfinAccountLineList(this.listQuery)
      .then((res) => {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
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
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        this.listLoading = false
      })
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
        row = {
          cooperativePartnerName: res.data.cooperativePartnerName,
          cooperativePartnerId: res.data.cooperativePartnerId,
          excludingTaxAmount: res.data.excludingTaxAmount,
          includingTaxAmount: res.data.includingTaxAmount,
          taxAmount: res.data.taxAmount,
          reconciliationDate: res.data.reconciliationDate,
          totalReconciliationAmount: res.data.totalReconciliationAmount,
          id: '',
          reconciliationType: this.listQuery.reconciliationType,
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
