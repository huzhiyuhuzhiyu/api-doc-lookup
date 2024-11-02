<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.orderNo" placeholder="请输入对账单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入客户名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col> -->
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
              <el-date-picker v-model="reconciliationDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择对账开始日期" end-placeholder="请选择对账结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
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
          <div></div>
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

        <JNPF-table v-loading="listLoading" highlight-current-row ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="orderNo" label="对账单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reconciliationDate" label="对账日期" width="120" sortable="custom" />

          <!-- <el-table-column prop="orderNo" label="对账单号" width="180" sortable="custom" /> -->
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="200" />
          <el-table-column prop="excludingTaxAmount" label="总金额(不含税)" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.excludingTaxAmount > 0 ? 'green' : 'red'">{{ scope.row.excludingTaxAmount > 0 ? '+'
                + scope.row.excludingTaxAmount : scope.row.excludingTaxAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="taxAmount" label="总税额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.taxAmount > 0 ? 'green' : 'red'">{{ scope.row.taxAmount > 0 ? '+' +
                scope.row.taxAmount : scope.row.taxAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="includingTaxAmount" label="总金额(含税)" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.includingTaxAmount > 0 ? 'green' : 'red'">{{ scope.row.includingTaxAmount > 0 ? '+'
                + scope.row.includingTaxAmount : scope.row.includingTaxAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalReconciliationAmount" label="对账金额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.totalReconciliationAmount > 0 ? 'green' : 'red'">{{
                scope.row.totalReconciliationAmount > 0 ? '+' + scope.row.totalReconciliationAmount :
                  scope.row.totalReconciliationAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalPaymentAmount" label="已收款金额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">{{ scope.row.totalPaymentAmount > 0 ? '+'
                + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalInvoicingAmount" label="已开票金额" min-width="180">
            <template slot-scope="scope">
              <div :class="scope.row.totalInvoicingAmount > 0 ? 'green' : 'red'">{{ scope.row.totalInvoicingAmount > 0 ?
                '+' + scope.row.totalInvoicingAmount : scope.row.totalInvoicingAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="180" />
          <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120"
            v-if="showAppCodeFlag">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
              <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag
                  type="warning">审批撤回</el-tag></div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <!-- <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)"> -->
              <el-button type="text" size="mini"
                v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag"
                @click.native="withdrawnAddHandle(scope.row.id, 'add')"> 重新提交</el-button>
              <el-button type="text" size="mini" v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                @click.native="withdrawnHandle(scope.row.id, 'withdrawn')"> 审批撤回</el-button>

              <el-dropdown hide-on-click
                v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn' || scope.row.approvalStatus === 'ing'">
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
              <el-button v-else type="text" size="mini" @click.native="handleUserRelation(scope.row.id, 'look')">
                查看详情</el-button>
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

    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getbuyInquirySheetList, deletebuyInquirySheet } from '@/api/purchasingManagement/purchaseInquirySheet'

import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import JNPFForm from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
import withdrawnForm from './withranForm'
export default {
  name: 'purchaseInquirySheet',
  components: { JNPFForm, SuperQuery, withdrawnForm },
  data() {
    return {
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superForm: {},
      columnList: ['cooperativePartnerCode', 'createByName'],
      withdrawnVisible: false,
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      reconciliationDate: [],
      createRequirementDate: [],
      listQuery: {
        active: true,
        approvalStatus: "",
        cooperativePartnerName: "",
        createByName: "",
        createEndTime: "",
        createStartTime: "",
        documentStatus: "",
        endTime: "",
        keyword: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: 'outside_processing',
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {}
      },
      total: 0,
      formVisible: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "对账单号",
          type: 'input'
        },
        {
          prop: 'reconciliationDate',
          label: '对账日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'cooperativePartnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'excludingTaxAmount',
          label: "不含税总金额",
          type: 'input'
        }, {
          prop: 'taxAmount',
          label: "总税额",
          type: 'input'
        }, {
          prop: 'totalReconciliationAmount',
          label: "对账金额",
          type: 'input'
        }, {
          prop: 'totalPaymentAmount',
          label: "已收款金额",
          type: 'input'
        }, {
          prop: 'totalInvoicingAmount',
          label: "已开票金额",
          type: 'input'
        }, {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }, {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }, {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },

        {
          prop: 'approvalStatus',
          label: "审批状态",
          type: 'select',

          options: [
            { label: "审批中", value: "ing" },
            { label: "审批通过", value: "ok" },
            { label: "审批拒绝", value: "rebut" },
            { label: "withdrawn", value: "withdrawn" },
          ]

        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
      ],
      showAppCodeFlag: true
    }
  },
  async created() {
    const res = await this.jnpf.getBusInfo('b014')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('basic')
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'cooperativePartnerName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
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
        this.listQuery.createStartTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.createEndTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      this.superForm = this.listQuery
      this.listLoading = true
      getfinAccountList(this.superForm).then(res => {
        console.log(res, '对账单列表');
        res.data.records.forEach(item => {
          item.excludingTaxAmount = this.jnpf.numberFormat(item.excludingTaxAmount - item.adjustExcludingTaxAmount)
          item.taxAmount = this.jnpf.numberFormat(item.taxAmount - item.adjustTaxAmount)
        });
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
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
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        approvalStatus: "",
        cooperativePartnerName: "",
        createByName: "",
        createEndTime: "",
        createStartTime: "",
        documentStatus: "",
        endTime: "",
        keyword: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: 'outside_processing',
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      this.reconciliationDate = []
      this.createRequirementDate = []
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.superForm = JSON.parse(JSON.stringify(this.listQuery))
      this.$refs.SuperQuery.conditionList = []
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
      }).then(() => {
        deletebuyInquirySheet(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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
      getfinAccountDetail(id).then(res => {
        console.log(res, '详情');
        row = {
          cooperativePartnerName: res.data.cooperativePartnerName,
          cooperativePartnerId: res.data.cooperativePartnerId,
          excludingTaxAmount: res.data.excludingTaxAmount,
          includingTaxAmount: res.data.includingTaxAmount,
          taxAmount: res.data.taxAmount,
          reconciliationDate: res.data.reconciliationDate,
          totalReconciliationAmount: res.data.totalReconciliationAmount,
          id: '',
          reconciliationType: 'outside_processing',
          reasonRejection: '',
          documentStatus: 'submit',
          orderNo: "",
          remark: res.data.remark,
          submitDate: '',
          backAmount: '',                      // 退货总金额
          receiptAmount: '',                   // 收货总金额
          brTotalAmount: '',                   // 收/退货总金额
        }
        res.data.reconciliationLines.forEach(item => {
          if (item.noticeBillVO) {
            dataFormTwo.push(item.noticeBillVO)
          } else {
            dataFormTwo.push(item)
          }
        });
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
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
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
  color: red
}

.green {
  color: #67C23A;
}
</style>