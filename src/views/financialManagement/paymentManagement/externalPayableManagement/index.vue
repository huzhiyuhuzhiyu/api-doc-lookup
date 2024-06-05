<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
     
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
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
          @sort-change="sortChange" @row-dblclick="addOrUpdateHandles">
          <!-- <el-table-column prop="orderNo" label="请购单号" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column> -->
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
          <el-table-column prop="totalReconciliationAmount" label="应付金额" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.cooperativePartnerId, 'outside_processing')">{{
                scope.row.totalReconciliationAmount ?  scope.row.totalReconciliationAmount : 0
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="totalPaymentAmount" label="已付金额" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.cooperativePartnerId, 'outside_processing')">{{
                scope.row.totalPaymentAmount ?  scope.row.totalPaymentAmount : 0
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="totalUnpaidAmount" label="未付金额" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.cooperativePartnerId, 'outside_processing')">{{
                scope.row.totalUnpaidAmount  ?  scope.row.totalUnpaidAmount : 0
              }}</el-link>
            </template>
          </el-table-column>
         
          <el-table-column prop="totalInvoicingAmount" label="已开票金额" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.cooperativePartnerId, 'outside_processing')">{{
                scope.row.totalInvoicingAmount ?  scope.row.totalInvoicingAmount : 0
              }}</el-link>
            </template>
        </el-table-column>
          <el-table-column prop="totalNotInvoicedAmount" label="未开票金额" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.cooperativePartnerId, 'outside_processing')">{{
                scope.row.totalNotInvoicedAmount ?  scope.row.totalNotInvoicedAmount : 0
              }}</el-link>
            </template>
        </el-table-column>



        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />



  </div>
</template>
  
<script>
import { getPurProcurementRequirementsList, deletepurProcurementRequire } from '@/api/purchasingManagement/purchaseInquirySheet'
import { getfinSelfReceivable } from '@/api/financialManagement/index'
import JNPFForm from './Form'
import moment from 'moment'
export default {
  name: 'receivableManagement',
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "total_unpaid_amount"
        }],
        approvalStatus: "",
        billingStatus: "",
        cooperativePartnerCode: "",
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
        reconciliationType: "outside_processing",
        startTime: ""
      },
      documentStatusList: [{
        label: "草稿",
        value: "draft"
      }, {
        label: "提交",
        value: "submit"
      },],
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      },],


      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },
    addOrUpdateHandles(e){
      console.log("e==>",e);
      this.formVisible = true
      if (e.cooperativePartnerId) {
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(e.cooperativePartnerId, 'outside_processing')
        })
      }
    },

    initData() {
      this.listLoading = true
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + " 00:00:00"
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + " 23:59:59"
      }
      getfinSelfReceivable(this.listQuery).then(res => {
        console.log(res, '未对账列表');
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "total_unpaid_amount"
        }],
        approvalStatus: "",
        billingStatus: "",
        cooperativePartnerCode: "",
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
        reconciliationType: "outside_processing",
        startTime: ""
      },
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
      console.log(id);
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
        deletepurProcurementRequire(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
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
</style>
  