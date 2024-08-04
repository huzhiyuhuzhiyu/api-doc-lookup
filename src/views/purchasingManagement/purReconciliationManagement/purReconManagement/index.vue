<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.orderNo" placeholder="请输入对账单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="reconciliationDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择对账开始日期" end-placeholder="请选择对账结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <!-- <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')"></topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->

        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column>
          <el-table-column prop="orderNo" label="对账单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reconciliationDate" label="对账日期" min-width="180" sortable="custom" />
          <!-- <el-table-column prop="orderNo" label="对账单号" width="180" sortable="custom" /> -->
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="200" />
          <el-table-column prop="excludingTaxAmount" label="不含税总金额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.excludingTaxAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.excludingTaxAmount > 0 ? '+' + scope.row.excludingTaxAmount : scope.row.excludingTaxAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taxAmount" label="总税额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.taxAmount > 0 ? 'green' : 'red'">
                {{ scope.row.taxAmount > 0 ? '+' + scope.row.taxAmount : scope.row.taxAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="includingTaxAmount" label="含税总金额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.includingTaxAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.includingTaxAmount > 0
                    ? '+' + jnpf.numberFormat(scope.row.includingTaxAmount)
                    : jnpf.numberFormat(scope.row.includingTaxAmount)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalReconciliationAmount" label="对账金额" min-width="180">
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
          <el-table-column prop="totalPaymentAmount" label="已付款金额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">
                {{
                  scope.row.totalPaymentAmount > 0 ? '+' + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalInvoicingAmount" label="已收票金额" min-width="180">
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

          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="180" />
          <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120"
            fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                <el-tag type="warning">审批撤回</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="90" fixed="right">
            <template slot-scope="scope">
              <!-- <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)"> -->
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                    @click.native="withdrawnAddHandle(scope.row.id, 'add')">
                    重新提交
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                    @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                    审批撤回
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- </tableOpts> -->

              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button> -->
              <!-- <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id, scope.row.parentId)" />
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
              </el-dropdown> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入对账单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="对账日期">
              <el-date-picker v-model="reconciliationDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择对账开始日期" end-placeholder="请选择对账结束日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions"></el-date-picker>
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
    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
  </div>
</template>

<script>
import { getbuyInquirySheetList, deletebuyInquirySheet } from '@/api/purchasingManagement/purchaseInquirySheet'

import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import JNPFForm from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import withdrawnForm from './withranForm'
export default {
  name: 'purchaseInquirySheet',
  components: { JNPFForm, withdrawnForm },
  data() {
    return {
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
        reconciliationType: 'payable',
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      total: 0,
      formVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      if (newProp === 'cooperative_partner_name') {
        newProp = 'cooperativePartnerName'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
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
      this.listLoading = true
      getfinAccountList(this.listQuery)
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
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
        ; (this.listQuery = {
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
          reconciliationType: 'payable',
          startTime: '',
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_time'
            }
          ]
        }),
          (this.reconciliationDate = [])
      this.createRequirementDate = []
      this.search()
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
          reconciliationType: 'payable',
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
          if (item.billGoodsLineVO) {
            dataFormTwo.push(item.billGoodsLineVO)
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
