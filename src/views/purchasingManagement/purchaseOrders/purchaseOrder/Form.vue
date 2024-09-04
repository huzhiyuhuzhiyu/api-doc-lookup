<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="type === 'look' ? '查看采购订单' : '新建采购订单'" />
          <div class="options" v-if="type !== 'look'">
            <!-- <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button> -->
            <!-- <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button> -->
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="8" v-if="type === 'look'">
                        <el-form-item label="采购单号" prop="orderNo" ref="orderNo">
                          <el-input :disabled="type != 'add' ? true : false" type="text" v-model="dataForm.orderNo"
                            placeholder="采购单号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input disabled v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称"
                            @focus="openDialog"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker disabled v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" :picker-options="dataPickerOptions2"
                            placeholder="请选择交货日期"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" v-if="type === 'look'">
                        <el-form-item label="收货状态" prop="receivingStatus" ref="receivingStatus">
                          <el-input type="text" v-model="dataForm.receivingStatus === 'receiving' ? '未完成' : '已完成'"
                            placeholder="收货状态" :disabled="type != 'add' ? true : false"></el-input>
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
                      <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>{{ scope.row.productName }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="spec" label="规格型号" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'spec'">
                        <div class="viewData">
                          <span>{{ scope.row.spec }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <el-table-column prop="planDemandQuantity" label="计划需求数量" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                            <div class="viewData">
                              <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="purchaseQuantity" label="采购数量" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                            :rules="productRules.purchaseQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="receiptQuantity" label="已入库数量" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                            :rules="productRules.receiptQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位(主)" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deputyUnit" label="单位(副)" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.deputyUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" label="含税单价" min-width="120">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                            <div class="viewData">
                              <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
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

                      <!-- <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160">
                
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                 
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxPrice  ? scope.row.excludingTaxPrice  : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160">
               
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                 
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount  : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <el-table-column prop="taxAmount" label="税额" min-width="120">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="totalAmount" label="价税合计" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="240">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" disabled :picker-options="dataPickerOptions"
                              placeholder="请选择交货日期"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="receivingStatus" label="收货状态" width="130">
                        <template slot-scope="scope">
                          <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag></div>
                          <div v-if="scope.row.receivingStatus == 'received'">
                            <el-tag type="success">已完成</el-tag>
                          </div>
                          <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
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

                      <!-- <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)">删除</el-button>

                        </template>
                      </el-table-column> -->
                    </el-table>
                  </el-form>

                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">
                      总金额：{{ dataForm.excludingTaxTotalAmount }}
                    </span>
                    <span style="font-weight:500;margin-right:10px">总税额：{{ dataForm.taxAmount }}</span>
                    <span style="font-weight:500;margin-right:10px">价税合计：{{ dataForm.totalAmount }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>

              <!-- <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-plus" @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                  </div> -->
            </el-tab-pane>
      >
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
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
    <!-- <Products-dialog v-if="productVisibled" ref="productRef" @productsSubmit="productsSubmit"></Products-dialog> -->
    <!-- <SupplierDialog ref="SupplierRef" @supplierdata="supplierdata" /> -->
  </div>
</template>
<script>
// import ProductsDialog from './products-dialog.vue'
// import SupplierDialog from './supplier-dialog.vue'
import { insertPurchaseOrder, purPurchaseOrderdetail, orderSchedule } from '@/api/purchasingAndOutsourcingOrders/index'
import { excelExport } from '@/api/basicData/index'
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
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  components: {
    // ProductsDialog,
    // SupplierDialog
    workFlow,
    ExportForm
  },
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
        taxAmount: '' // 税额
      },
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
      formLoading: false,
      // 进度跟踪数据
      scheduleData: [],
      scheduleForm: {
        createByName: '',
        endTime: '',
        endUpdateTime: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        productCode: '',
        productDrawingNo: '',
        productName: '',
        purchaseOrderId: '',
        startTime: '',
        startUpdateTime: ''
      },
      total: 0,
      background: true, //分页器背景颜色
      exportFormVisible: false
    }
  },
  created() { },

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
        this.$refs['elForm'].validateField('cooperativePartnerName')
      } else {
        this.$refs['elForm'].fields[0].resetField()
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
    init(id, type) {
      console.log(id, type)
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
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
            this.dataForm = {
              cooperativePartnerName: res.data.cooperativePartnerName, //供应商名称
              deliveryDate: res.data.deliveryDate, //交货日期.
              orderType: res.data.orderType,
              excludingTaxTotalAmount: res.data.excludingTaxTotalAmount, //订单 不含税总金额
              totalAmount: res.data.totalAmount, //   含税总金额
              taxAmount: res.data.taxAmount,
              orderNo: res.data.orderNo,
              id: res.data.id,
              receivingStatus: res.data.receivingStatus
            }
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList
          })
          getSaleBusDetail(this.dataForm.id).then((res) => {
            console.log(res, '业务详情')
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.form
              this.transferQuery.approvalFormId = this.approvalForm.id
              this.firstOneNode.push({
                name: res.data.form.createByName
              })
              let data = res.data.formNodeTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)

                this.busNodeConfig.childNode = data
                this.workVisible = true
                // this.$nextTick(() => {
                //   this.$refs.workflowRef.initData('busing', this.btnType)
                // })
              }
              if (this.type == 'look') {
                console.log(this.approvalForm, '++++++++++')
                this.transferQuery.documentId = this.dataForm.id
                approvalTransferList(this.transferQuery).then((res) => {
                  console.log(res, '流转记录')
                  this.transferData = res.data.records
                  this.formLoading = false
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
          if (this.type == 'look') {
            // 进度跟踪
            this.initData()
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      this.btnLoading = true
      this.dataFormTwo.data = this.dataFormTwo.data.map((obj) => {
        return { ...obj, procurementDemandPoolId: obj.id, id: null }
      })
      this.dataForm.purchaseOrderLines = this.dataFormTwo.data
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      console.log(this.dataForm, '参数')
      console.log(valid_2, '11111111111111111')

      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (!valid_2) {
            console.log(1)
            this.btnLoading = false
            for (let i = 0; i < this.dataFormTwo.data.length; i++) {
              const item = this.dataFormTwo.data[i]
              if (!item.deliveryDate) {
                this.$message({
                  type: 'error',
                  message: '请选择第' + (i + 1) + '行的交货日期',
                  duration: 1500
                })
                break
              }
            }
            return
          } else {
            this.btnLoading = true
            insertPurchaseOrder(this.dataForm)
              .then((res) => {
                if (res.msg === 'Success') res.msg = '保存成功'
                this.btnLoading = false
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
        this.dataFormTwo.data = this.dataFormTwo.data.filter((item) => {
          return !data.some((element) => element.productsId === item.productsId)
        })
      }
      console.log(data, '传递数据1111')
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
      console.log(this.dataFormTwo.data, '传递数据')
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
    searchDetail() {
      Object.keys(this.scheduleForm).forEach((key) => {
        let item = this.scheduleForm[key]
        this.scheduleForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.scheduleForm.pageNum = 1
      this.initData()
    },
    initData() {
      this.formLoading = true
      this.scheduleForm.purchaseOrderId = this.dataForm.id
      console.log(this.scheduleForm, '参数')
   
    },
    resetDetail() {
      this.$refs['scheduleRef'].$refs.JNPFTable.clearSort()
      this.scheduleForm = {
        createByName: '',
        endTime: '',
        endUpdateTime: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        productCode: '',
        productDrawingNo: '',
        productName: '',
        purchaseOrderId: this.dataForm.id,
        startTime: '',
        startUpdateTime: ''
      }
      this.searchDetail()
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
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
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
  /* padding: 0 20px; */
}

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

::v-deep .el-progress-bar {
  padding-right: 65px !important;
}

::v-deep .el-progress__text {
  margin-left: -7px !important;
}
</style>
