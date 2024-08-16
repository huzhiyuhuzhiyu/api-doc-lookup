<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="生成外协对账单" />
          <div class="options">
            <!-- <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交
            </el-button>
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
                          <el-input disabled v-model="dataForm.cooperativePartnerName"
                            placeholder="请选择供应商名称"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="对账日期" prop="reconciliationDate">
                          <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择对账日期"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="订单金额" prop="includingTaxAmount">
                          <el-input disabled v-model="includingTaxAmount" placeholder="订单金额"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="对账金额" prop="totalReconciliationAmount">
                          <el-input v-model="dataForm.totalReconciliationAmount" disabled
                            placeholder="请输入对账金额"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark" ref="remark">
                          <el-input type="textarea" :rows="3" maxlength="200" v-model="dataForm.remark"
                            placeholder="请输入备注"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" @click="addAdjustmentBtn()">
                      增加调价行
                    </el-button>
                    <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-delete"
              @click="batchDelete">批量删除</el-button>| -->
                  </div>

                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                      <!-- <el-table-column prop="productCode" label="产品编码" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
</el-table-column> -->

                      <!-- <el-table-column prop="productName" label="产品名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.productDrawingNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="receiptReturnType" label="收/退货类型" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptReturnType'">
                            <div class="viewData">
                              <span>
                                {{
                                  scope.row.receiptReturnType === 'outbound_purchase'
                                    ? '退货'
                                    : scope.row.receiptReturnType === 'inbound_purchase'
                                      ? '收货'
                                      : ''
                                }}
                              </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mainUnit" label="单位" min-width="200" show-overflow-tooltip>
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
                      <el-table-column prop="reconciliationUnitPrice" label="数量" min-width="200">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.reconciliationUnitPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <!-- 
                  <el-table-column prop="deputyUnit" label="单位(副)" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
              
                        <div class="viewData">
                          <span>{{ scope.row.deputyUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <!-- <el-table-column prop="price" label="单价" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">

                        <div class="viewData">
                          <span>{{ scope.row.price }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <!-- <el-table-column prop="taxRate" label="税率%" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">

                        <div class="viewData">
                          <span>{{ scope.row.taxRate }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <!-- <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxPrice }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <el-table-column prop="excludingTaxAmount" label="不含税总金额" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'"
                            :rules="productFormRules.excludingTaxAmount">
                            <!-- <el-input v-model="scope.row.excludingTaxAmount" maxlength="20" placeholder="请输入不含税总金额">
                        </el-input> -->
                            <div :class="[
                              'viewData',
                              scope.row.receiptReturnType === 'outbound_purchase' ? 'green' : 'red'
                            ]">
                              <span v-if="scope.row.receiptReturnType === 'outbound_purchase'">
                                +{{ scope.row.excludingTaxAmount }}
                              </span>
                              <span v-else-if="scope.row.receiptReturnType === 'inbound_purchase'">
                                {{ scope.row.excludingTaxAmount }}
                              </span>
                              <el-input v-if="!scope.row.receiptReturnType" disabled
                                v-model="scope.row.excludingTaxAmount">
                                {{ scope.row.excludingTaxAmount }}
                              </el-input>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxAmount" label="税额" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'"
                            :rules="productFormRules.taxAmount">
                            <div :class="[
                              'viewData',
                              scope.row.receiptReturnType === 'outbound_purchase' ? 'green' : 'red'
                            ]">
                              <span v-if="scope.row.receiptReturnType === 'outbound_purchase'">
                                +{{ scope.row.taxAmount }}
                              </span>
                              <span v-else-if="scope.row.receiptReturnType === 'inbound_purchase'">
                                {{ scope.row.taxAmount }}
                              </span>

                              <el-input v-if="!scope.row.receiptReturnType" v-model="scope.row.taxAmount" disabled>
                                {{ scope.row.taxAmount }}
                              </el-input>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="includingTaxAmount" label="含税总金额" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'"
                            :rules="productFormRules.includingTaxAmount">
                            <div :class="[
                              'viewData',
                              scope.row.receiptReturnType === 'outbound_purchase' ? 'green' : 'red'
                            ]">
                              <span v-if="scope.row.receiptReturnType === 'outbound_purchase'">
                                +{{ scope.row.includingTaxAmount }}
                              </span>
                              <span v-else-if="scope.row.receiptReturnType === 'inbound_purchase'">
                                {{ scope.row.includingTaxAmount }}
                              </span>
                              <el-input v-if="!scope.row.receiptReturnType" v-model="scope.row.includingTaxAmount">
                                {{ scope.row.includingTaxAmount }}
                              </el-input>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" maxlength="20" placeholder="请输入备注">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" width="120" fixed="right" v-if="dataFormTwo.data.length > 1">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)"
                            :disabled="newArr.length <= 1 && (scope.row.productCode ? true : false)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                  <div class="text" style="height: 40px; line-height: 40px; background: #f5f7fa;">
                    <span style="font-weight:500;margin-right:10px">
                      退货合计金额：
                      <span class="red">{{ backComputedValue }}</span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      收货合计金额：
                      <span class="green">+{{ receiptComputedValue }}</span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      不含税金额：
                      <span :class="computedValue > 0 ? 'green' : 'red'">
                        {{ computedValue > 0 ? '+' + computedValue : computedValue }}
                      </span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      税额：
                      <span :class="computedValue2 > 0 ? 'green' : 'red'">
                        {{ computedValue2 > 0 ? '+' + computedValue2 : computedValue2 }}
                      </span>
                    </span>
                    <!-- <span style="font-weight:500;margin-right:10px">价税合计：{{ computedValue3 }}</span> -->
                    <span style="font-weight:500;margin-right:10px">
                      合计金额：
                      <span :class="brComputedValue > 0 ? 'green' : 'red'">
                        {{ brComputedValue > 0 ? '+' + brComputedValue : brComputedValue }}
                      </span>
                    </span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow">
              <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="type" :nodeConfig.sync="busNodeConfig"
                ref="workflowRef" />
              <div class="noDataTip" v-if="!workVisible">
                <span class="el-table__empty-text">
                  <div data-v-4d190d64="" class="el-empty">
                    <div class="el-empty__image" style="width: 120px;">
                      <svg viewBox="0 0 79 86" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                          <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                            <stop stop-color="#FCFCFD" offset="0%"></stop>
                            <stop stop-color="#EEEFF3" offset="100%"></stop>
                          </linearGradient>
                          <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                            <stop stop-color="#FCFCFD" offset="0%"></stop>
                            <stop stop-color="#E9EBEF" offset="100%"></stop>
                          </linearGradient>
                          <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                        </defs>
                        <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                            <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                              <path id="Oval-Copy-2"
                                d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                                fill="#F7F8FC"></path>
                              <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                                transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                                points="13 58 53 58 42 45 2 45"></polygon>
                              <g id="Group-Copy"
                                transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                                <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                  transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                  points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                                <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                  points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                                <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                  transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                  x="38" y="7" width="17" height="36"></rect>
                                <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                  transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                  points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                              </g>
                              <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                                height="36">
                              </rect>
                              <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                                <mask id="mask-4-48" fill="white">
                                  <use xlink:href="#path-3-48"></use>
                                </mask>
                                <use id="Mask" fill="#E0E3E9"
                                  transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                  xlink:href="#path-3-48"></use>
                                <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                  transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                  points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                              </g>
                              <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                                transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                                points="62 45 79 45 70 58 53 58"></polygon>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div class="el-empty__description">
                      <p>暂无流程信息</p>
                    </div>
                    <!---->
                  </div>
                </span>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look'" label="流转记录" name="transferList">
              <el-table v-loading="formLoading" :data="transferData">
                <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
                <el-table-column prop="processedName" label="办理人名称" min-width="160" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column prop="startDate" label="开始时间" min-width="160" />
                <el-table-column prop="endDate" label="结束时间" min-width="160" />
                <el-table-column prop="consumingTime" label="耗时" min-width="160" />
              </el-table>
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
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
export default {
  components: {
    workFlow
  },
  data() {
    return {
      activeNames: ['productInfo', 'basicInfo'],
      activeName: 'jcInfo',
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
        cooperativePartnerName: '', //供应商名称
        reconciliationDate: '', //交货日期.
        reconciliationType: 'outside_processing',
        reasonRejection: '',
        id: null,
        documentStatus: 'submit',
        orderNo: '',
        remark: '',
        submitDate: '',
        excludingTaxAmount: '', //订单 不含税总金额
        includingTaxAmount: '', //   含税总金额
        totalReconciliationAmount: '', // 对账总金额
        taxAmount: '', // 税额
        backAmount: '', // 退货总金额
        receiptAmount: '', // 收货总金额
        brTotalAmount: '' // 收/退货总金额
      },
      newArr: [],
      type: '',
      dataFormArr: [],
      rules: {
        reconciliationDate: [{ required: true, message: '请选择对账日期', trigger: ['change'] }],

        totalReconciliationAmount: [
          { required: true, message: '请输入对账金额', trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal2', params: [10, 2, ''] }), trigger: 'blur' }
        ]
      },
      productRules: {},
      productFormRules: {
        includingTaxAmount: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '请输入含税总金额',
                (errMsg) => {
                  this.$message.error('' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          { required: true, message: '请输入含税总金额', trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal2',
              params: [
                20,
                6,
                '',
                (errMsg, index) => {
                  this.$message.error('' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      includingTaxAmount: 0,
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: '发起人',
        nodeType: 0,
        type: 'node',
        priorityLevel: '',
        approvalType: 'appoint',
        selectMode: '',
        selectRange: '',
        directorLevel: '',
        examineMode: '',
        whenEmpty: '',
        examineEndDirectorLevel: '',
        ccSelfSelectFlag: '',
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      // 审批 转审记录参数
      transferQuery: {
        approvalFormId: '',
        createByName: '',
        documentId: '',
        endTime: '',
        keyword: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ''
      },
      transferData: [],
      formLoading: false
    }
  },
  created() {
    this.fetchData('DZDH')
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      let num = 0
      let num2 = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxAmount = this.jnpf.numberFormat(count)
      return this.dataForm.excludingTaxAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)
      return this.dataForm.taxAmount
    },
    backComputedValue() {
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        if (item.receiptReturnType == 'inbound_purchase') {
          count += item.includingTaxAmount * 1
        }
      })
      this.dataForm.backAmount = this.jnpf.numberFormat(count)
      return this.dataForm.backAmount
    },
    receiptComputedValue() {
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        if (item.receiptReturnType === 'outbound_purchase') {
          count += item.includingTaxAmount * 1
        }
      })
      this.dataForm.receiptAmount = this.jnpf.numberFormat(count)
      return this.dataForm.receiptAmount
    },
    brComputedValue() {
      let count = 0
      if (this.dataForm.excludingTaxAmount !== '' && this.dataForm.taxAmount !== '') {
        count = this.dataForm.excludingTaxAmount * 1 + this.dataForm.taxAmount * 1
      }
      console.log('count', count)
      this.dataForm.includingTaxAmount = this.jnpf.numberFormat(count)
      return this.dataForm.includingTaxAmount
    }
  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        console.log(111, newVal)
        newVal.forEach((item) => {
          if (item.receiptReturnType === 'outbound_purchase') {
            if (item.includingTaxAmount) {
              if (!newVal[0].taxRate || newVal[0].taxRate == 0) {
                item.excludingTaxAmount = item.excludingTaxAmount
              } else {
                item.excludingTaxAmount = this.jnpf.numberFormat(
                  item.includingTaxAmount / (1 + newVal[0].taxRate / 100),
                  2
                )
                item.taxAmount = this.jnpf.numberFormat(item.includingTaxAmount - item.excludingTaxAmount, 2)
              }
            }
          } else if (item.receiptReturnType === 'inbound_purchase') {
            if (item.includingTaxAmount) {
              if (!newVal[0].taxRate || newVal[0].taxRate == 0) {
                item.excludingTaxAmount = item.excludingTaxAmount
              } else {
                item.excludingTaxAmount = this.jnpf.numberFormat(
                  item.includingTaxAmount / (1 + newVal[0].taxRate / 100),
                  2
                )
                item.taxAmount = this.jnpf.numberFormat(item.includingTaxAmount - item.excludingTaxAmount, 2)
              }
            }
          } else {
            if (item.includingTaxAmount) {
              item.excludingTaxAmount = this.jnpf.numberFormat(
                item.includingTaxAmount / (1 + newVal[0].taxRate / 100),
                2
              )
              item.taxAmount = this.jnpf.numberFormat(item.includingTaxAmount - item.excludingTaxAmount, 2)
            }
          }
        })
      },
      deep: true
    },
    'dataForm.includingTaxAmount': {
      handler: function (newVal, oldVal) {
        console.log(newVal, '// immediate:true,')
        this.dataForm.totalReconciliationAmount = newVal
      },
      immediate: true
    }
  },
  methods: {
    addAdjustmentBtn() {
      console.log(234, this.dataFormTwo.data)
      this.dataFormTwo.data.push({
        accountsReceivableId: '',
        calculationDirection: '',
        confirmReceiptRecordsId: '',
        confirmReceiptRecordsLineId: '',
        deputyUnit: '',
        id: null,
        includingTaxAmount: '',
        receiptReturnType: '',
        mainUnit: '',
        ordersLineId: '',
        ordersId: '',
        productsId: '',
        productName: '调价',
        productCode: '',
        productDrawingNo: '调价',
        ratio: '',
        reconciliationUnitPrice: '',
        remark: '',
        excludingTaxPrice: '',
        excludingTaxAmount: '',
        taxAmount: '0',
        taxRate: '',
        price: '',
        adjustmentLineFlag: true
      })
      this.newArr = this.dataFormTwo.data.filter((item) => item.adjustmentLineFlag === false)
      console.log(' this.dataFormTwo.data', this.dataFormTwo.data)
    },
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(data) {
      this.dataFormTwo.data = []
      // 避免传递过来的数据 输入框设置默认值后无法修改 因为内存地址的问题 指向了同一个
      console.log(77777, data)
      let _data = JSON.parse(JSON.stringify(data))
      _data.forEach((item) => {
        let excludingTaxAmount =
          item.businessType === 'outbound_purchase'
            ? this.jnpf.numberFormat(
              item.num * this.jnpf.numberFormat(item.costPrice / (1 + (item.taxRate * 1) / 100), 2),
              2
            )
            : -this.jnpf.numberFormat(
              item.num * this.jnpf.numberFormat(item.costPrice / (1 + (item.taxRate * 1) / 100))
            )
        let includingTaxAmount =
          item.businessType === 'inbound_purchase'
            ? this.jnpf.numberFormat(Math.abs(excludingTaxAmount) * (1 + (item.taxRate * 1) / 100))
            : this.jnpf.numberFormat(excludingTaxAmount * (1 + (item.taxRate * 1) / 100))
        this.dataFormTwo.data.push({
          accountsReceivableId: '',
          calculationDirection: item.calculationDirection,
          confirmReceiptRecordsId: item.id,
          confirmReceiptRecordsLineId: item.noticeLineId,
          deputyUnit: item.deputyUnit,
          id: null,
          includingTaxAmount: includingTaxAmount,
          receiptReturnType: item.businessType,
          mainUnit: item.mainUnit,
          ordersLineId: item.ordersLineId,
          ordersId: item.ordersId,
          moveId: item.moveId,
          moveLineId: item.id,
          productsId: item.productsId,
          productName: item.productName,
          productCode: item.productCode,
          productDrawingNo: item.drawingNo,
          ratio: item.ratio,
          reconciliationUnitPrice: item.num,
          remark: item.remark,
          excludingTaxPrice: this.jnpf.numberFormat(item.costPrice / (1 + (item.taxRate * 1) / 100), 2),
          excludingTaxAmount: excludingTaxAmount,
          taxAmount:
            item.businessType === 'outbound_purchase'
              ? this.jnpf.numberFormat(includingTaxAmount - excludingTaxAmount)
              : this.jnpf.numberFormat(includingTaxAmount - excludingTaxAmount),
          taxRate: item.taxRate,
          price: item.costPrice,
          adjustmentLineFlag: false
          // totalAmount: this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.actualQuantity * item.excludingTaxAmount),
        })
      })
      this.listLoading = false

      this.dataFormTwo.data.forEach((item, index) => {
        if (item.receiptReturnType === 'outbound_purchase') {
          item.includingTaxAmount = this.jnpf.numberFormat(item.reconciliationUnitPrice * item.price)
          this.includingTaxAmount += this.jnpf.numberFormat(item.reconciliationUnitPrice * item.price)
        } else {
          item.includingTaxAmount = -this.jnpf.numberFormat(item.reconciliationUnitPrice * item.price)
          this.includingTaxAmount += this.jnpf.numberFormat(item.excludingTaxAmount + item.taxAmount)
        }
      })
      console.log('this.dataFormTwo.data', this.dataFormTwo.data)
      this.dataForm.cooperativePartnerName = data[0].partnerName
      this.dataForm.cooperativePartnerId = data[0].cooperativePartnerId
      // 获取当前日期
      const currentDate = new Date()

      // 获取年份
      const year = currentDate.getFullYear()

      // 获取月份（注意月份从0开始，所以要加1）
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')

      // 获取日期
      const date = String(currentDate.getDate()).padStart(2, '0')

      // 拼接为YYYY-MM-DD格式
      const formattedDate = `${year}-${month}-${date}`
      this.dataForm.reconciliationDate = formattedDate
      // // 审批
      this.$nextTick(() => { this.getApproverData() })
    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      // this.btnLoading = true
      let submitFlag = true
      // // 审批条件参数列表
      // let nodeCondList = []
      // // 审批抄送人列表
      // let ccList = []
      let ccLists = []
      let nodeJudg = []
      // // 业务审批单流程节点列表
      let formNodeList = []
      // // 业务审批单
      let form = {}
      // let templateLineList = []
      // if (this.busNodeConfig.childNode) {
      //   let data = JSON.parse(JSON.stringify(this.busNodeConfig))
      //   let flattenedNodes = this.flattenNodes(data);
      //   flattenedNodes.splice(0, 1)
      //   flattenedNodes = flattenedNodes.map(item => {
      //     return {
      //       ...item,
      //       nodeUserList: item.nodeUserList ? item.nodeUserList : []
      //     }
      //   })
      //   templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
      //   // 抄送人节点数组 ccList
      //   ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

      //   for (var i = 0; i < ccList.length; i++) {
      //     var nodeUserList = ccList[i].nodeUserList;
      //     ccLists = ccLists.concat(nodeUserList);
      //   }

      //   if (templateLineList.length) {
      //     submitFlag = templateLineList.every(item => item.nodeUserList.length)
      //     if (!submitFlag) {
      //       this.$message.error('审核人不能为空！')
      //       this.btnLoading = false
      //       return
      //     }
      //   }
      //   if (ccList.length) {
      //     submitFlag = ccList.every(item => item.nodeUserList.length)
      //     if (!submitFlag) {
      //       this.$message.error('抄送人不能为空！')
      //       this.btnLoading = false
      //       return
      //     }
      //   }
      //   // 条件节点数组 nodeJudgmentList
      //   nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
      //   // 业务审批单流程节点参数
      //   formNodeList = flattenedNodes.map((item, index) => {
      //     return {
      //       ...item,
      //       approvalStatus: item.name == '审核人' ? 'no' : '',
      //       adminId: '',
      //       id: '',
      //       previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
      //       name: item.nodeName,
      //       designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
      //     }
      //   })
      //   // 抄送人
      //   ccLists = ccLists.map(item => {
      //     return {
      //       ...item,
      //       approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
      //       ccToId: item.targetId,
      //       approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
      //       id: '',
      //       defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
      //     }
      //   })
      //   // 条件列表
      //   if (nodeCondList.length) {
      //     nodeJudg = nodeCondList.map(item => {
      //       return {
      //         ...item,
      //         approvalFormNodeCode: item.code,
      //         businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
      //         code: item.conditionList[0].tjCode,
      //         dataType: item.conditionList[0].dataType,
      //         id: item.conditionList[0].id ? item.conditionList[0].id : ''
      //       }
      //     })
      //   }
      //   // 业务审批单
      //   form = {
      //     ...this.approvalForm,
      //     approvalTemplateId: this.approvalForm.id,
      //     documentStatus: 'submit',
      //     documentId: '',
      //     id: ''
      //   }
      // }
      // if (this.dataForm.approvalFlag) {
      //   if (!this.busNodeConfig.childNode) {
      //     submitFlag = false
      //     this.btnLoading = false
      //     this.$message.error('未找到匹配的审批流程，请联系管理员！')
      //   }
      //   if (formNodeList.length) {
      //     formNodeList.forEach(item => {
      //       if (item.approvalType === 'option') {
      //         if (!item.designatedMembersId) {
      //           submitFlag = false
      //           this.btnLoading = false
      //           this.activeName = "approvalFlow"
      //           this.$message.error('未配置发起人自选！')
      //         }
      //       }
      //     })
      //   }
      // }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      console.log(this.dataForm, '参数')
      console.log(valid_2, '11111111111111111')
      // return
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (!valid_2) {
            console.log(1)
            this.btnLoading = false
            // for (let i = 0; i < this.dataFormTwo.data.length; i++) {
            //   const item = this.dataFormTwo.data[i]

            // }
            return
          } else {
            this.btnLoading = true
            let totalExcludingTaxAmount = 0
            let totalTaxAmount = 0
            let totalIncludingTaxAmount = 0

            this.dataFormTwo.data.forEach((item) => {
              if (item.productsId === '') {
                totalExcludingTaxAmount += parseInt(item.excludingTaxAmount)
                totalTaxAmount += parseInt(item.taxAmount)
                totalIncludingTaxAmount += parseInt(item.includingTaxAmount)
              }
            })
            this.dataForm.adjustExcludingTaxAmount = totalExcludingTaxAmount
            this.dataForm.adjustIncludingTaxAmount = totalIncludingTaxAmount
            this.dataForm.adjustTaxAmount = totalTaxAmount
            let _data = {
              reconciliation: JSON.parse(JSON.stringify(this.dataForm)),
              reconciliationLine: JSON.parse(JSON.stringify(this.dataFormTwo.data)),
              form,
              formNodeList,
              nodeCondList: nodeJudg,
              ccList: ccLists
            }
            _data.reconciliation.includingTaxAmount = this.includingTaxAmount

            if (submitFlag) {
              setTimeout(() => {
                addfinAccount(_data)
                  .then((res) => {
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
                  })
                  .catch(() => {
                    this.btnLoading = false
                  })
              }, 1000)
            } else {
              this.btnLoading = false
            }
          }
        } else {
          this.btnLoading = false
        }
      })
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
      } catch (error) { }
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj)
      if (obj) {
        if (obj.name === '审核人') {
          obj.nodeType = 1
          obj.nodeName = obj.name
          obj.directorLevel = obj.approvalType == 'manager' ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == 'multilevel' ? obj.levelSupervisor : ''
        }
        if (obj.name === '路由') {
          obj.nodeType = 4
        }
        if (obj.name === '抄送人') {
          obj.nodeType = 2
          obj.nodeName = obj.name
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode)
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map((item) => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(',') // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',')
                  var resultArr = []
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      }
                      resultArr.push(option)
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType:
                    item.dataType == 'number'
                      ? item.operationalFormula == 'lt'
                        ? '1'
                        : item.operationalFormula == 'gt'
                          ? '2'
                          : item.operationalFormula == 'eq'
                            ? '4'
                            : item.operationalFormula == 'ge'
                              ? '5'
                              : item.operationalFormula == 'le'
                                ? '3'
                                : ''
                      : ''
                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode)
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1')
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null })
        if (node.type === 'node') {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code)
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {
              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code)
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code)
          }
        }
      }
      return flattenedNodes
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = '' // 条件符号
      let result = null // 判断条件是否成立
      let condList = []
      getBusDetail('b014').then((res) => {
        console.log(res)
        state = res.data.business.state
        condExpress = res.data.business.condExpress
        // if (res.data.businessConditionList.length) {
        //   res.data.businessConditionList.forEach(item => {
        //     condList.push({
        //       code: item.code,
        //       val: item.code === 'numCode' ? this.totalNum : this.totalPrice
        //     })
        //   })
        // }
        if (state === 'condition') {
          this.dataForm.approvalFlag = 1
          for (var i = 0; i < condArr.length; i++) {
            if (condExpress.includes(condArr[i])) {
              foundSymbol = condArr[i]
              break
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol) // 使用 ">" 符号拆分字符串
            const leftValue = parts[0] // 提取 ">" 符号左边的值
            const rightValue = parts[1] // 提取 ">" 符号右边的值
            console.log(leftValue)
            console.log(rightValue)
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: 'b014',
                condList
              }
              busApprovalFlowTree(query).then((res) => {
                console.log(res, '树详情')
                if (res.data) {
                  this.firstOneNode = []
                  this.approvalForm = res.data.template
                  this.firstOneNode.push({
                    name: this.userInfo.userName
                  })
                  let data = res.data.tempLineTree.childNode
                  if (data) {
                    this.addNodeTypeAndNodeName(data)
                    this.busNodeConfig.childNode = data
                    this.workVisible = true
                    this.$nextTick(() => {
                      this.$refs.workflowRef.initData('busing', this.type)
                    })
                  }
                } else {
                  this.busNodeConfig.childNode = null
                }
              })
            } else {
              this.busNodeConfig.childNode = null
            }
          }
        }
        if (state === 'enable') {
          this.dataForm.approvalFlag = 1
          let query = {
            businessCode: 'b014',
            condList
          }
          busApprovalFlowTree(query).then((res) => {
            console.log(res, '树详情')
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.template
              this.firstOneNode.push({
                name: this.userInfo.userName
              })
              let data = res.data.tempLineTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)
                this.busNodeConfig.childNode = data
                this.workVisible = true
                this.$nextTick(() => {
                  this.$refs.workflowRef.initData('busing', this.type)
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
        if (state === 'disabled') {
          this.dataForm.approvalFlag = 0
          this.busNodeConfig.childNode = null
        }
      })
    }
  }
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

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding: 0px;
}

::v-deep .el-tabs__header {
  padding: 0px !important;
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
  color: #c0c4cc !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.red {
  color: red;
}

.green {
  color: #67c23a;
}

::v-deep .workNode {
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

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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
  padding-bottom: 0px;
}

.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}
</style>
