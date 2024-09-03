<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="title" />
          <!-- <el-page-header @back="goBack" :content="type === 'look' ? '查看外协订单' : '新建外协订单'" /> -->
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
                        <el-form-item label="外协单号" prop="orderNo" ref="orderNo">
                          <el-input :disabled="type == 'look'" type="text" v-model="dataForm.orderNo"
                            placeholder="外协单号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input :disabled="type == 'look'" v-model="dataForm.cooperativePartnerName"
                            placeholder="请选择供应商名称" @focus="openDialog"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker :disabled="type == 'look'" v-model="dataForm.deliveryDate" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="dataPickerOptions2"
                            placeholder="请选择交货日期"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" v-if="type === 'look'">
                        <el-form-item label="订单状态" prop="receivingStatus" ref="receivingStatus">
                          <el-input type="text" v-model="dataForm.receivingStatus === 'receiving' ? '未完成' : '已完成'"
                            placeholder="订单状态" :disabled="type == 'look'"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <div v-if="type !== 'look'">
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                        @click="openSeleceProductDialog()">
                        选择产品
                      </el-button>
                      |
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                        批量删除
                      </el-button>
                      |
                    </div>
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                      <el-table-column type="selection" width="55" fixed="left" :key="2"></el-table-column>
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'">
                              <div class="viewData">
                                <span>{{ scope.row.productDrawingNo }}</span>
                              </div>
                            </el-form-item>
                          </template> -->
                        <template slot="header">
                          <span class="required">*</span>
                          品名规格
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                            :rules="productRules.productDrawingNo">
                            <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot="header">
                          <span class="required">*</span>
                          产品名称
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'"
                            :rules="productRules.productName">
                            <el-input v-model="scope.row.productName" placeholder="请输入产品名称" />
                          </el-form-item>
                        </template>
                      </el-table-column> -->

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="200">
                        <template slot="header">
                          <span class="required">*</span>
                          交货日期
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                            :rules="productRules.deliveryDate">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择交货日期"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" min-width="60" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="purchaseQuantity" label="数量" min-width="100">
                        <template slot="header">
                          <span class="required">*</span>
                          数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                            :rules="productRules.purchaseQuantity">
                            <el-input v-model="scope.row.purchaseQuantity"
                              @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)" maxlength="20"
                              placeholder="请输入主数量"></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" label="含税单价" min-width="180">
                        <template slot="header">
                          <span class="required">*</span>
                          含税单价
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                            <el-input v-model="scope.row.price" placeholder="请输入含税单价" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="totalAmount" label="金额" min-width="140">
                        <template slot="header">
                          <span class="required">*</span>
                          金额(含税)
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxRate" label="税率(%)" min-width="140">
                        <template slot="header">
                          <span class="required">*</span>
                          税率(%)
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :rules="productRules.taxRate">
                            <!-- <el-input oninput="value = value.replace(/\D/g,'')" maxlength="2"
                                v-model="scope.row.taxRate" placeholder="请输入税率"></el-input> -->
                            <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;">
                              <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                :value="item.taxRate"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="150">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160">
                      <template slot="header">
                        <span class="required">*</span>总金额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxAmount }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column> -->

                      <el-table-column prop="taxAmount" label="税额" min-width="100">
                        <template slot="header">
                          <span class="required">*</span>
                          税额
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <!-- <el-input v-model="scope.row.taxAmount" maxlength="20" placeholder="请输入税额">
                          </el-input> -->
                            <div class="viewData">
                              <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="excludingTaxAmount" label="金额(不含税)" min-width="180">
                        <template slot="header">
                          <span class="required">*</span>
                          金额(不含税)
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                            <!-- <el-input v-model="scope.row.excludingTaxAmount" maxlength="20"
                                placeholder="请输入金额(不含税)"></el-input> -->
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                            placeholder="请输入备注">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column label="操作" width="180" fixed="right" v-if="dataFormTwo.data.length > 1">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column> -->

                      <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" :disabled="sourceDisabled"
                            @click="handlerOpenSource(scope.$index, 'source')">
                            查看发料清单
                          </el-button>
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                            v-if="dataFormTwo.data.length > 1" @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
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
                <!-- <el-collapse-item title="发料清单信息" name="materialInfo">
                  <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                    id="table">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="160"></el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" min-width="140"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="140"></el-table-column>
                    <el-table-column prop="purchaseQuantity" label="基本数量" min-width="140"></el-table-column>
                    <el-table-column prop="demandQuantity" label="发料数量" min-width="140"></el-table-column>
                    <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="140"></el-table-column>
                  </el-table>
                </el-collapse-item> -->
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
        <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品"
          treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
        <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
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
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import {
  getShipmentList

} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import TableFormProduct from '@/components/no_mount/TableForm-product/index' // 产品选择组件
import SourceArea from '../orderCreation/source.vue'
export default {
  components: {
    // ProductsDialog,
    // SupplierDialog
    TableFormProduct,
    workFlow,
    ExportForm,
    SourceArea
  },
  data() {
    return {
      title: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo', 'materialInfo'],
      sourceVisibled: false,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: '产品分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '' } }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
        classAttributeList: ['raw_material', 'semi_finished', 'finish_product', 'accessories'],
        productCategoryId: '',
        code: '',
        name: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        productStatus: 'enable',
        productSource: 'out',
        pageNum: 1,
        pageSize: 20
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        // { prop: 'name', label: '产品名称', sortable: 'custom' },
        { prop: 'code', label: '产品编码', sortable: 'custom' },
        { prop: 'classAttributeText', label: '产品分类', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'createTime', label: '创建日期', sortable: 'custom' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        // { prop: 'name', label: '产品名称', type: 'input' },
        { prop: 'code', label: '产品编码', type: 'input' }
      ], // 产品选择弹出框搜索条件
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
      exportFormVisible: false,
      linesList: [],
      rules: {
        // applicationReason: [{ required: true, message: '请输入申请理由', trigger: ['blur'] }],
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productRules: {
        productDrawingNo: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        productName: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        purchaseQuantity: [
          // 主数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        purchaseQuantity2: [
          // 副数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        taxRate: [
          // 税率
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：税率${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('noZero', '', (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：税率${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        price: [
          // 含税单价
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：含税单价${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                6,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                }
              ]
            }),
            trigger: 'blur'
          },
          // {
          //   validator: this.formValidate({
          //     type: 'calc',
          //     params: [
          //       (rowIndex, value) =>
          //         Number(this.dataFormTwo.data[rowIndex].price) <= Number(this.dataFormTwo.data[rowIndex].fixedPrice),
          //       '不能超过对应定价',
          //       (errMsg, index) => {
          //         this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
          //       }
          //     ]
          //   }),
          //   trigger: 'blur'
          // },
          { required: true, trigger: ['blur'] }
        ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },

      taxRateList: []
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  created() { },

  methods: {
    getProductClassFun() {
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log(this.taxRateList, 'loisi')
      })
    },
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 对比日期方法
    changeDate(d1, d2) {
      return new Date(d1.replace((/-/g, '\/'))) > new Date(d2.replace(/-/g, '\/'))
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },
    // 产品弹窗
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
      // this.productVisibled = true
      // this.$nextTick(() => {
      //   this.$refs.productRef.initData2()
      // })
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
        console.log('dataForm', this.dataForm)
      } catch (error) { }
    },
    // 配置资源
    handlerOpenSource(index, type) {
      console.log(this.dataFormTwo.data[index].purchaseQuantity, 'this.dataFormTwo.data[index].id')
      if (!this.dataFormTwo.data[index].purchaseQuantity) return this.$message.error('请先输入数量')
      console.log(index, 'index')
      this.sourceVisibled = true
      this.index = index
      console.log(this.dataFormTwo.data[index], 'this.dataFormTwo.data[index].id')
      let obj = {
        productsId: this.dataFormTwo.data[index].productsId,
        purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
        console.log(res, '清单数据')
        this.sourceData = res.data
        if (this.dataFormTwo.data[this.index].outShipmentList) {
          this.dataFormTwo.data[this.index].outShipmentList.forEach((item, ind) => {
            this.sourceData[ind].demandQuantity1 = item.demandQuantity1
            // this.sourceData[ind].demandQuantity1 = item.demandQuantity-item.issuedQuantity-item.undeliveredQuantity
          })
        } else {
          this.sourceData.forEach((item, index) => {
            this.$set(
              this.sourceData[index],
              'demandQuantity1',
              item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity < 0
                ? 0
                : item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity
            )
          })
        }
        console.log(this.sourceData, '1111')

        if (this.sourceData.length === 0) {
          this.sourceDisabled = true
        } else {
          this.sourceDisabled = false
        }
        console.log(this.dataFormTwo.data, 'daaaa')
        this.$nextTick(() => {
          this.$refs['sourceRef'].init(this.sourceData, '')
        })
      })
    },
    // 产品组件回调
    addth(id, data) {
      console.log(data)
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productSource: item.productSource, // 产品来源 采购
            classAttribute: item.classAttribute,
            productsId: item.id, // 产品id
            productName: item.name, // 产品名称
            productCode: item.code, // 产品编码
            productDrawingNo: item.drawingNo, // 品名规格
            ratio: item.ratio, // 转换系数
            calculationDirection: item.calculationDirection, // 计算方向
            mainUnit: item.mainUnit, // 主单位
            purchaseQuantity: item.purchaseQuantity, // 数量
            price: item.price, // 含税单价
            totalAmount: item.totalAmount, // 金额(含税)
            taxRate: item.taxRate, // 税率
            excludingTaxPrice: item.excludingTaxPrice, // 不含税单价
            taxAmount: item.taxAmount, // 税额
            excludingTaxAmount: item.excludingTaxAmount, // 金额(不含税)
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            planQuantity2: '', //计划数量副
            remark: item.remark,
            deliveryDate: '' // 交期
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productName)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
          console.log(data, '删除后的数据')
          console.log(deletedArray, '被删掉的数据')
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },
    supplierdata(data) {
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

      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    //下单数量输入事件
    changePurchaseQuantity(index, val) {
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)
    },

    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(data, type) {
      console.log(data, 'dddddddddd')
      this.dataForm.cooperativePartnerName = data[0].
      data.forEach((item) => {
        console.log(item, 'it')
        // item.ordersNum = item.num
        item.productDrawingNo = item.productDrawingNo
        item.purchaseQuantity = Number(item.inventoryQuantity)
        // item.saleOrderNo = item.orderNo
      })
      this.dataFormTwo.data = data
      // 此处判断用户选择新增还是编辑
      this.title = '新建外协订单'
      // this.type = type
      // if (id) {
      //   if (this.type == 'edit') {
      //     this.title = '编辑外协订单'
      //   } else if (this.type == 'look') {
      //     this.title = '查看外协订单'
      //   }
      // } else {
      //   this.title = '新建外协订单'
      // }
      // this.$nextTick(() => {
      //   this.$refs['elForm'].resetFields()
      //   if (!this.dataForm.id) {
      //     this.clearData()
      //   } else {
      //     this.loading = true
      //     purPurchaseOrderdetail(this.dataForm.id).then((res) => {
      //       if (res.data.attachmentList) {
      //         res.data.attachmentList.forEach((item) => {
      //           this.datafilelist.push({
      //             name: item.document.fullName,
      //             fileSize: item.document.fileSize,
      //             filename: item.document.filePath,
      //             id: item.document.id,
      //             url: item.url
      //           })
      //         })
      //       }
      //       this.dataForm = {
      //         cooperativePartnerName: res.data.cooperativePartnerName, //供应商名称
      //         deliveryDate: res.data.deliveryDate, //交货日期.
      //         orderType: res.data.orderType,
      //         excludingTaxTotalAmount: res.data.excludingTaxTotalAmount, //订单 不含税总金额
      //         totalAmount: res.data.totalAmount, //   含税总金额
      //         taxAmount: res.data.taxAmount,
      //         orderNo: res.data.orderNo,
      //         id: res.data.id,
      //         receivingStatus: res.data.receivingStatus
      //       }
      //       this.dataFormTwo.data = res.data.purchaseOrderLineVOList
      //       this.linesList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
      //     })
      //     getSaleBusDetail(this.dataForm.id).then((res) => {
      //       console.log(res, 'res')
      //       if (res.data) {
      //         this.firstOneNode = []
      //         this.approvalForm = res.data.form
      //         this.transferQuery.approvalFormId = this.approvalForm.id
      //         this.firstOneNode.push({
      //           name: res.data.form.createByName
      //         })
      //         let data = res.data.formNodeTree.childNode
      //         if (data) {
      //           this.addNodeTypeAndNodeName(data)

      //           this.busNodeConfig.childNode = data
      //           this.workVisible = true
      //           // this.$nextTick(() => {
      //           //   this.$refs.workflowRef.initData('busing', this.btnType)
      //           // })
      //         }
      //         if (this.type == 'look') {
      //           this.transferQuery.documentId = this.dataForm.id
      //           approvalTransferList(this.transferQuery).then((res) => {
      //             this.transferData = res.data.records
      //             this.formLoading = false
      //           })
      //         }
      //       } else {
      //         this.busNodeConfig.childNode = null
      //       }
      //     })
      //     if (this.type == 'look') {
      //       // 进度跟踪
      //       this.initData()
      //     }
      //   }
      // })
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

      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (!valid_2) {
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

      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
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
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.scheduleForm,
          exportType: '1104',
          exportName: '外协订单进度跟踪',
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
