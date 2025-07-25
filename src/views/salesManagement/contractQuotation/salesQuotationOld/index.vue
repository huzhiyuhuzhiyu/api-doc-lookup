<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!depFormVisible && !quoteFormVisible">
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
            <!-- <el-dropdown> -->
            <topOpts @add="addSupplier('', 'add')" :addText="'报价'">
              <el-button type="primary" size="mini" icon="el-icon-plus"
                @click="addSupplier('', 'add', 'directly_quotation')">直接报价</el-button>
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('tableForm')">导出</el-button>
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
          <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" :fixedNO="true"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column customKey="JNPFTableKey_388657">
            <el-table-column prop="quotationNo" label="报价单号" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row, 'look')">{{
                  scope.row.quotationNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="客户编号" sortable="custom" min-width="120" />
            <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom" min-width="160" />
            <el-table-column prop="inquiryTime" label="询价日期" align="center" width="130" />
            <el-table-column prop="bidder1" label="制单人" width="100" />
            <el-table-column prop="bidder" label="业务员" width="120">
            </el-table-column>
            <el-table-column prop="purchaseUserId" label="采购负责人" width="120">
            </el-table-column>
            <el-table-column prop="quotationStatus" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.quotationStatus == 'feedback_received'">
                  <el-tag>已反馈</el-tag>
                </div>
                <div v-else-if="scope.row.quotationStatus == 'finished'">
                  <el-tag type="success">完成</el-tag>
                </div>
                <div v-else-if="scope.row.quotationStatus == 'not_submit'">
                  <el-tag type="danger">未提交</el-tag>
                </div>
                <div v-else-if="scope.row.quotationStatus == 'pending_feedback'">
                  <el-tag type="warning">待反馈</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="quotationTime" label="报价日期" width="130" align="center" sortable="custom" />
            <el-table-column label="操作" width="190" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                  @click="handleDel(scope.row.id)" class="JNPF-table-delBtn">删除</el-button>
                <el-button type="text" size="mini" @click="quoteHandle(scope.row, 'quote')">报价</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag"
                      @click.native="addSupplier(scope.row.id, 'add')">
                      重新提交
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleUserRelation(scope.row, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copyFun(scope.row.id, 'copy')">
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="downloadOrder(scope.row.id)">
                      下载报价单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>
    <DepForm v-if="depFormVisible" :quoteType="quoteType" ref="depForm" @close="closeForm" />
    <QuoteForm v-if="quoteFormVisible" ref="quoteForm" @close="closeForm"></QuoteForm>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getQuotationLists, deleteQuotationData, getQuotationmxLists, exportSaleQuotation } from '@/api/salesManagement/index'
import DepForm from './depForm'
import QuoteForm from './quoteForm'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'salesQuotationOld',
  components: { DepForm, SuperQuery, ExportForm, QuoteForm },
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'quotationNo', fieldValue: '', label: '报价单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["deliver", "address", "fax", "reasonRejection", "createByName", "remark"],
      superQueryVisible: false,

      deliveryDatefahuo: [],
      createTimeArrfahuo: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      exportFormVisible: false,
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
        { label: "审批撤回", value: "withdrawn" },
      ],
      documentStatusList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      depFormVisible: false,
      quoteFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [],
      form: {},
      formlist: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        quotationNo: "",
        cooperativePartnerIdText: "",
        deliver: "",
        bidder: "",

        approvalStatus: '',
        documentStatus: "",
        submitStartDate: '',
        submitEndDate: '',
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      superQueryJson: [
        {
          prop: 'quotationNo',
          label: "报价单号",
          type: 'input'
        },
        {
          prop: 'deliver',
          label: "致",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerIdText',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'bidder',
          label: "报价人",
          type: 'input'
        },
        {
          prop: 'quotationTime',
          label: "报价时间",
          type: 'input'
        },
        {
          prop: 'validEnd',
          label: "有效时间止",
          type: 'input'
        },
        {
          prop: 'address',
          label: "地址",
          type: 'input'
        },
        {
          prop: 'phone',
          label: "电话",
          type: 'input'
        },
        {
          prop: 'fax',
          label: "传真",
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'input'
        },
        {
          prop: 'approvalStatus',
          label: "审批状态",
          type: 'input'
        },
        {
          prop: 'reasonRejection',
          label: "驳回理由",
          type: 'input'
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
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
      ],
      submitDate: [],
      listLoading: false,
      total: 0,
      formVisible: false,
      bidderS: "",
      cooperativePartnerIdTextS: "",
      quotationNoS: "",
      showAppCodeFlag: true,
      quoteType: ''
    }
  },
  async created() {
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.superForm = this.form
    const res = await this.jnpf.getBusInfo('b001')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    if (this.$store.getters.configData.sale.salePersonFlag) {
      this.form.salesPersonFlag = 1
    }
    this.search('basic')
  },

  methods: {

    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },

    sortChange({ prop, order }) {
      let newProp
      if (prop == 'cooperativePartnerIdText' || prop == 'cooperativePartnerCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order !== 'descending'
      this.form.orderItems[0].column = newProp
      this.search('basic')
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      this.quoteFormVisible = false
      this.search('basic')
    },
    initData() {
      this.listLoading = true
      if (localStorage.getItem('loginTenant')) {
        this.superForm.tenant = localStorage.getItem('loginTenant')
      }

      getQuotationLists(this.superForm).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })

    },
    search(type) {


      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1 // 重置页码
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
      console.log(this.$refs);
      this.$refs.tableForm.$refs.JNPFTable.clearSort()
      this.superForm = this.form = JSON.parse(JSON.stringify(this.formlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'quotationNo', fieldValue: '', label: '报价单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.search('basic')
    },
    addSupplier(id, type, quoteType) {
      this.depFormVisible = true
      // quoteType 区分是报价还是直接报价
      this.quoteType = quoteType
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    copyFun(id, type) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }
    },
    // 编辑
    addOrUpdateHandle(res, type) {
      this.depFormVisible = true
      let id = res.id
      if (id) {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
      }
    },
    quoteHandle(row) {
      this.quoteFormVisible = true
      this.$nextTick(() => {
        this.$refs.quoteForm.init(row.id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQuotationData(id).then(res => {
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(row, type) {
      this.depFormVisible = true
      const { id, quotationType = '' } = row
      this.quoteType = quotationType
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    downloadOrder(id) {
      exportSaleQuotation(id).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
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
      const targetListQuery = this.formlist
      let _data = {
        ...targetListQuery,
        exportType: '1054',
        exportName: '销售报价单',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
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
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
}

.JNPF-common-head {
  padding: 8px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />