<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="生成采购对账单" />
          <div class="options">
            <!-- <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main" v-loading="listLoading">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="6">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input disabled v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="对账日期" prop="reconciliationDate">
                          <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择对账日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="订单金额" prop="includingTaxAmount">
                          <el-input disabled v-model="includingTaxAmount" placeholder="订单金额">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="对账金额" prop="totalReconciliationAmount">
                          <el-input disabled v-model="dataForm.includingTaxAmount" placeholder="请输入对账金额">
                          </el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark" ref="remark">
                          <el-input type="textarea" :rows="3" maxlength="200" v-model="dataForm.remark"
                            placeholder="请输入备注">
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>

                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">

                  <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" @click="addAdjustmentBtn()">增加调价行</el-button>
                    <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-delete" @click="batchDelete">批量删除</el-button>| -->
                  </div>

                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="productCode" label="产品编码" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                            <div class="viewData">
                              <span>{{ scope.row.productCode ? scope.row.productCode : "调价" }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="产品名称" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>{{ scope.row.productName ? scope.row.productName : "调价" }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>



                      <el-table-column prop="productDrawingNo" label="产品图号" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.productDrawingNo ? scope.row.productDrawingNo : "调价" }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="receiptReturnType" label="收/退货类型" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptReturnType'">
                            <div class="viewData">
                              <span>{{ scope.row.receiptReturnType === 'receipt' ? '收货' : scope.row.receiptReturnType
                                ===
                                'back' ?
                                '退货' : '' }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="reconciliationUnitPrice" label="数量" min-width="200">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">

                            <div class="viewData">
                              <span>{{ scope.row.reconciliationUnitPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位(主)" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <!-- <el-input v-model="scope.row.mainUnit" readonly maxlength="20" placeholder="请输入主单位">{{
                              scope.row.mainUnit }}
                            </el-input> -->
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>


                      <el-table-column prop="deputyUnit" label="单位(副)" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
                            <!-- <el-input v-model="scope.row.deputyUnit" readonly maxlength="20" placeholder="请输入副单位">{{
                              scope.row.deputyUnit }}
                            </el-input> -->
                            <div class="viewData">
                              <span>{{ scope.row.deputyUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" label="单价" min-width="180">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">

                            <div class="viewData">
                              <span>{{ scope.row.price }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" label="税率%" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">

                            <div class="viewData">
                              <span>{{ scope.row.taxRate }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>





                      <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="excludingTaxAmount" label="不含税总金额" min-width="120" fixed="right">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'"
                            :rules="productFormRules.excludingTaxAmount">
                            <!-- <el-input v-model="scope.row.excludingTaxAmount" maxlength="20" placeholder="请输入不含税总金额">
                        </el-input> -->
                            <div
                              :class="['viewData', scope.row.receiptReturnType === 'receipt' ? 'green' : scope.row.receiptReturnType === 'back' ? 'red' : '']">
                              <span v-if="scope.row.receiptReturnType === 'receipt'">+{{ scope.row.excludingTaxAmount
                                }}</span>
                              <span v-else-if="scope.row.receiptReturnType === 'back'">{{ scope.row.excludingTaxAmount
                                }}</span>

                            </div>
                            <el-input v-if="!scope.row.receiptReturnType" disabled
                              v-model="scope.row.excludingTaxAmount">{{
                                scope.row.excludingTaxAmount
                              }}</el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>


                      <el-table-column prop="taxAmount" label="税额" min-width="120" fixed="right">

                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'"
                            :rules="productFormRules.taxAmount">
                            <div
                              :class="['viewData', scope.row.receiptReturnType === 'receipt' ? 'green' : scope.row.receiptReturnType === 'back' ? 'red' : '']">
                              <span v-if="scope.row.receiptReturnType === 'receipt'">+{{ scope.row.taxAmount }}</span>
                              <span v-else-if="scope.row.receiptReturnType === 'back'">{{ scope.row.taxAmount }}</span>

                            </div>
                            <el-input v-if="!scope.row.receiptReturnType" v-model="scope.row.taxAmount" disabled>{{
                              scope.row.taxAmount
                            }}</el-input>

                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="includingTaxAmount" label="含税总金额" min-width="120" fixed="right">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'"
                            :rules="productFormRules.includingTaxAmount">
                            <div
                              :class="['viewData', scope.row.receiptReturnType === 'receipt' ? 'green' : scope.row.receiptReturnType === 'back' ? 'red' : '']">
                              <span v-if="scope.row.receiptReturnType === 'receipt'">+{{ scope.row.includingTaxAmount
                                }}</span>
                              <span v-else-if="scope.row.receiptReturnType === 'back'">{{ scope.row.includingTaxAmount
                                }}</span>

                            </div>
                            <el-input v-if="!scope.row.receiptReturnType" v-model="scope.row.includingTaxAmount">{{
                              scope.row.includingTaxAmount }}</el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip fixed="right">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" maxlength="20" placeholder="请输入备注">{{
                            scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" width="120" fixed="right" v-if="dataFormTwo.data.length > 1">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)"
                            :disabled="newArr.length <= 1 && (scope.row.productCode ? true : false)">删除</el-button>

                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                  <div class="text" style="height: 40px; line-height: 40px; background: #f5f7fa;">
                    <span style="font-weight:500;margin-right:10px">退货合计金额：<span class="red">{{
                      backComputedValue }}</span></span>
                    <span style="font-weight:500;margin-right:10px">收货合计金额：<span
                        :class="receiptComputedValue > 0 ? 'green' : 'red'">+{{
                          receiptComputedValue }}</span></span>
                    <span style="font-weight:500;margin-right:10px">不含税金额：<span
                        :class="computedValue > 0 ? 'green' : 'red'">{{
                          computedValue > 0 ? '+' + computedValue :
                            computedValue
                        }}</span></span>
                    <span style="font-weight:500;margin-right:10px">税额：<span
                        :class="computedValue2 > 0 ? 'green' : 'red'">{{
                          computedValue2 > 0 ? '+' + computedValue2 :
                            computedValue2 }}</span></span>
                    <!-- <span style="font-weight:500;margin-right:10px">价税合计：{{ computedValue3 }}</span> -->
                    <span style="font-weight:500;margin-right:10px">合计金额：<span
                        :class="brComputedValue > 0 ? 'green' : 'red'">{{
                          brComputedValue > 0 ? '+' + brComputedValue :
                            brComputedValue }}</span></span>
                  </div>
                </el-collapse-item>
              </el-collapse>



            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look'" label="流转记录" name="transferList">
              <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>

import { addfinAccount } from '@/api/ReconciliaRePayments/index'
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import Process from '@/components/Process/Preview'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getBusinessFlowInfo  } from '@/api/workFlow/FlowEngine'
export default {
  components: {
    Process, recordList
  },
  data() {
    return {
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      dialogTitle: '',
      loading: false,
      listLoading: true,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      dataForm: {
        cooperativePartnerId: '',
        cooperativePartnerName: '',      //供应商名称
        reconciliationDate: '',                //交货日期.
        reconciliationType: 'payable',
        reasonRejection: '',
        id: null,
        documentStatus: 'submit',
        orderNo: "",
        remark: '',
        submitDate: '',
        excludingTaxAmount: '',              //订单 不含税总金额
        includingTaxAmount: '',                    //   含税总金额
        totalReconciliationAmount: '',       // 对账总金额
        taxAmount: '',                     // 税额
        backAmount: '',                      // 退货总金额
        receiptAmount: '',                   // 收货总金额
        brTotalAmount: '',                   // 收/退货总金额
      },

      type: "",
      dataFormArr: [],
      rules: {
        reconciliationDate: [{ required: true, message: '请选择对账日期', trigger: ['change'] }],
        totalReconciliationAmount: [
          { required: true, message: '请输入对账金额', trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal2', params: [10, 2, "",] }), trigger: 'blur' },
        ],
      },
      productFormRules: {
        excludingTaxAmount: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["请输入不含税总金额", (errMsg) => { this.$message.error('' + errMsg) }] }), trigger: 'blur' },
          { required: true, message: '请输入不含税总金额', trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal2', params: [20, 6, "", (errMsg) => { this.$message.error('' + errMsg) }] }), trigger: 'blur' },
        ],

        includingTaxAmount: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["请输入含税总金额", (errMsg) => { this.$message.error('' + errMsg) }] }), trigger: 'blur' },
          { required: true, message: '请输入含税总金额', trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal2', params: [20, 6, "", (errMsg, index) => { this.$message.error('' + errMsg) }] }), trigger: 'blur' },
        ],
      },
      productRules: {

      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      newArr: [],
      includingTaxAmount: 0,
      formLoading: false,
      flowTemplateJson: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      flowData:{},
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      let num = 0
      let num2 = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxAmount = this.jnpf.numberFormat(count)
      return this.dataForm.excludingTaxAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      let num = 0
      let num2 = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.taxAmount * 1
      })

      this.dataForm.taxAmount = this.jnpf.numberFormat(count)
      return this.dataForm.taxAmount
    },

    // computedValue3() {
    //   // 在这里计算第三个输入框的值
    //   let count = 0
    //   this.dataFormTwo.data.forEach(item=>{
    //     count += item.totalAmount*1
    //   })
    //   this.dataForm.totalAmount = count

    //   return this.dataForm.totalAmount
    // },
    backComputedValue() {
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        if (item.receiptReturnType == 'back') {
          count += item.includingTaxAmount * 1
        }
      })
      this.dataForm.backAmount = this.jnpf.numberFormat(count)
      return this.dataForm.backAmount
    },
    // computedValue不含税金额：
    //       computedValue2 合计金额：
    //       brComputedValue 合计金额：
    receiptComputedValue() {
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        if (item.receiptReturnType === 'receipt') {
          count += item.includingTaxAmount * 1
        }
      })
      this.dataForm.receiptAmount = this.jnpf.numberFormat(count)
      console.log(this.dataForm.receiptAmount, 'this.dataForm.receiptAmount');
      return this.dataForm.receiptAmount
    },
    brComputedValue() {
      let count = 0
      if (this.dataForm.excludingTaxAmount !== '' && this.dataForm.taxAmount !== '') {
        count = this.dataForm.excludingTaxAmount * 1 + this.dataForm.taxAmount * 1
      }
      this.dataForm.includingTaxAmount = this.jnpf.numberFormat(count)
      return this.dataForm.includingTaxAmount
    },


  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        console.log(111, newVal);
        newVal.forEach(item => {
          if (item.receiptReturnType === 'receipt') {
            if (item.includingTaxAmount) {
              if (!newVal[0].taxRate || newVal[0].taxRate == 0) {
                item.excludingTaxAmount = item.excludingTaxAmount

              } else {
                item.excludingTaxAmount = this.jnpf.numberFormat(item.includingTaxAmount / (1 + (newVal[0].taxRate / 100)), 2)
                item.taxAmount = this.jnpf.numberFormat(item.includingTaxAmount - item.excludingTaxAmount, 2)
              }
            }
          } else if (item.receiptReturnType === 'back') {
            if (item.includingTaxAmount) {
              if (!newVal[0].taxRate || newVal[0].taxRate == 0) {
                item.excludingTaxAmount = item.excludingTaxAmount

              } else {
                item.excludingTaxAmount = this.jnpf.numberFormat(item.includingTaxAmount / (1 + (newVal[0].taxRate / 100)), 2)
                item.taxAmount = this.jnpf.numberFormat(item.includingTaxAmount - item.excludingTaxAmount, 2)
              }
            }
          } else {
            if (item.includingTaxAmount) {
              item.excludingTaxAmount = this.jnpf.numberFormat(item.includingTaxAmount / (1 + (newVal[0].taxRate / 100)), 2)
              item.taxAmount = this.jnpf.numberFormat(item.includingTaxAmount - item.excludingTaxAmount, 2)
            }
          }

        })
      },
      deep: true,
    },

    'dataForm.includingTaxAmount': {
      handler: function (newVal, oldVal) {
        console.log(newVal, '// immediate:true,');
        this.dataForm.totalReconciliationAmount = this.jnpf.numberFormat(newVal, 4)
      },
      immediate: true,
    },
  },
  methods: {
    addAdjustmentBtn() {
      this.dataFormTwo.data.push({
        accountsReceivableId: "",
        calculationDirection: "",
        confirmReceiptRecordsId: "",
        confirmReceiptRecordsLineId: "",
        deputyUnit: "",
        id: null,
        includingTaxAmount: '',
        receiptReturnType: "",
        mainUnit: "",
        ordersLineId: "",
        ordersId: "",
        productsId: "",
        productName: "",
        productCode: "",
        productDrawingNo: "",
        ratio: "",
        reconciliationUnitPrice: "",
        remark: "",
        excludingTaxPrice: "",
        excludingTaxAmount: "",
        taxAmount: "",
        taxRate: "",
        price: "",
        adjustmentLineFlag: true,
      })
      this.newArr = this.dataFormTwo.data.filter(item => item.adjustmentLineFlag === false);
      console.log(" this.dataFormTwo.data", this.dataFormTwo.data);
    },
    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(row, data, type) {
      this.dataFormTwo.data = []
      // 避免传递过来的数据 输入框设置默认值后无法修改 因为内存地址的问题 指向了同一个
      let _data = JSON.parse(JSON.stringify(data))
      this.dataForm = JSON.parse(JSON.stringify(row))
      console.log(_data, '数据数据');
      let excludingTaxAmount, includingTaxAmount;
      _data.forEach(item => {

        if (item.receiptReturnType) {
          excludingTaxAmount = item.receiptReturnType === 'receipt' ? item.receiptQuantity * this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1 / 100)), 2) : -item.receiptQuantity * this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1 / 100)), 2)
          includingTaxAmount = item.receiptReturnType === 'receipt' ? this.jnpf.numberFormat(item.receiptQuantity * item.price, 2) : -this.jnpf.numberFormat(item.receiptQuantity * item.price, 2)
        } else {
          excludingTaxAmount = item.excludingTaxAmount
          includingTaxAmount = item.includingTaxAmount
        }
        console.log("includingTaxAmount", includingTaxAmount);
        console.log("excludingTaxAmount", excludingTaxAmount);
        this.dataFormTwo.data.push({
          accountsReceivableId: '',
          calculationDirection: item.calculationDirection,
          confirmReceiptRecordsId: item.purchaseReceiptReturnGoodsId,
          confirmReceiptRecordsLineId: item.id,

          deputyUnit: item.deputyUnit,
          id: null,
          includingTaxAmount: includingTaxAmount,
          receiptReturnType: item.receiptReturnType,
          mainUnit: item.mainUnit,
          ordersLineId: item.ordersLineId,
          ordersId: item.orderId,
          productsId: item.productsId,
          productName: item.productName,
          productCode: item.productCode,
          productDrawingNo: item.productDrawingNo,
          ratio: item.ratio,
          reconciliationUnitPrice: item.receiptQuantity,
          remark: item.remark,
          excludingTaxPrice: this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1 / 100)), 2),
          excludingTaxAmount: excludingTaxAmount,
          taxAmount: item.receiptReturnType === 'receipt' ? this.jnpf.numberFormat(includingTaxAmount - excludingTaxAmount) : this.jnpf.numberFormat(includingTaxAmount - excludingTaxAmount),
          taxRate: item.taxRate,
          price: item.price,
          adjustmentLineFlag: false,
          // totalAmount: this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.receiptQuantity * item.excludingTaxAmount),
        })


      })

      this.listLoading = false

      this.dataFormTwo.data.forEach((item, index) => {
        if (item.receiptReturnType === 'receipt') {
          this.includingTaxAmount += this.jnpf.numberFormat(item.excludingTaxAmount + item.taxAmount)
        } else {
          this.includingTaxAmount += -this.jnpf.numberFormat(item.reconciliationUnitPrice * item.price)
        }

      })
      console.log("object", this.includingTaxAmount);
      console.log("object", this.dataFormTwo.data);

      this.dataForm.cooperativePartnerName = data[0].cooperativePartnerName
      this.dataForm.cooperativePartnerId = data[0].cooperativePartnerId
      // 获取当前日期
      const currentDate = new Date();

      // 获取年份
      const year = currentDate.getFullYear();

      // 获取月份（注意月份从0开始，所以要加1）
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');

      // 获取日期
      const date = String(currentDate.getDate()).padStart(2, '0');

      // 拼接为YYYY-MM-DD格式
      const formattedDate = `${year}-${month}-${date}`;
      this.dataForm.reconciliationDate = formattedDate
      // 审批
      this.$nextTick(() => { this.getBusInfo() })
    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      this.btnLoading = true
      let submitFlag = true
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      console.log(this.dataForm, '参数');
      console.log(valid_2, '11111111111111111');
      // return
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (!valid_2) {
            console.log(1, this.dataFormTwo.data);
            this.btnLoading = false
            if (this.dataFormTwo.data.length > 0) {
              console.log(66767);
              for (let index = 0; index < this.dataFormTwo.data.length; index++) {
                const item = this.dataFormTwo.data[index];
                console.log("item,", item);
                if (!item.adjustmentLineFlag) {
                  console.log("32123123", item);
                  if (item.excludingTaxAmount == "") {
                    console.log(22222);
                    this.$message.error("请填写" + (index + 1) + "含税总金额、不含税总金额")
                    this.btnLoading = false
                    flag = false
                    break
                  }
                }
              }
            }
          } else {
            this.btnLoading = true
            let totalExcludingTaxAmount = 0;
            let totalTaxAmount = 0;
            let totalIncludingTaxAmount = 0;

            this.dataFormTwo.data.forEach(item => {
              if (item.productsId === "") {
                totalExcludingTaxAmount += parseInt(item.excludingTaxAmount);
                totalTaxAmount += parseInt(item.taxAmount);
                totalIncludingTaxAmount += parseInt(item.includingTaxAmount);
              }
            });
            this.dataForm.adjustExcludingTaxAmount = totalExcludingTaxAmount
            this.dataForm.adjustIncludingTaxAmount = totalIncludingTaxAmount
            this.dataForm.adjustTaxAmount = totalTaxAmount
            let _data = {
              reconciliation: JSON.parse(JSON.stringify(this.dataForm)),
              reconciliationLine: JSON.parse(JSON.stringify(this.dataFormTwo.data)),
              flowData:this.flowData
            }
            _data.reconciliation.includingTaxAmount = this.includingTaxAmount
            let flag = null;
            // if (this.dataFormTwo.data.length > 0) {
            //   for (let index = 0; index < this.dataFormTwo.data.length; index++) {
            //     const item = this.dataFormTwo.data[index];
            //     if (item.adjustmentLineFlag == false) {
            //       if (!item.excludingTaxAmount || !item.includingTaxAmount) {
            //         this.$message.error("请填写含税总金额、不含税总金额")
            //         this.btnLoading = false
            //         flag = false
            //         break
            //       }
            //     }
            //   }
            // }
            console.log("提交参数", _data);
            if (flag === false) return
            if (submitFlag) {
              addfinAccount(_data).then(res => {
                if (res.msg === 'Success') res.msg = '保存成功'
                this.$message({
                  message: res.msg,
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.btnLoading = false
                    this.$emit('close', true)
                  }
                })
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              this.btnLoading = false
            }
          }

        } else {
          this.btnLoading = false
        }

      })

    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
          return !data.some(element => element.productsId === item.productsId);
        });
      }
      console.log(data, '传递数据1111');
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data,]
      console.log(this.dataFormTwo.data, '传递数据');
    },
    getBusInfo() {
      getBusinessFlowInfo('b012').then(res => {
        console.log(res, '流程信息')
        if (res.data) {
          if (res.data.enabledMark) {
            this.flowData = res.data
            this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
            this.dataForm.approvalFlag = res.data.enabledMark
          }
        } else {
          this.flowTemplateJson = {}
          this.dataForm.approvalFlag = false
          this.$message.error('未找到审批流程！')
        }
      }).catch(() => { })
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
  padding: 10px 30px;
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
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
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

::v-deep .el-date-table .today span {
  font-weight: 700;
  color: #C0C4CC !important;
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

::v-deep .workNode {
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
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

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}
</style>