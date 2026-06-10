<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" :searchList="searchList" tableRef="tableForm" />
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div></div>
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

        <JNPF-table v-loading="listLoading" highlight-current-row ref="tableForm" :data="tableDataList" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_289243" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="orderNo" label="对账单号" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reconciliationDate" label="对账日期" width="120" />
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="200" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="200" />
          <el-table-column prop="excludingTaxAmount" label="不含税总金额" width="140">
            <template slot-scope="scope">
              <div :class="scope.row.excludingTaxAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.excludingTaxAmount > 0 ? '+' + scope.row.excludingTaxAmount : scope.row.excludingTaxAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taxAmount" label="总税额" width="140">
            <template slot-scope="scope">
              <div :class="scope.row.taxAmount > 0 ? 'green' : 'red'">
                {{ scope.row.taxAmount > 0 ? '+' + scope.row.taxAmount : scope.row.taxAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="includingTaxAmount" label="总金额(含税)" width="140">
            <template slot-scope="scope">
              <div :class="scope.row.includingTaxAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.includingTaxAmount > 0 ? '+' + scope.row.includingTaxAmount : scope.row.includingTaxAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalReconciliationAmount" label="对账金额" width="140">
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
          <el-table-column prop="totalPaymentAmount" label="已付款金额" width="140">
            <template slot-scope="scope">
              <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalPaymentAmount > 0 ? '+' + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalInvoicingAmount" label="已收票金额" width="140">
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
          <el-table-column prop="approvalStatus" label="审批状态" align="center" min-width="120"
            v-if="showAppCodeFlag">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                <el-tag type="warning">审批撤回</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="createByName" label="创建人" width="80" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <!-- <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)"> -->
              <el-button type="text" size="mini" v-if="
                (scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag
              " @click.native="withdrawnAddHandle(scope.row.id, 'add')">
                重新提交
              </el-button>
              <el-button type="text" size="mini" v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                审批撤回
              </el-button>

              <el-dropdown hide-on-click v-if="
                scope.row.approvalStatus === 'rebut' ||
                scope.row.approvalStatus === 'withdrawn' ||
                scope.row.approvalStatus === 'ing'
              ">
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-else type="text" size="mini" @click.native="handleUserRelation(scope.row.id, 'look')">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>
    <PayableLogisticsForm v-if="formVisible && queryObject.reconciliationType === 'payable_logistics'" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <JNPF-Form v-else-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
  </div>
</template>

<script>
import { getbuyInquirySheetList, deletebuyInquirySheet } from '@/api/purchasingManagement/purchaseInquirySheet'

import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import JNPFForm from './Form'
import PayableLogisticsForm from './PayableLogisticsForm'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
import withdrawnForm from './withranForm'
export default {
  name: 'purchaseInquirySheet',
  components: { JNPFForm, SuperQuery, withdrawnForm, PayableLogisticsForm },
  props: {
    queryObject: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [
            {
              prop: 'orderNo',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'cooperativePartnerName',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'reconciliationDate', // 属性*
              symbol: 'between', // 比较符*
              timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
              fixed: true // 是否在搜索栏显示
            },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      searchList: [
        {
          prop: 'billStatus',
          label: '对账状态',
          type: 'select',
          options: this.global.reconciliationStatus
        },
      ],
      columnList: [],
      withdrawnVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      tableDataList: [],
      formVisible: false,
      listLoading: false,
      listQuery: {
        reconciliationType: 'payable',
        billStatus: 'reconciled',
        active: true,
        ...this.queryObject,
      },
      total: 0,
      superQueryJson: [],
      showAppCodeFlag: true
    }
  },
  async created() {
    const res = await this.jnpf.getBusInfo('b012')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
  },
  methods: {
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
      this.initData()
    },

    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期
      this.listLoading = true
      getfinAccountList(this.listQuery)
        .then((res) => {
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
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
          projectName: res.data.projectName,
          productName: res.data.productName,
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
          brTotalAmount: '', // 收/退货总金额
          approvalFlag: false
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
