<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="生成外协订单" />
          <div class="options">
            <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
              保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main" ref="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo" ref="orderInfos">
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="12">
                    <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <!-- 供应商选择弹窗  -->
                      <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                        v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                        @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商"
                        treeTitle="供应商分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                        :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                        :searchList="PartnerTableSearchList" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择交货日期"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :row="3" v-model="dataForm.remark" placeholder="请输入备注" maxlength="200"
                        :disabled="type == 'look' ? true : false"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <el-collapse v-model="activeNames">
                <el-collapse-item title="产品信息" name="basicInfo" class="orderInfo">
                  <div :style="{ height: customStyleData + 'px' }">
                    <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">
                        选择产品
                      </el-button>
                      |
                      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">
                        批量删除
                      </el-button>
                      |
                      <JNPF-table style="border: 1px solid #e3e7ee;" :fixedNO="true" hasC
                        @selection-change="handeleProductInfoData" v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                        id="table" border customKey="JNPFTableKey_101214">
                        <el-table-column prop="projectName" label="所属项目" width="120"
                          v-if="abProjectSwitchVisible"></el-table-column>
                        <el-table-column prop="productName" label="产品名称" width="120"
                          v-if="$store.getters.configData.product.enable_productName"></el-table-column>
                        <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                          <template slot="header">
                            <span class="required">*</span>
                            品名规格
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                              :rules="productRules.productDrawingNo">
                              <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格" disabled />
                            </el-form-item>
                          </template>
                        </el-table-column>

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

                        <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
                          :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
                        <el-table-column prop="purchaseQuantity" label="数量" min-width="100">
                          <template slot="header">
                            <span class="required">*</span>
                            {{ isDeputyUnitSwitch === '1' ? '数量(主)' : '数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                              :rules="productRules.purchaseQuantity">
                              <el-input @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                                v-model="scope.row.purchaseQuantity" maxlength="20" placeholder="请输入主数量"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
                        <el-table-column prop="purchaseQuantity2" label="数量(副)" width="85"
                          v-if="isDeputyUnitSwitch === '1'" />
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
                            税率
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules="productRules.taxRate">

                              <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;">
                                <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                  :value="item.enCode"></el-option>
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
                              <div class="viewData">
                                <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="processId" label="工序" width="120" :key="102">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.processId" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
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

                        <el-table-column label="操作" width="170" fixed="right">
                          <template slot-scope="scope">
                            <el-button size="mini" type="text" :disabled="sourceDisabled"
                              @click="handlerOpenSource(scope.$index, 'source')">
                              查看发料清单
                            </el-button>
                            <el-button size="mini" type="text" class="JNPF-table-delBtn"
                              :disabled="dataFormTwo.data.length < 2"
                              @click="delequipment_process_relList(scope.$index)">
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>
                    </el-form>
                  </div>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">总金额：{{ computedValue }}</span>
                    <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
    <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <div>
        <img src="@/assets/images/importSuccess.gif" alt="" style="width:100px" />
        <span class="import_t">{{ submitmethodsTitle }}啦！</span>
        <span class="import_b">您还可以进行如下操作：</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="goBom">返回列表</el-button>
        <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()">{{ btnText }}</el-button>
        <el-button v-else type="primary" @click="continueAdd()">{{ btnText }}</el-button>
      </span>
    </el-dialog>
    <ComSelect-page ref="comSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems"
      dialogTitle="选择产品" :listMethod="purProcurementDemandPoolList" :listRequestObj="ProductListRequestObj"
      :listDataFormatting="listDataFormatting" :searchList="ProductTableSearchList" :elementShow="false"
      :multiple="true" :renderTree="false"  />
  </div>
</template>
<script>
import SourceArea from '@/views/outsourcingManagement/productOutsourcingOrder/orderCreation/source.vue'
import { insertOutOrder, partnerProductPrice, priceList,purPurchaseOrderLineLast } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCooperativeData, getcategoryTree, getBimBusinessDetail } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getShipmentList, purProcurementDemandPoolList } from '@/api/purchasingManagement/purchaseInquirySheet'
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import {
  getOrderDetail,
  addOrders,
  editOrders,
  getcategoryTrees,
  getAttributeline,
  getcooperativeProduct,
  getCopyOrders,
  getWorkOrderNo,
  uploadProduct
} from '@/api/salesManagement/assemblyOrders'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getBimProcessList } from '@/api/bimProcess/index'
import { getBusinessFlowInfo } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";

export default {
  components: {
    SourceArea,
    Process
  },
  mixins: [AbProjectMixin],

  data() {
    return {
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      isattachmentswitch: '',
      categoryId: '',
      sourceVisibled: false,
      purProcurementDemandPoolList,
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      // 选择客户产品参数
      ProductListRequestObj: {
        demandStatus: 'not_finish', //需求状态 需求状态 未完成 not_finish、完成中 finishing、已完成 finished,可用值:finished,finishing,not_finish
        poolType: 'external', //采购池类型  采购 procure、外协 external,可用值:external,procure
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      ProductTableItems: [
        { prop: 'projectName', label: '所属项目', sortable: 'custom',render:false },
        { prop: 'productCode', label: '产品编码', sortable: 'custom' },
        { prop: 'productName', label: '产品名称', sortable: 'custom',render:false },
        { prop: 'productDrawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'immediatelyBuyFlag', label: '立即外协', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位', width: 60 },
        { prop: 'planDemandQuantity', label: '计划需求数', sortable: 'custom', minWidth: 130 },
        { prop: 'orderedQuantity', label: '已下单数量', sortable: 'custom', minWidth: 130 },
        { prop: 'deliveryDate', label: '交货日期', sortable: 'custom' },
        { prop: 'createTime', label: '创建日期', sortable: 'custom', minWidth: 180 }
      ],
      // 客户产品查询条件
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
        { prop: 'deliveryDate', label: '交货日期', type: 'date' }
      ],
      getcooperativeProduct,
      productVisible: false,
      sourceFormVisible: false,
      activeName: 'jcInfo',
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      getCooperativeData,
      getcategoryTree,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'outsourcing_suppliers' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码', fixed: 'left' },
        { prop: 'name', label: '供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'outsourcing_suppliers'
      },
      dataForm: {
        attachmentList: [],
        cooperativePartnerName: '', //供应商名称
        deliveryDate: '', //交货日期.
        orderType: 'external',
        purchaseOrderLines: [],
        excludingTaxTotalAmount: '', //订单 不含税总金额
        totalAmount: '', //   含税总金额
        taxAmount: '', // 税额
        approvalFlag: false
      },
      dataPickerOptions2: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate2
      },
      dataPickerOptions: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate
      },
      type: '',
      dataFormArr: [],
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
                  this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`)
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
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',
      demandDelivery2: '',
      olddeliveryDateArr: [], // 表格中旧的数据值
      oldData: [],
      formLoading: false,
      customStyleData: 0,
      selectRows: [],

      list0: [],
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      taxRateList: [],
      flowTemplateJson: {},
      flowData: {}
    }
  },
  async created() {
    await this.getDeputyUnit()
    this.switchStyleheight()
    this.tableDataFlag = true


  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      // 在这里计算第三个输入框的值
      let excludingCount = 0
      let count = 0
      let taxAmountCount = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.totalAmount * 1
        excludingCount += item.excludingTaxAmount * 1
        taxAmountCount += item.taxAmount * 1
      })
      this.dataForm.totalAmount = this.jnpf.numberFormat(count)
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(excludingCount)
      this.dataForm.taxAmount = this.jnpf.numberFormat(taxAmountCount)
      return this.dataForm.excludingTaxTotalAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.purchaseQuantity * 1
      })
      this.dataForm.purchaseQuantity = this.jnpf.numberFormat(count)

      return this.dataForm.purchaseQuantity
    }
  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if (item.price && item.purchaseQuantity) {
            item.totalAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity,2)
          } else {
            item.totalAmount = ''
          }
          if ((item.price && item.taxRate) || (item.price && item.taxRate === 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100),6)
          } else {
            item.excludingTaxPrice = ''
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice,2)
          } else {
            item.excludingTaxAmount = ''
          }
          if (item.price && item.purchaseQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          } else {
            item.taxAmount = ''
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  methods: {

    switchStyleheight() {
      console.log(123)
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 500
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `outDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_wxdd'
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    // 配置资源
    handlerOpenSource(index, type) {
      if (!this.dataFormTwo.data[index].purchaseQuantity) return this.$message.error('请先输入数量')

      this.sourceVisibled = true
      this.index = index

      let obj = {
        productsId: this.dataFormTwo.data[index].productsId,
        purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
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

        // if (this.sourceData.length === 0) {
        //   this.sourceDisabled = true
        // } else {
        //   this.sourceDisabled = false
        // }

        this.$nextTick(() => {
          this.$refs['sourceRef'].init(this.sourceData, '')
        })
      })
    },
    listDataFormatting(res) {
      console.log(res)
      res.data.records.forEach((item, index) => {
        if (item.immediatelyBuyFlag) {
          item.immediatelyBuyFlag = '是'
        } else {
          item.immediatelyBuyFlag = '否'
        }
      })
      return res.data.records
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj8 = {
        pageNum: -1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getBimProcessList(obj8).then((res) => {
        console.log(res, 'oiii')
        this.list8 = res.data.records
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
      })
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      this.ProductTableSearchList = [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
      ]
      if (this.$store.getters.configData.product.enable_productName) {
        this.ProductTableItems.forEach(tc=>{
          if (tc.prop === 'name') {
            tc.render = true
          }
        })
        let index = this.ProductTableSearchList.findIndex((obj) => obj.prop === 'productCode')
        this.ProductTableSearchList.splice(index+1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
      }
      if (this.abProjectSwitchVisible) {
        this.ProductTableItems.forEach(tc=>{
          if (tc.prop === 'projectName') {
            tc.render = true
          }
        })
        this.ProductTableSearchList.unshift({ prop: 'projectId', label: '所属项目', type: 'select',options:this.abProjectNoCommonList })
        this.ProductListRequestObj.projectId = this.abIsCommonUser ? '' : this.abProjectId
      }
      this.$refs['comSelect-page'].openDialog()
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct(val, data, paramsObj) {
      this.productVisible = false
      data = data.filter((obj1) => !this.dataFormTwo.data.some((obj2) => obj2.id === obj1.id))
      data.forEach((i) => {
        const item = i.all

        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.price) / (1 + Number(item.taxRate) / 100), 6)
        } else {
          item.excludingTaxPrice = item.price
        }
        if (this.btnType == 'edit') {
          item.id = ''
        }
        if (this.dataForm.cooperativePartnerId) {
            let priceObj = {
              orderType:'external',
              productCode: item.productCode,
              cooperativePartnerId: this.dataForm.cooperativePartnerId
            }
            purPurchaseOrderLineLast(priceObj).then((res) => {
              this.$set(item, 'price',res.data ? res.data.price :'')
              this.$set(item, 'taxRate',res.data? Number(res.data.taxRate) :'')
            })
        }
        this.dataFormTwo.data.push(item)
      })
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i]
        const index = this.dataFormTwo.data.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.selectRows = [] // 清空选中的行的数据
    },
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 明细中 禁用后续日期
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 主表上的日期
    disabledDate2(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery2)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },

    // 打开选择供应商弹窗
    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('切换供应商将清空产品价格信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '更换成功!'
            })
            this.$refs['productForm'].resetFields()
            return true
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            return false
          })
      }
      return flag
    },
    supplierdata(id, data) {
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        let productIdList = []
        this.dataFormTwo.data.forEach((item) => {
          productIdList.push(item.productsId)
          if (this.dataForm.cooperativePartnerId) {
            let priceObj = {
              orderType:'external',
              productCode: item.productCode,
              cooperativePartnerId: this.dataForm.cooperativePartnerId
            }
            purPurchaseOrderLineLast(priceObj).then((res) => {
              this.$set(item, 'price',res.data ? res.data.price :'')
              this.$set(item, 'taxRate',res.data? Number(res.data.taxRate) :'')
            })
          }
        })
        let _data = {
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          productIdList
        }
        partnerProductPrice(_data).then((res) => {
          if (res.data.length === 0) {
            this.dataFormTwo.data.forEach((item) => {
              item.price = ''
              item.fixedPrice = ''
            })
          } else {
            res.data.forEach((item) => {
              const targetList = this.dataFormTwo.data.filter((line) => line.productsId === item.productId)
              targetList.forEach((line) => {
                this.$set(line, 'fixedPrice', item.price)
                this.$set(line, 'price', item.price)
                this.$set(line, 'excludingTaxPrice', item.excludingTaxPrice)
                this.$set(line, 'taxRate', item.taxRate)
              })
            })
            const targetList = this.dataFormTwo.data.filter((line) => line.price == '')
            targetList.forEach((line) => {
              this.$set(line, 'price', '')
            })
            // 重置子表校验状态
            this.$refs.productForm.clearValidate()
          }
        })

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
      if (this.dataFormTwo.data[index].purchaseQuantity) {
        let obj = {
          productsId: this.dataFormTwo.data[index].productsId,
          purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
        }
        // 通过需求池id 获取明细的数据
        getShipmentList(obj).then((res) => {
          console.log(res, 'p')
          this.dataFormTwo.data[index].outShipmentList = res.data
          this.dataFormTwo.data[index].outShipmentList.forEach(item => {
            item.demandQuantity = this.dataFormTwo.data[index].purchaseQuantity
          })
          console.log(this.dataFormTwo.data[index].outShipmentList, 'o')
        })
      }


      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity * this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity / this.dataFormTwo.data[index].ratio
        )
      }
    },

    goBack() {
      this.$emit('close')
    },
    init(data) {
      console.log(data, 'data')
      this.getProductClassFun()
      this.getBimBusinessDetail()
      this.$set(this.dataFormTwo, 'data', JSON.parse(JSON.stringify(data)))
      console.log(this.dataFormTwo, 'two')

      var maxDate = null // 最大日期初始值设为null

      this.dataFormTwo.data.forEach((ele, i) => {

        var currentDate = new Date(this.dataFormTwo.data[i].deliveryDate)
        if (maxDate === null || currentDate > maxDate) {
          maxDate = currentDate
        }
        let obj = {
          productsId: this.dataFormTwo.data[i].productsId,
          purchaseQuantity: this.dataFormTwo.data[i].purchaseQuantity
        }
        // 通过需求池id 获取明细的数据

        getShipmentList(obj).then((res) => {
          this.$set(this.dataFormTwo.data[i], 'outShipmentList', res.data)
          this.dataFormTwo.data[i].outShipmentList.forEach(item => {
            item.demandQuantity = this.dataFormTwo.data[i].purchaseQuantity
          })
          console.log(this.dataFormTwo.data[i].outShipmentList, 'o')

        })

        console.log(this.dataFormTwo.data[i], 'ppppp')
        this.$set(this.dataFormTwo.data[i], 'excludingTaxAmount', '') // 总金额(不含税)
        // this.$set(this.dataFormTwo.data[i], 'excludingTaxPrice', '')    // 	不含税单价
        this.$set(this.dataFormTwo.data[i], 'fixedPrice', '') //  	定价
        this.$set(this.dataFormTwo.data[i], 'price', '') //  	含税单价
        this.$set(this.dataFormTwo.data[i], 'taxAmount', '') // 税额
        this.$set(this.dataFormTwo.data[i], 'taxRate', '13') // taxRate
        this.$set(this.dataFormTwo.data[i], 'totalAmount', '') // 	价税合计
        this.$set(
          this.dataFormTwo.data[i],
          'orderQuantity',
          this.dataFormTwo.data[i].planDemandQuantity -
          (this.dataFormTwo.data[i].orderedQuantity ? this.dataFormTwo.data[i].orderedQuantity : 0)
        ) // 	可下单数量
        this.olddeliveryDateArr.push(this.dataFormTwo.data[i].deliveryDate)
        console.log(this.dataFormTwo.data, 'this.dataFormTwo.data')
      })
      this.getBusInfo()
    },

    // 表单提交
    async handleSubmit(type) {
      this.btnLoading = true
      let submitFlag = true
      this.dataFormTwo.data.map((ele, i) => {
        console.log(ele, 'ppp')
        if (!ele.purchaseQuantity) {
          submitFlag = false
          this.$message.error(`产品信息第${i + 1}行：数量不能为空`)
        } else {
          if (ele.outShipmentList.length == 0) {
            submitFlag = false
            return this.$message.error(`产品信息第${i + 1}行：发料清单为空`)
          }
        }
      })
      this.dataForm.documentStatus = type
      let form_1 = this.$refs['elForm']
      let valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_wxdd',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.btnLoading = true
        let dataTwo = []
        dataTwo = this.dataFormTwo.data.map((obj) => {
          return { ...obj, procurementDemandPoolId: obj.id, productsId: obj.productsId, id: null }
        })
        this.dataForm.attachmentList = this.datafilelist
        this.dataForm.purchaseOrderLines = dataTwo
        let _data = {
          ...this.dataForm,
          flowData: this.flowData
        }
        console.log(_data, '_')
        insertOutOrder(_data)
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
      } else {
        this.btnLoading = false
      }
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b010')
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
 
  },
  mounted() { 
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.table) return
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
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
  /* padding: 10px; */
  height: 100%;
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

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  /* overflow: auto !important; */
  /* padding: 0 20px; */
}

::v-deep .workNode {
  /* min-height: 1045px !important; */
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

::v-deep .el-form {
  height: 100% !important;
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

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
