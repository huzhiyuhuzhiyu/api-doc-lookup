<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `账单`" />
          <!-- <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div> -->
        </div>
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="账单信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账流水号" prop="orderNo" ref="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="客户名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input v-model="dataForm.cooperativePartnerName" placeholder="请输入客户名称"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>



                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账日期" prop="reconciliationDate" ref="reconciliationDate">
                          <!-- <el-input v-model="dataForm.reconciliationDate" placeholder="请选择报价有效期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->

                          <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择对账日期" :disabled="type == 'look' ? true : false">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="出入库金额" prop="includingTaxAmount" ref="includingTaxAmount">
                          <el-input v-model="dataForm.includingTaxAmount" placeholder="请输入出入库金额"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="'对账应' + showLabel + '金额'" prop="totalReconciliationAmount"
                          ref="totalReconciliationAmount">
                          <el-input v-model="dataForm.totalReconciliationAmount" placeholder=""
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="'已' + showLabel + '款金额'" prop="totalPaymentAmount"
                          ref="totalPaymentAmount">
                          <el-input v-model="dataForm.totalPaymentAmount"
                            :placeholder="dataForm.totalPaymentAmount ? dataForm.totalPaymentAmount : 0"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="'未' + showLabel + '款金额'" prop="totalUnpaidAmount" ref="totalUnpaidAmount">
                          <el-input v-model="dataForm.totalUnpaidAmount"
                            :placeholder="dataForm.totalUnpaidAmount ? dataForm.totalUnpaidAmount : 0"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="'已' + showLabel2 + '票金额'" prop="totalInvoicingAmount"
                          ref="totalInvoicingAmount">
                          <el-input v-model="dataForm.totalInvoicingAmount"
                            :placeholder="dataForm.totalInvoicingAmount ? dataForm.totalInvoicingAmount : 0"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="'未' + showLabel2 + '票金额'" prop="totalNotInvoicedAmount"
                          ref="totalNotInvoicedAmount">
                          <el-input v-model="dataForm.totalNotInvoicedAmount"
                            :placeholder="dataForm.totalNotInvoicedAmount ? dataForm.totalNotInvoicedAmount : 0"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24" v-if="type === 'look'">
                        <el-form-item label="创建时间" prop="createTime" ref="createTime">
                          <el-time-select style="width: 100%;" :disabled="type == 'look' ? true : false"
                            v-model="dataForm.createTime" placeholder="创建时间">
                          </el-time-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8" v-if="type === 'look'">
                        <el-form-item label="创建人" prop="createByName" ref="createByName">
                          <el-input type="text" v-model="dataForm.createByName" placeholder="请输入创建人" maxlength="20"
                            :disabled="type == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark" ref="remark">
                          <el-input :disabled="type == 'look' ? true : false" type="textarea" :rows="3" maxlength="200"
                            v-model="dataForm.remark" placeholder="请输入备注">
                          </el-input>
                        </el-form-item>
                      </el-col>

                    </el-form>
                  </el-row>

                </el-collapse-item>

                <el-collapse-item title="对账信息" name="productInfo">

                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" hasC hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                      <el-table-column prop="ordersNo" label="订单号" min-width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'ordersNo'">
                            <div class="viewData">
                              <span>{{ scope.row.ordersNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="confirmReceiptRecordsOrderNo" label="发退货通知单号" min-width="180"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'confirmReceiptRecordsOrderNo'">
                            <div class="viewData">
                              <span>{{ scope.row.confirmReceiptRecordsOrderNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>


                      <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                            <div class="viewData">
                              <span>{{ scope.row.productCode ? scope.row.productCode : "调价" }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>{{ scope.row.productName ? scope.row.productName : "调价" }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="drawingNo" label="型号" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">

                            <div class="viewData">
                              <span>{{ scope.row.drawingNo ? scope.row.drawingNo : "调价" }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>


                      <el-table-column prop="reconciliationUnitPrice" label="数量" min-width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">

                            <div class="viewData">
                              <span>{{ scope.row.reconciliationUnitPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位(主)" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">

                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" label="税率%" min-width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                            <div class="viewData">
                              <span>{{ scope.row.taxRate }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="includingTaxAmount" label="含税金额" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.includingTaxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->
                      <el-table-column prop="excludingTaxAmount" label="不含税金额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">

                            <div :class="['viewData', scope.row.excludingTaxAmount < 0 ? 'red' : 'green']">
                              <span>{{ scope.row.excludingTaxAmount < 0 ? scope.row.excludingTaxAmount : '+' +
                                scope.row.excludingTaxAmount }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxAmount" label="税额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">

                            <div :class="['viewData', scope.row.taxAmount < 0 ? 'red' : 'green']">
                              <span>{{ scope.row.taxAmount < 0 ? scope.row.taxAmount : '+' + scope.row.taxAmount
                                  }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="includingTaxAmount" label="含税金额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'">
                            <div :class="['viewData', scope.row.includingTaxAmount < 0 ? 'red' : 'green']">
                              <span>{{ scope.row.includingTaxAmount < 0 ? scope.row.includingTaxAmount : '+' +
                                scope.row.includingTaxAmount }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="180">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" :disabled="type === 'look'" maxlength="20"
                            placeholder="请输入备注">{{
                              scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>
                      <!-- 
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column> -->
                    </el-table>
                  </el-form>

                  <!-- <div style="height: 40px; line-height: 40px; background: #f5f7fa;">
                <span style="font-size:17px;font-weight:500;margin-right:10px">订单不含税总金额：{{
                  dataForm.excludingTaxAmount }}</span>
                <span style="font-size:17px;font-weight:500;margin-right:10px">订单税额：{{ dataForm.taxAmount }}</span>
                <span style="font-size:17px;font-weight:500;margin-right:10px">订单含税总金额：{{ dataForm.includingTaxAmount
                }}</span>

              </div> -->
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">不含税金额：
                      <span :class="dataForm.excludingTaxAmount > 0 ? 'green' : 'red'">{{ dataForm.excludingTaxAmount >
                        0 ?
                        '+' + dataForm.excludingTaxAmount : dataForm.excludingTaxAmount
                        }}</span></span>
                    <span style="font-weight:500;margin-right:10px">税额：
                      <span :class="dataForm.taxAmount > 0 ? 'green' : 'red'">{{ dataForm.taxAmount > 0 ?
                        '+' + dataForm.taxAmount : dataForm.taxAmount
                        }}</span></span>
                    <span style="font-weight:500;margin-right:10px">含税金额：
                      <span :class="dataForm.totalReconciliationAmount > 0 ? 'green' : 'red'">{{
                        dataForm.totalReconciliationAmount > 0 ?
                          '+' + dataForm.totalReconciliationAmount : dataForm.totalReconciliationAmount
                      }}</span></span>

                  </div>
                </el-collapse-item>
              </el-collapse>





            </el-tab-pane>
            <el-tab-pane :label="showLabel + '款信息'" name="payInfo">
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="collectiontableForm"
                :data="collectList" customKey="JNPFTableKey_772137">
                <el-table-column prop="totalReconciliationAmount" :label="'应' + showLabel + '金额'" min-width="120">
                </el-table-column>
                <el-table-column prop="paymentAmount" :label="'已' + showLabel + '款金额'" min-width="120" />
                <el-table-column prop="paymentDate" :label="showLabel + '款日期'" min-width="160" />

                <el-table-column prop="paymentMethod" :label="showLabel + '款方式'" min-width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.paymentMethod === 'transfer_accounts'">转账</div>
                    <div v-if="scope.row.paymentMethod === 'draft'">汇票</div>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="180" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
              </JNPF-table>
              <pagination :total="collecttotal" :page.sync="collectionQuery.pageNum"
                :limit.sync="collectionQuery.pageSize" @pagination="collectionData" />
            </el-tab-pane>
            <!-- <el-tab-pane :label="showLabel2 + '票信息'" name="collectionInfo">
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="makeoutForm"
                :data="makeoutList">
                <el-table-column prop="totalReconciliationAmount" :label="'应' + showLabel + '金额'" min-width="120">
                </el-table-column>
                <el-table-column prop="totalPaymentAmount" :label="'已' + showLabel + '金额'" min-width="120">
                </el-table-column>
                <el-table-column prop="invoicingAmount" :label="'已' + showLabel2 + '票金额'" min-width="120" />
                <el-table-column prop="invoiceDate" label="开票日期" min-width="160" />

                <el-table-column prop="invoiceCode" label="发票代码" min-width="120" />
                <el-table-column prop="invoiceNumber" label="发票号码" min-width="120" />

                <el-table-column prop="remark" label="备注" min-width="180" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
              </JNPF-table>
              <pagination :total="makeouttotal" :page.sync="makeQuery.pageNum" :limit.sync="makeQuery.pageSize"
                @pagination="makeData" />
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </transition>

  </div>
</template>
<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import { detailfinSelfReceivable, getfinInvoiceRecords, getfinPaymentRecords } from '@/api/financialManagement/index'
export default {
  components: {
  },
  props: {
    orderNo: {
      type: String,
      required: true
    },
    reconciliationType: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,
      listLoading: false,
      dataFormTwo: {
        data: []
      },
      dataForm: {
        id: "",
        orderNo: "",        // 单号
        cooperativePartnerName: '',
        reconciliationEndDate: '',
        excludingTaxAmount: '',
        includingTaxAmount: '',
        taxAmount: '',
        submitDate: '',
        createTime: '',
        createBy: '',
        remark: "",
        totalReconciliationAmount: '',
        totalPaymentAmount: '',
        totalInvoicingAmount: '',
        totalNotInvoicedAmount: '',
        totalUnpaidAmount: '',
        createByName: '',
      },
      type: "",
      rules: {
      },
      productRules: {
      },
      productArr: [],
      // 收款列表参数
      collectionQuery: {},
      initcollectionQuery: {
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
        orderNo: this.orderNo,
        pageNum: 1,
        pageSize: 20,
        reconciliationDate: '',
        paymentEndDate: "",
        paymentStartDate: "",
        reconciliationType: this.reconciliationType,
        startTime: ""
      },
      // 开票 列表参数
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
        orderNo: this.orderNo,
        pageNum: 1,
        pageSize: 20,
        invoiceStartDate: '',
        invoiceEndDate: '',
        reconciliationType: this.reconciliationType,
        startTime: ""
      },
      makeQuery: {},
      collectList: [],   // 收款
      makeoutList: [],   // 开票
      collecttotal: 0,
      makeouttotal: 0,
    }
  },
  computed: {
    // 收 付 款label
    showLabel() {
      let label = this.reconciliationType !== 'receivable' ? '付' : '收'
      return label
    },
    //  收 开 票
    showLabel2() {
      let label = this.reconciliationType !== 'receivable' ? '收' : '开'
      return label
    },
  },
  watch: {
    activeName() {
      this.activeName === 'payInfo' ? this.collectionData() : this.activeName === 'collectionInfo' ? this.makeData() : ''
    }
  },
  created() {
    this.collectionQuery = JSON.parse(JSON.stringify(this.initcollectionQuery))
    this.makeQuery = JSON.parse(JSON.stringify(this.initmakeQuery))
    this.collectionData()
    this.makeData()
  },
  methods: {
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
      getfinPaymentRecords(this.collectionQuery).then(res => {
        this.collectList = res.data.records
        this.collecttotal = res.data.total
        this.listLoading = false
      })
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
      getfinInvoiceRecords(this.makeQuery).then(res => {
        console.log(res, '开票列表');
        this.makeoutList = res.data.records
        this.makeouttotal = res.data.total
        this.listLoading = false
      })
    },
    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, cooperativePartnerId) {
      console.log(id, type);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''

      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getfinAccountDetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            // return
            this.dataForm = {
              id: res.data.id,
              orderNo: res.data.orderNo,
              cooperativePartnerName: res.data.cooperativePartnerName,
              excludingTaxAmount: res.data.excludingTaxAmount,
              includingTaxAmount: res.data.includingTaxAmount,
              taxAmount: res.data.taxAmount,
              reconciliationDate: res.data.reconciliationDate,
              totalReconciliationAmount: res.data.totalReconciliationAmount,
              totalPaymentAmount: res.data.totalPaymentAmount,
              totalInvoicingAmount: res.data.totalInvoicingAmount,
              totalNotInvoicedAmount: res.data.totalNotInvoicedAmount,
              createTime: res.data.createTime,
              createByName: res.data.createByName,
              totalUnpaidAmount: res.data.totalUnpaidAmount
            }
            this.dataFormTwo.data = res.data.reconciliationLines
          })
        }
      })
    },
    // 表单提交
    // dataFormSubmit() {
    //   this.request()
    // },

    // async request() {
    //   let _data
    //   this.btnLoading = true
    //   if (this.type == 'add') {
    //     _data = {
    //       buyInquirySheet: this.dataForm,
    //       buyInquirySheetLineList: this.dataFormTwo.data
    //     }
    //   }
    //   if (this.type === 'edit' || this.type === 'look') {
    //     this.dataFormTwo.data.forEach((item, index) => {
    //       this.dataFormTwo.data[index].inquirySheetId = this.dataForm.id
    //     })
    //     _data = {
    //       buyInquirySheet: this.dataForm,
    //       buyInquirySheetLineList: this.dataFormTwo.data
    //     }
    //   }
    //   console.log(_data, '参数')

    //   let form_2 = this.$refs['productForm']
    //   let valid_2 = await form_2.validate().catch(err => false)
    //   // if (!valid_2) {
    //   //   console.log(1);
    //   //   this.btnLoading = false
    //   //   return
    //   // } else {
    //   //   this.btnLoading = true
    //   // }
    //   this.$refs['elForm'].validate((valid) => {
    //     if (valid ) {
    //       if (this.dataFormTwo.data.length === 0) {
    //         this.$message.error('请至少选择一项产品')
    //         this.btnLoading = false
    //       } else {
    //         if (!valid_2) {
    //           this.btnLoading = false
    //             for (let i = 0; i < this.dataFormTwo.data.length; i++) {
    //               const item = this.dataFormTwo.data[i]
    //               if (!item.materialPrice) {
    //                 this.$message({
    //                   type: 'error',
    //                   message: '请输入第' + (i + 1) + '行的产品价格',
    //                   duration: 1500,
    //                 })
    //                 break
    //               } 
    //               if (!item.taxRate) {
    //                 this.$message({
    //                   type: 'error',
    //                   message: '请输入第' + (i + 1) + '行的税率',
    //                   duration: 1500,
    //                 })
    //                 break
    //               }           

    //             }
    //             return
    //         } else{
    //           this.btnLoading = true
    //           if (!this.dataForm.id) {
    //             addbuyInquirySheet(_data).then(res => {
    //               if (res.msg === 'Success') res.msg = '提交成功'
    //               this.$message({
    //                 message: res.msg,
    //                 type: 'success',
    //                 duration: 1000,
    //                 onClose: () => {

    //                   this.btnLoading = false
    //                   this.$emit('close', true)
    //                 }
    //               })

    //             }).catch(() => {
    //               this.btnLoading = false
    //             })
    //           } else {
    //             editbuyInquirySheet(_data).then((res) => {
    //               if (res.msg === 'Success') res.msg = '提交成功'
    //               this.$message({
    //                 message: res.msg,
    //                 type: 'success',
    //                 duration: 1000,
    //                 onClose: () => {

    //                   this.btnLoading = false
    //                   this.$emit('close', true)

    //                 }
    //               })
    //             }).catch(() => {
    //               this.btnLoading = false
    //             })
    //           }
    //         }
    //       }
    //     } else {
    //       this.btnLoading = false
    //     }

    //   })
    // },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        // this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
        //   return !data.some(element => element.productsId === item.productsId);
        // });
        const deletedArray = [];
        data = data.filter(item1 => {
          const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId);
          if (index !== -1) {
            deletedArray.push(item1.productsName);
            if (deletedArray.length) {
              this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
            }
            return false;
          }
          return true;
        });
        console.log(data, '删除后的数据');
        console.log(deletedArray, '被删掉的数据');
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data,]
      console.log(this.dataFormTwo.data, '传递数据');
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
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  /* padding-left: 10px !important; */
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.red {
  color: red
}

.green {
  color: #67C23A;
}

::v-deep #pane-payInfo {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep #pane-collectionInfo {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs__content {
  /* height: calc(100% - 40px) !important; */
}

.el-tabs {
  height: 100%;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}
::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}
</style>