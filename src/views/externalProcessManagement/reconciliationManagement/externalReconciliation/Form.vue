<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="dialogTitle + `外协对账单`" />
          <div class="options">
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="mainLoading">
          <el-tabs v-model="activeName" v-if="!approvalFlag" class="JNPF-el_tabs">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账单号" prop="orderNo" ref="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="客户名称" prop="supplierName" ref="supplierName">
                          <el-input v-model="dataForm.cooperativePartnerName" placeholder="请输入客户名称"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账日期" prop="reconciliationDate" ref="reconciliationDate">
                          <!-- <el-input v-model="dataForm.reconciliationDate" placeholder="请选择报价有效期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->

                          <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择对账日期"
                            :disabled="type == 'look' ? true : false"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="订单金额" prop="includingTaxAmount" ref="includingTaxAmount">
                          <el-input v-model="dataForm.includingTaxAmount" placeholder="请输入订单金额"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账金额" prop="totalReconciliationAmount" ref="totalReconciliationAmount">
                          <el-input v-model="dataForm.totalReconciliationAmount" placeholder="请输入对账金额"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark" ref="remark">
                          <el-input :disabled="type == 'look' ? true : false" type="textarea" :rows="3" maxlength="200"
                            v-model="dataForm.remark" placeholder="请输入备注"></el-input>
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

                      <el-table-column prop="stockMoveOrderNo" label="出入库单号" min-width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'stockMoveOrderNo'">
                            <div class="viewData">
                              <span>{{ scope.row.stockMoveOrderNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                            <div class="viewData">
                              <span>{{ scope.row.productCode ? scope.row.productCode : '调价' }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>
                                {{ scope.row.productName ? scope.row.productName : scope.row.drawingNo ? '' : '调价' }}
                              </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="drawingNo" label="品名规格" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo ? scope.row.drawingNo : '调价' }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="reconciliationUnitPrice" label="对账数量" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.reconciliationUnitPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位(主)" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="excludingTaxAmount" label="不含税金额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                            <div :class="['viewData', scope.row.excludingTaxAmount < 0 ? 'red' : 'green']">
                              <span>
                                {{
                                  scope.row.excludingTaxAmount < 0 ? scope.row.excludingTaxAmount : '+' +
                                  scope.row.excludingTaxAmount }} </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxAmount" label="税额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <div :class="['viewData', scope.row.taxAmount < 0 ? 'red' : 'green']">
                              <span>
                                {{ scope.row.taxAmount < 0 ? scope.row.taxAmount : '+' + scope.row.taxAmount }} </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="includingTaxAmount" label="含税金额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'">
                            <div :class="['viewData', scope.row.includingTaxAmount < 0 ? 'red' : 'green']">
                              <span>
                                {{
                                  scope.row.includingTaxAmount < 0 ? scope.row.includingTaxAmount : '+' +
                                  scope.row.includingTaxAmount }} </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="220">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" :disabled="type === 'look'" maxlength="20"
                            placeholder="请输入备注">
                            {{ scope.row.remark }}
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

                  <div class="text" style="height: 40px; line-height: 40px; background: #f5f7fa;">
                    <span style="font-weight:500;margin-right:10px">
                      不含税金额：
                      <span :class="dataForm.excludingTaxAmount > 0 ? 'green' : 'red'">
                        {{
                          dataForm.excludingTaxAmount > 0
                          ? '+' + dataForm.excludingTaxAmount
                          : dataForm.excludingTaxAmount
                        }}
                      </span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      税额：
                      <span :class="dataForm.taxAmount > 0 ? 'green' : 'red'">
                        {{ dataForm.taxAmount > 0 ? '+' + dataForm.taxAmount : dataForm.taxAmount }}
                      </span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      含税金额：
                      <span :class="dataForm.totalReconciliationAmount > 0 ? 'green' : 'red'">
                        {{
                          dataForm.totalReconciliationAmount > 0
                          ? '+' + dataForm.totalReconciliationAmount
                          : dataForm.totalReconciliationAmount
                        }}
                      </span>
                    </span>
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
          <el-collapse v-model="activeNames" v-else>
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账单号" prop="orderNo" ref="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="客户名称" prop="supplierName" ref="supplierName">
                          <el-input v-model="dataForm.cooperativePartnerName" placeholder="请输入客户名称"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账日期" prop="reconciliationDate" ref="reconciliationDate">
                          <!-- <el-input v-model="dataForm.reconciliationDate" placeholder="请选择报价有效期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->

                          <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择对账日期"
                            :disabled="type == 'look' ? true : false"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="订单金额" prop="includingTaxAmount" ref="includingTaxAmount">
                          <el-input v-model="dataForm.includingTaxAmount" placeholder="请输入订单金额"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="对账金额" prop="totalReconciliationAmount" ref="totalReconciliationAmount">
                          <el-input v-model="dataForm.totalReconciliationAmount" placeholder="请输入对账金额"
                            :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark" ref="remark">
                          <el-input :disabled="type == 'look' ? true : false" type="textarea" :rows="3" maxlength="200"
                            v-model="dataForm.remark" placeholder="请输入备注"></el-input>
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

                      <el-table-column prop="stockMoveOrderNo" label="出入库单号" min-width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'stockMoveOrderNo'">
                            <div class="viewData">
                              <span>{{ scope.row.stockMoveOrderNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                            <div class="viewData">
                              <span>{{ scope.row.productCode ? scope.row.productCode : '调价' }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>
                                {{ scope.row.productName ? scope.row.productName : scope.row.drawingNo ? '' : '调价' }}
                              </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="drawingNo" label="品名规格" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo ? scope.row.drawingNo : '调价' }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="reconciliationUnitPrice" label="对账数量" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.reconciliationUnitPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位(主)" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="excludingTaxAmount" label="不含税金额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                            <div :class="['viewData', scope.row.excludingTaxAmount < 0 ? 'red' : 'green']">
                              <span>
                                {{
                                  scope.row.excludingTaxAmount < 0 ? scope.row.excludingTaxAmount : '+' +
                                  scope.row.excludingTaxAmount }} </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxAmount" label="税额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <div :class="['viewData', scope.row.taxAmount < 0 ? 'red' : 'green']">
                              <span>
                                {{ scope.row.taxAmount < 0 ? scope.row.taxAmount : '+' + scope.row.taxAmount }} </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="includingTaxAmount" label="含税金额" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'">
                            <div :class="['viewData', scope.row.includingTaxAmount < 0 ? 'red' : 'green']">
                              <span>
                                {{
                                  scope.row.includingTaxAmount < 0 ? scope.row.includingTaxAmount : '+' +
                                  scope.row.includingTaxAmount }} </span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="220">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" :disabled="type === 'look'" maxlength="20"
                            placeholder="请输入备注">
                            {{ scope.row.remark }}
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

                  <div class="text" style="height: 40px; line-height: 40px; background: #f5f7fa;">
                    <span style="font-weight:500;margin-right:10px">
                      不含税金额：
                      <span :class="dataForm.excludingTaxAmount > 0 ? 'green' : 'red'">
                        {{
                          dataForm.excludingTaxAmount > 0
                          ? '+' + dataForm.excludingTaxAmount
                          : dataForm.excludingTaxAmount
                        }}
                      </span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      税额：
                      <span :class="dataForm.taxAmount > 0 ? 'green' : 'red'">
                        {{ dataForm.taxAmount > 0 ? '+' + dataForm.taxAmount : dataForm.taxAmount }}
                      </span>
                    </span>
                    <span style="font-weight:500;margin-right:10px">
                      含税金额：
                      <span :class="dataForm.totalReconciliationAmount > 0 ? 'green' : 'red'">
                        {{
                          dataForm.totalReconciliationAmount > 0
                          ? '+' + dataForm.totalReconciliationAmount
                          : dataForm.totalReconciliationAmount
                        }}
                      </span>
                    </span>
                  </div>
                </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import { mapGetters, mapState } from 'vuex'
import Process from '@/components/Process/Preview'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
export default {
  components: {
    Process, recordList
  },
  data() {
    return {
      activeNames: ['productInfo', 'basicInfo'],
      activeName: 'jcInfo',
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,

      dataFormTwo: {
        data: []
      },
      dataForm: {
        id: '',
        orderNo: '', // 单号
        cooperativePartnerName: '',
        reconciliationEndDate: '',
        excludingTaxAmount: '',
        includingTaxAmount: '',
        taxAmount: '',
        submitDate: '',
        createTime: '',
        createByName: '',
        remark: '',
        totalReconciliationAmount: '',
        approvalFlag: false, 
      },
      mainLoading: true,
      type: '',
      rules: {},
      productRules: {},
      productArr: [],
      formLoading: false,
      flowTemplateJson: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() { },
  methods: {
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type,approvalFlag) {
      console.log(id, type)
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.approvalFlag = approvalFlag
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getfinAccountDetail(this.dataForm.id).then((res) => {
            console.log(res, '详情')
            // return
            this.dataForm = res.data
            this.dataFormTwo.data = res.data.reconciliationLines
            this.mainLoading = false
          })
           // 流程信息和流转记录
           if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        }
      })
    },
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id).then(res => {
        if (res.data) {
          this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson) : null
          this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
          this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
          let flowTaskNodeList = res.data.flowTaskNodeList
          if (flowTaskNodeList.length) {
            for (let i = 0; i < flowTaskNodeList.length; i++) {
              const nodeItem = flowTaskNodeList[i]
              const loop = data => {
                if (Array.isArray(data)) data.forEach(d => loop(d))
                if (data.nodeId === nodeItem.nodeCode) {
                  if (nodeItem.type == 0) data.state = 'state-past'
                  if (nodeItem.type == 1) data.state = 'state-curr'
                  if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
                  return
                }
                if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                if (data.childNode) loop(data.childNode)
              }
              loop(this.flowTemplateJson)
            }
          }
        }
      }).catch(() => { })
    },
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
</style>
