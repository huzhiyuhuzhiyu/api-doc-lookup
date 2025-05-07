<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="查看应付金额明细" />
        </div>
        <div class="moneyBox">
          <div class="cooperativePartnerName">
            供应商名称：{{ dataForm.cooperativePartnerName }}
          </div>
          <div class="contMoney">
            <div class="contItem">
              <span>总金额</span>
              <div style="font-weight:bold; margin-top:10px;">￥ {{ dataForm.totalReconciliationAmount ?
                dataForm.totalReconciliationAmount : 0 }}</div>
            </div>
            <div class="contItem">
              <span>已付金额</span>
              <div style="font-weight:bold; margin-top:10px;">￥ {{ dataForm.totalPaymentAmount ?
                dataForm.totalPaymentAmount : 0 }}</div>
            </div>
            <div class="contItem">
              <span>欠款金额</span>
              <div style="font-weight:bold; margin-top:10px;">￥ {{ dataForm.totalUnpaidAmount ? dataForm.totalUnpaidAmount
                : 0 }}</div>
            </div>
            <div class="contItem">
              <span>已收票金额</span>
              <div style="font-weight:bold; margin-top:10px;">￥ {{ dataForm.totalInvoicingAmount ?
                dataForm.totalInvoicingAmount : 0 }}</div>
            </div>
            <div class="contItem">
              <span>未收票金额</span>
              <div style="font-weight:bold; margin-top:10px;">￥ {{ dataForm.totalNotInvoicedAmount ?
                dataForm.totalNotInvoicedAmount : 0 }}</div>
            </div>
          </div>
        </div>
        <div class="main">
          <div class="mainList">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="对账明细" name="dzInfo">
                <div class="JNPF-common-layout">
                  <div class="JNPF-common-layout-center JNPF-flex-main">
                    <el-row class="JNPF-common-search-box" :gutter="16">
                      <el-form @submit.native.prevent>

                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model.trim="listQuery.orderNo" placeholder="请输入对账流水号" clearable
                              @keyup.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-date-picker v-model="reconciliationDate" type="daterange" value-format="yyyy-MM-dd"
                              style="width: 100%;" clearable start-placeholder="请选择对账开始日期" end-placeholder="请选择对账结束日期">
                            </el-date-picker>
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
                      <JNPF-table show-summary :summary-method="getSummaries" v-loading="listLoading"
                        highlight-current-row :fixedNO="true" ref="tableForm" :data="reconList" @sort-change="sortChange" customKey="JNPFTableKey_350850">

                        <el-table-column prop="orderNo" label="对账流水号" min-width="180" sortable="custom" />
                        <el-table-column prop="reconciliationDate" label="对账日期" min-width="160" sortable="custom" />
                        <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                        <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                        <el-table-column prop="includingTaxAmount" label="订单金额" min-width="180" />

                        <el-table-column prop="totalReconciliationAmount" label="应付金额" min-width="120">
                          <!-- <template slot-scope="scope">
                            <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">{{
                              scope.row.totalReconciliationAmount
                            }}</el-link>
                          </template> -->
                        </el-table-column>
                        <el-table-column prop="totalPaymentAmount" label="已付款金额" min-width="120" />
                        <el-table-column prop="totalUnpaidAmount" label="未付款金额" min-width="120" />
                        <el-table-column prop="totalInvoicingAmount" label="已收票金额" min-width="120" />
                        <el-table-column prop="totalNotInvoicedAmount" label="未收票金额" min-width="120" />
                        <el-table-column prop="remark" label="备注" min-width="180" />
                        <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                        <el-table-column prop="createByName" label="创建人" min-width="120" />
                        <el-table-column label="操作" min-width="180" fixed="right">
                          <template slot-scope="scope">
                            <el-button size="mini" type="text"
                              :disabled="Math.abs(scope.row.totalReconciliationAmount) - Math.abs(scope.row.totalPaymentAmount) == 0 ? true : false"
                              @click="collectionHandle(scope.row.id, 'collection')">付款</el-button>
                            <el-button size="mini" type="text"
                              :disabled="Math.abs(scope.row.totalReconciliationAmount) - Math.abs(scope.row.totalInvoicingAmount) == 0 ? true : false"
                              @click="makeHandle(scope.row.id, 'make')">收票</el-button>
                            <el-dropdown hide-on-click>
                              <span class="el-dropdown-link">
                                <el-button type="text" size="mini">
                                  {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="detailHandle(scope.row.id, 'look')">
                                  查看详情
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </template>
                        </el-table-column>

                      </JNPF-table>
                      <pagination :total="recontotal" :page.sync="listQuery.pageNum" :background="background"
                        :limit.sync="listQuery.pageSize" @pagination="reconData" />
                    </div>
                  </div>
                  <collectionForm v-if="collectionVisibled" ref="collectionForm" @refresh="refresh" @close="closeForm" />

                </div>
              </el-tab-pane>



              <el-tab-pane label="付款明细" name="skInfo">
                <div class="JNPF-common-layout">
                  <div class="JNPF-common-layout-center JNPF-flex-main">
                    <el-row class="JNPF-common-search-box" :gutter="16">
                      <el-form @submit.native.prevent>

                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model.trim="collectionQuery.orderNo" placeholder="请输入对账流水号" clearable
                              @keyup.enter.native="collectionSearch()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-date-picker v-model="paymentDate" type="daterange" value-format="yyyy-MM-dd"
                              style="width: 100%;" clearable start-placeholder="请选择付款开始日期" end-placeholder="请选择付款结束日期">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>

                        <el-col :span="6">
                          <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="collectionSearch()">
                              {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="resetCollection()">{{
                              $t('common.reset') }}
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-row>
                    <div class="JNPF-common-layout-main JNPF-flex-main">
                      <JNPF-table show-summary :summary-method="getSummaries" v-loading="listLoading" highlight-current-row :fixedNO="true" ref="collectiontableForm"
                        :data="collectList" @sort-change="collectionSortChange" customKey="JNPFTableKey_172785">

                        <el-table-column prop="orderNo" label="对账流水号" min-width="180" sortable="custom" />
                        <el-table-column prop="reconciliationDate" label="对账日期" min-width="160" sortable="custom" />
                        <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                        <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                        <el-table-column prop="includingTaxAmount" label="订单金额" min-width="120" />
                        <el-table-column prop="totalReconciliationAmount" label="应付金额" min-width="120">
                        </el-table-column>
                        <el-table-column prop="paymentAmount" label="已付款金额" min-width="120" />
                        <el-table-column prop="paymentDate" label="付款日期" min-width="160" sortable="custom" />

                        <el-table-column prop="paymentMethod" label="付款方式" min-width="160">
                          <template slot-scope="scope">
                            <div v-if="scope.row.paymentMethod === 'transfer_accounts'">转账</div>
                            <div v-if="scope.row.paymentMethod === 'draft'">汇票</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" min-width="180" />
                        <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                        <el-table-column prop="createByName" label="创建人" min-width="120" />
                        <!-- <el-table-column label="操作" min-width="90" fixed="right">
                          <template slot-scope="scope">
                            <el-dropdown hide-on-click>
                              <span class="el-dropdown-link">
                                <el-button type="text" size="mini">
                                  {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="detailHandle(scope.row.accountsReceivableReconciliationId, 'look')">
                                  查看详情
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </template>
                        </el-table-column> -->

                      </JNPF-table>
                      <pagination :total="collecttotal" :page.sync="collectionQuery.pageNum" :background="background"
                        :limit.sync="collectionQuery.pageSize" @pagination="collectionData" />
                    </div>
                  </div>

                </div>
              </el-tab-pane>


              <el-tab-pane label="开票明细" name="kpInfo">
                <div class="JNPF-common-layout">
                  <div class="JNPF-common-layout-center JNPF-flex-main">
                    <el-row class="JNPF-common-search-box" :gutter="16">
                      <el-form @submit.native.prevent>

                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model.trim="makeQuery.orderNo" placeholder="请输入对账流水号" clearable
                              @keyup.enter.native="makeSearch()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-date-picker v-model="invoiceDate" type="daterange" value-format="yyyy-MM-dd"
                              style="width: 100%;" clearable start-placeholder="请选择开票开始日期" end-placeholder="请选择开票结束日期">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>

                        <el-col :span="6">
                          <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="makeSearch()">
                              {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="resetMake()">{{
                              $t('common.reset') }}
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-row>
                    <div class="JNPF-common-layout-main JNPF-flex-main">
                      <JNPF-table show-summary :summary-method="getSummaries" v-loading="listLoading" highlight-current-row :fixedNO="true" ref="makeoutForm"
                        :data="makeoutList" @sort-change="makeoutSortChange" customKey="JNPFTableKey_363878">

                        <el-table-column prop="orderNo" label="对账流水号" min-width="180" sortable="custom" />
                        <el-table-column prop="reconciliationDate" label="对账日期" min-width="160" sortable="custom" />
                        <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                        <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                        <el-table-column prop="includingTaxAmount" label="订单金额" min-width="120" />
                        <el-table-column prop="totalReconciliationAmount" label="应付金额" min-width="120">
                        </el-table-column>
                        <el-table-column prop="invoicingAmount" label="已开票金额" min-width="120" />
                        <el-table-column prop="invoiceDate" label="开票日期" min-width="160" sortable="custom" />

                        <el-table-column prop="invoiceCode" label="发票代码" min-width="120" />
                        <el-table-column prop="invoiceNumber" label="发票号码" min-width="120" />

                        <el-table-column prop="remark" label="备注" min-width="180" />
                        <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                        <el-table-column prop="createByName" label="创建人" min-width="120" />
                        <!-- <el-table-column label="操作" min-width="90" fixed="right">
                          <template slot-scope="scope">
                            <el-dropdown hide-on-click>
                              <span class="el-dropdown-link">
                                <el-button type="text" size="mini">
                                  {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="detailHandle(scope.row.accountsReceivableReconciliationId, 'look')">
                                  查看详情
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </template>
                        </el-table-column> -->

                      </JNPF-table>
                      <pagination :total="makeouttotal" :page.sync="makeQuery.pageNum" :background="background"
                        :limit.sync="makeQuery.pageSize" @pagination="makeData" />
                    </div>
                  </div>

                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <makeForm v-if="makeVisibled" ref="makeForm" @refresh="refresh" @close="closeForm" />
        <depForm v-if="depVisibled" ref="depForm" @refresh="refreshdep" @close="closeDepForm" />
      </div>
    </transition>

  </div>
</template>
<script>

import { detailfinSelfReceivable, addfinInvoiceRecords, addfinPaymentRecords, getfinPaymentRecords, getfinInvoiceRecords ,getfinPaymentReport , getfinInvoiceReport } from '@/api/financialManagement/index'
import { getfinAccountList, getfinAccountsReport } from '@/api/ReconciliaRePayments/index'

import collectionForm from './collectionForm.vue'
import makeForm from './makeForm2.vue'
import depForm from './depForm.vue'
export default {
  components: {
    collectionForm,
    makeForm,
    depForm
  },
  data() {
    return {
      activeName: 'dzInfo',
      dialogTitle: '',
      depVisibled: false,
      background: true,//分页器背景颜色
      collectionVisibled: false,
      makeVisibled: false,
      loading: false,
      listLoading: false,
      btnLoading: false,
      index: null,
      reconList: [],    // 对账
      collectList: [],   // 收款
      makeoutList: [],   // 开票
      recontotal: 0,
      collecttotal: 0,
      makeouttotal: 0,
      paymentDate: [],
      invoiceDate: [],
      orderNoId: '',
      dataForm: {
        cooperativePartnerName: '',      //供应商名称
        cooperativePartnerId: '',
        totalReconciliationAmount: '',     // 对账应收总金额
        totalPaymentAmount: '',            // 对账已收总金额
        totalInvoicingAmount: '',          // 、已开票金额
        totalNotInvoicedAmount: '',        // 未开票总金额
        totalUnpaidAmount: '',

      },
      //  对账列表参数
      listQuery: {
        totalReconciliationAmount: '',     // 对账应收总金额
        totalPaymentAmount: '',            // 对账已收总金额
        totalInvoicingAmount: '',          // 、已开票金额
        totalNotInvoicedAmount: '',        // 未开票总金额
        totalUnpaidAmount: '',
        orderNo: '',
        reconciliationDate: '',
        reconciliationStartDate: '',
        reconciliationEndDate: '',
        reconciliationType: "payable",
        approvalStatus: 'ok',
        billingStatus: 'not_finished',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        cooperativePartnerId: '',
        pageNum: 1,
        pageSize: 20,
        totalRowFlag: false,
      },
      // 收款列表参数
      collectionQuery: {
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
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        reconciliationDate: '',
        paymentEndDate: "",
        paymentStartDate: "",
        reconciliationType: "payable",
        startTime: ""
      },
      // 开票 列表参数
      makeQuery: {
        cooperativePartnerId: 0,
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
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        invoiceStartDate: '',
        invoiceEndDate: '',
        reconciliationType: "payable",
        startTime: ""
      },
      invoiceDate: [],
      reconciliationDate: [],
      pageNum: 1,
      pageSize: 20,
      type: "",
      createRequirementDate: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      totalList: [],
    }

  },
  created() {

  },

  methods: {
    goBack() {
      this.$emit('close', true)
    },
    init(data, type) {
      this.type = type
      this.orderNoId = data
      this.listLoading = true
      detailfinSelfReceivable(this.orderNoId,this.type).then(res=>{
        this.dataForm.cooperativePartnerName = res.data.cooperativePartnerName
        this.dataForm.cooperativePartnerId = res.data.cooperativePartnerId
        this.dataForm.totalReconciliationAmount = res.data.totalReconciliationAmount
        this.dataForm.totalPaymentAmount = res.data.totalPaymentAmount
        this.dataForm.totalInvoicingAmount = res.data.totalInvoicingAmount
        this.dataForm.totalNotInvoicedAmount = res.data.totalNotInvoicedAmount
        this.dataForm.totalUnpaidAmount = res.data.totalUnpaidAmount
        this.reconData()
      }) 
    },
    // 对账 列表排序
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.reconData()
    },
    // 收款列表排序
    collectionSortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.collectionQuery.orderItems[0].asc = order !== 'descending'
      this.collectionQuery.orderItems[0].column = order === null ? "" : newProp
      this.collectionData()
    },

    // 开票列表排序 
    makeoutSortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.makeQuery.orderItems[0].asc = order !== 'descending'
      this.makeQuery.orderItems[0].column = order === null ? "" : newProp
      this.makeData()
    },

    // 对账搜索 
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.reconData()
    },
    // 收款搜索
    collectionSearch() {
      Object.keys(this.collectionQuery).forEach(key => {
        let item = this.collectionQuery[key]
        this.collectionQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.collectionQuery.pageNum = 1
      this.collectionData()
    },

    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        totalReconciliationAmount: '',     // 对账应收总金额
        totalPaymentAmount: '',            // 对账已收总金额
        totalInvoicingAmount: '',          // 、已开票金额
        totalNotInvoicedAmount: '',        // 未开票总金额
        totalUnpaidAmount: '',
        orderNo: '',
        reconciliationDate: '',
        reconciliationStartDate: '',
        reconciliationEndDate: '',
        billingStatus: 'not_finished',
        reconciliationType: "payable",
        approvalStatus: 'ok',
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        pageNum: 1,
        pageSize: 20,
      },
        this.createRequirementDate = []
      this.reconciliationDate = []
      this.search()
    },
    // 关闭 收款新建、编辑页面
    closeForm(isRefresh) {
      this.collectionVisibled = false
      this.makeVisibled = false
      if (isRefresh) {
        this.init(this.orderNoId, this.type)
        this.reconData()
      }
    },
    refresh() {
      this.collectionVisibled = false
      this.reset()
    },

    closeDepForm(isRefresh) {
      this.depVisibled = false
      if (isRefresh) {
        this.reconData()
      }
    },
    refreshdep() {
      this.depVisibled = false
      this.reset()
    },


    //  对账列表
    reconData() {
      this.listLoading = true
      if (this.reconciliationDate && this.reconciliationDate.length > 0) {
        this.listQuery.reconciliationStartDate = this.reconciliationDate[0]
        this.listQuery.reconciliationEndDate = this.reconciliationDate[1]
      } else {
        this.listQuery.reconciliationStartDate = ''
        this.listQuery.reconciliationEndDate = ''
      }
      this.listQuery.cooperativePartnerId = this.dataForm.cooperativePartnerId
      this.totalList = []
      getfinAccountsReport(this.listQuery).then(res => {
        console.log(res, '对账列表');
        this.reconList = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.recontotal = res.data.page ? res.data.page.total : 0
        this.listLoading = false
      })
    },
    // 收款 or 开票
    collectionHandle(id, type) {
      this.collectionVisibled = true
      this.$nextTick(() => {
        this.$refs.collectionForm.init(id, type)
      })
    },
    makeHandle(id, type) {
      this.makeVisibled = true
      this.$nextTick(() => {
        this.$refs.makeForm.init(id, type)
      })
    },
    // 查看详情
    detailHandle(id, type) {
      this.depVisibled = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },

    // ttab切换
    handleClick(e) {
      console.log(e);
      if (e.index == '0') {
        // 对账

        this.reset()
      }
      if (e.index == '1') {
        // 收款
        this.resetCollection()
      }
      if (e.index == '2') {
        // 开票
        this.resetMake()
        // this.reset()
      }

    },

    //  收款列表 请求
    collectionData() {
      this.listLoading = true
      if (this.paymentDate && this.paymentDate.length > 0) {
        this.collectionQuery.paymentStartDate = this.paymentDate[0]
        this.collectionQuery.paymentEndDate = this.paymentDate[1]
      } else {
        this.collectionQuery.paymentStartDate = ''
        this.collectionQuery.paymentEndDate = ''
      }
      // this.collectionQuery.cooperativePartnerId = this.dataForm.cooperativePartnerId
      this.totalList = []
      getfinPaymentReport(this.collectionQuery).then(res => {
        console.log(res, '收款列表');
        this.collectList = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.collecttotal = res.data.page ? res.data.page.total : 0
        this.listLoading = false
      })
    },
    // 收款列表重置
    resetCollection() {
      this.$refs['collectiontableForm'].$refs.JNPFTable.clearSort()
      this.collectionQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        totalReconciliationAmount: '',     // 对账应收总金额
        totalPaymentAmount: '',            // 对账已收总金额
        totalInvoicingAmount: '',          // 、已开票金额
        totalNotInvoicedAmount: '',        // 未开票总金额
        totalUnpaidAmount: '',
        orderNo: '',
        paymentDate: '',
        paymentStartDate: '',
        paymentEndDate: '',
        reconciliationDate: '',
        // billingStatus: 'not_finished',
        reconciliationType: "payable",
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        pageNum: 1,
        pageSize: 20,

      },
        this.createRequirementDate = []
      this.paymentDate = []
      this.collectionSearch()
    },
    // 收款 查询 
    collectionSearch() {
      Object.keys(this.collectionQuery).forEach(key => {
        let item = this.collectionQuery[key]
        this.collectionQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.collectionQuery.pageNum = 1
      this.collectionData()
    },

    // 开票 查询
    makeSearch() {
      Object.keys(this.makeQuery).forEach(key => {
        let item = this.makeQuery[key]
        this.makeQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.makeQuery.pageNum = 1
      this.makeData()
    },
    // 开票 列表数据
    makeData() {
      this.listLoading = true
      if (this.invoiceDate && this.invoiceDate.length > 0) {
        this.makeQuery.invoiceStartDate = this.invoiceDate[0]
        this.makeQuery.invoiceEndDate = this.invoiceDate[1]
      } else {
        this.makeQuery.invoiceStartDate = ''
        this.makeQuery.invoiceEndDate = ''
      }
      this.totalList = []
      getfinInvoiceReport(this.makeQuery).then(res => {
        console.log(res, '开票列表');
        this.makeoutList = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.makeouttotal = res.data.page ? res.data.page.total : 0
        this.listLoading = false
      })
    },
    // 开票重置
    resetMake() {
      this.$refs['makeoutForm'].$refs.JNPFTable.clearSort()
      this.makeQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        totalReconciliationAmount: '',     // 对账应收总金额
        totalPaymentAmount: '',            // 对账已收总金额
        totalInvoicingAmount: '',          // 、已开票金额
        totalNotInvoicedAmount: '',        // 未开票总金额
        totalUnpaidAmount: '',
        orderNo: '',
        paymentDate: '',
        invoiceStartDate: '',
        invoiceEndDate: '',
        reconciliationDate: '',
        // billingStatus: 'not_finished',
        reconciliationType: "payable",
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        pageNum: 1,
        pageSize: 20,
      },
        this.createRequirementDate = []
      this.invoiceDate = []
      this.makeSearch()
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
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
  background-color: #f5f7fa;
}

.mainList {
  background-color: #fff;
  height: 100%;
}

.moneyBox {
  width: 100%;
  display: flex;
  flex-direction: column;

}

.cooperativePartnerName {

  font-size: 16px;
  line-height: 43px;
  box-sizing: border-box;
  padding-left: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  /* overflow:hidden;
  white-space:nowrap;
  text-overflow: ellipsis; */
}

.contMoney {
  width: 100%;
  padding-bottom: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.contItem {
  font-size: 16px;

  padding-left: 20px;
  /* font-weight: bold; */
}


.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 11px 10px;
}

::v-deep .el-tabs__content {
  height: 94.5%;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
  box-sizing: border-box;
  /* height: 5.5%; */
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

::v-deep .el-date-table .today span {
  font-weight: 700;
  color: #C0C4CC !important;
}

::v-deep .el-tabs {
  height: 100%;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

::v-deep .el-tab-pane {
  height: 100%
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

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>