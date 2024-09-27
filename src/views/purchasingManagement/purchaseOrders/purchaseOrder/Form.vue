<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="type === 'look' ? '查看采购订单' : '新建采购订单'" />
        </div>

        <div class="main">
          <el-tabs v-model="activeName" v-if="!approvalFlag">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="6" v-if="type === 'look'">
                        <el-form-item label="采购单号" prop="orderNo" ref="orderNo">
                          <el-input :disabled="type != 'add' ? true : false" type="text" v-model="dataForm.orderNo"
                            placeholder="采购单号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input disabled v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称"
                            @focus="openDialog"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker disabled v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" :picker-options="dataPickerOptions2"
                            placeholder="请选择交货日期" ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                            <div class="viewData">
                              <span>{{ scope.row.productCode }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>{{ scope.row.productName }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column> -->

                      <el-table-column prop="planDemandQuantity" label="计划需求数量" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                            <div class="viewData">
                              <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="purchaseQuantity" label="采购数量" width="90">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                            :rules="productRules.purchaseQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="receiptQuantity" label="已入库数量" width="110">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                            :rules="productRules.receiptQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" width="60" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" label="含税单价" width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                            <div class="viewData">
                              <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" label="税率" width="60">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                            <div class="viewData">
                              <span>{{ scope.row.taxRate }}%</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxAmount" label="税额" width="80">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="totalAmount" label="价税合计" width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deliveryDate" label="交货日期" width="180">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" disabled :picker-options="dataPickerOptions"
                              placeholder="请选择交货日期"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="200">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" disabled maxlength="20"
                            :placeholder="type == 'look' ? '' : '请输入备注'">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>

                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <!-- <span style="font-weight:500;margin-right:10px">
                      总金额：{{ dataForm.excludingTaxTotalAmount }}
                    </span> -->
                    <span style="font-weight:500;margin-right:10px">总税额：{{ computedValue2 }}</span>
                    <span style="font-weight:500;margin-right:10px">价税合计：{{ computedValue }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
              <recordList :list="flowTaskOperatorRecordList" :endTime="endTime" />
            </el-tab-pane>
          </el-tabs>
          <el-collapse v-model="activeNames" v-else>
            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
              <el-row :gutter="15" class="">
                <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="6" v-if="type === 'look'">
                    <el-form-item label="采购单号" prop="orderNo" ref="orderNo">
                      <el-input :disabled="type != 'add' ? true : false" type="text" v-model="dataForm.orderNo"
                        placeholder="采购单号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <el-input disabled v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称"
                        @focus="openDialog"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker disabled v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" :picker-options="dataPickerOptions2"
                        placeholder="请选择交货日期"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-collapse-item>

            <el-collapse-item title="产品信息" name="productInfo">
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                  <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="planDemandQuantity" label="计划需求数量" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="purchaseQuantity" label="采购数量" width="100">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                        :rules="productRules.purchaseQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="receiptQuantity" label="已入库数量" width="110">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                        :rules="productRules.receiptQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位" width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="price" label="含税单价" width="100">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                        <div class="viewData">
                          <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率" width="80">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                        <div class="viewData">
                          <span>{{ scope.row.taxRate }}%</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxAmount" label="税额" width="80">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="totalAmount" label="价税合计" width="100">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="deliveryDate" label="交货日期" width="180">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;" disabled :picker-options="dataPickerOptions"
                          placeholder="请选择交货日期"></el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="220">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" disabled maxlength="20"
                        :placeholder="type == 'look' ? '' : '请输入备注'">
                        {{ scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>

              <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin-right:10px">总金额：{{ dataForm.excludingTaxTotalAmount }}</span>
                <span style="font-weight:500;margin-right:10px">总税额：{{ dataForm.taxAmount }}</span>
                <span style="font-weight:500;margin-right:10px">价税合计：{{ dataForm.totalAmount }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { insertPurchaseOrder, purPurchaseOrderdetail, orderSchedule } from '@/api/purchasingAndOutsourcingOrders/index'
import { excelExport } from '@/api/basicData/index'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
export default {
  components: {
    workFlow,
    ExportForm,
    Process,
    recordList
  },
  mixins: [busFlow],
  data() {
    return {
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },

      dataForm: {
        cooperativePartnerName: '', //供应商名称
        deliveryDate: '', //交货日期.
        orderNo: '',
        orderType: 'procure',
        purchaseOrderLines: [],
        excludingTaxTotalAmount: '', //订单 不含税总金额
        totalAmount: '', //   含税总金额
        taxAmount: '', // 税额
        approvalFlag: false
      },
      receivingStatusOptions: [
        {
          value: 'not_finished',
          label: '未完成'
        },
        {
          value: 'finished',
          label: '已完成'
        },
        {
          value: 'stopped',
          label: '已停止'
        }
      ],
      dataPickerOptions: {
        // 日期区间选择器通用选项
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      dataPickerOptions2: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate
      },
      type: '',
      dataFormArr: [],
      rules: {},
      productRules: {},
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',
      olddeliveryDateArr: [], // 表格中旧的数据值
      total: 0,
      background: true, //分页器背景颜色
      exportFormVisible: false,
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0
    }
  },
  created() { },
  computed: {
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      let num = 0
      let num2 = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.totalAmount * 1
      })
      this.dataForm.totalAmount = this.jnpf.numberFormat(count)
      return this.dataForm.totalAmount
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
  methods: {
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 对比日期方法
    changeDate(d1, d2) {
      console.log(d1, d2)
      return new Date(d1.replace((/-/g, '\/'))) > new Date(d2.replace(/-/g, '\/'))
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },
    supplierdata(data) {
      console.log(data, '供应商数据')
      if (data.length === 0) {
        this.$refs['dataForm'].validateField('cooperativePartnerName')
      } else {
        this.$refs['dataForm'].fields[0].resetField()
        this.dataForm.cooperativePartnerName = data.name
        this.dataForm.cooperativePartnerCode = data.code
        this.dataForm.cooperativePartnerId = data.id
      }
    },

    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number)
        .toFixed(2)
        .replace(/\.?0+$/, '')
      console.log(formatted, '8888')
      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    //下单数量输入事件
    changePurchaseQuantity(index, val) {
      // console.log(val);
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)
      console.log(this.dataFormTwo.data[index].purchaseQuantity)
    },

    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, approvalFlag) {
      console.log(id, type)
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.approvalFlag = approvalFlag
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          purPurchaseOrderdetail(this.dataForm.id).then((res) => {
            console.log(res, '详情')
            if (res.data.attachmentList) {
              res.data.attachmentList.forEach((item) => {
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }
            this.dataForm = res.data
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList
            // 流程信息和流转记录
            if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
          })
        }
      })
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.scheduleRef.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      console.log(data, '导出')
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.scheduleForm,
          exportType: '1104',
          exportName: '采购订单进度跟踪',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.scheduleForm.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b009')
        .then((res) => {
          if (res.data) {
            if (res.data.enabledMark) {
              this.flowData = res.data
              this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
              this.dataForm.approvalFlag = res.data.enabledMark
            } else {
              this.flowTemplateJson = {}
              this.dataForm.approvalFlag = false
              this.$message.error('未找到审批流程！')
            }
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
          }
        })
        .catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
            this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
            let flowTaskNodeList = res.data.flowTaskNodeList
            if (flowTaskNodeList.length) {
              for (let i = 0; i < flowTaskNodeList.length; i++) {
                const nodeItem = flowTaskNodeList[i]
                const loop = (data) => {
                  if (Array.isArray(data)) data.forEach((d) => loop(d))
                  if (data.nodeId === nodeItem.nodeCode) {
                    if (nodeItem.type == 0) data.state = 'state-past'
                    if (nodeItem.type == 1) data.state = 'state-curr'
                    if (
                      nodeItem.nodeType === 'approver' ||
                      nodeItem.nodeType === 'start' ||
                      nodeItem.nodeType === 'subFlow'
                    )
                      data.content = nodeItem.userName
                    return
                  }
                  if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                  if (data.childNode) loop(data.childNode)
                }
                loop(this.flowTemplateJson)
              }
            }
          }
        })
        .catch(() => { })
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

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
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
  padding: 10px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
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

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

/* 进度跟踪样式 */
::v-deep #pane-schedule {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  margin-bottom: 10px;
  /* padding: 0 20px; */
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

::v-deep .el-progress-bar {
  padding-right: 65px !important;
}

::v-deep .el-progress__text {
  margin-left: -7px !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
