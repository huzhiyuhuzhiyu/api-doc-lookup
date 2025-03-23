<template>
  <transition name="el-zoom-in-center">
    <div style="height:100%">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main org-form">
            <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
              <el-page-header @back="goBack" :content="dialogTitle + `外协订单`" v-if="!!dialogTitle" />
              <div style="font-size:18px" v-else>新建外协订单</div>
              <div class="options" v-if="type != 'look'">
                <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
                  保存草稿
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
                  保存并提交
                </el-button>
                <el-button @click="goBack" v-if="!!dialogTitle">{{ $t('common.cancelButton') }}</el-button>
              </div>
            </div>
            <div class="main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-row :gutter="15" class="">
                        <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                          label-position="top">
                          <!-- <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="type == 'look'
                            ? true
                            : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                              ? false
                              : true
                            "></el-input>
                        </el-form-item>
                      </el-col> -->
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                              <!-- 供应商选择弹窗  -->
                              <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                                v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit"
                                ref="ComSelect-page" @change="supplierdata" :tableItems="PartnerTableItems"
                                :placeholder="'请选择供应商名称'" title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                                :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                                :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" :rowDblclick="false" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="交货日期" prop="deliveryDate">
                              <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                style="width: 100%;" placeholder="请选择交货日期"
                                @change="deliveryDateChange"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="备注" prop="remark" ref="remark">
                              <el-input type="textarea" :row="3" v-model="dataForm.remark" placeholder="请输入备注"
                                maxlength="200" :disabled="type == 'look' ? true : false"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-form>
                      </el-row>
                    </el-collapse-item>

                    <el-collapse-item title="产品信息" name="productInfo">
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
                      <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                        <el-table style="border: 1px solid #e3e7ee;" :fixedNO="true" ref="multipleTable"
                          @selection-change="handeleProductInfoData" v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                          id="table" border height="460">
                          <el-table-column type="selection" width="55" fixed="left" align="center"
                            :key="2"></el-table-column>
                          <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                          <el-table-column prop="projectName" label="所属项目" width="120"
                            v-if="abProjectSwitchVisible"></el-table-column>
                          <el-table-column prop="productName" label="产品名称" width="160" show-overflow-tooltip
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
                                <el-input v-model="scope.row.productDrawingNo" placeholder="品名规格" disabled />
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="deliveryDate" label="交货日期" width="175">
                            <template slot="header">
                              <span class="required">*</span>
                              交货日期
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                                :rules="productRules.deliveryDate">
                                <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                  style="width: 100%;" placeholder="交货日期"></el-date-picker>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
                            :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
                          <el-table-column prop="purchaseQuantity" label="数量" :width="isDeputyUnitSwitch === '1' ? 110 : 100" >
                            <template slot="header">
                              <span class="required">*</span>
                              {{ isDeputyUnitSwitch === '1' ? '数量(主)' : '数量' }}
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                                :rules="productRules.purchaseQuantity">
                                <el-input v-model="scope.row.purchaseQuantity"
                                  @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                                  maxlength="20" :placeholder="isDeputyUnitSwitch === '1' ? '数量(主)' : '数量'"></el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="deputyUnit" label="单位(副)" width="85"
                            v-if="isDeputyUnitSwitch === '1'" />
                          <el-table-column prop="purchaseQuantity2" label="数量(副)" width="85"
                            v-if="isDeputyUnitSwitch === '1'" />
                          <el-table-column prop="price" label="含税单价" width="140">
                            <template slot="header">
                              <span class="required">*</span>
                              单价(含税)
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                                <el-input v-model="scope.row.price" placeholder="单价(含税)" />
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="totalAmount" label="金额" width="120">
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
                          <el-table-column prop="taxRate" label="税率" width="110">
                            <template slot="header">
                              <span class="required">*</span>
                              税率
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :rules="productRules.taxRate">
                                <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;">
                                  <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                    :value="item.taxRate"></el-option>
                                </el-select>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="130">
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                                <div class="viewData">
                                  <span>{{ scope.row.excludingTaxPrice }}</span>
                                </div>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="taxAmount" label="税额" width="100">
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
                          <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140">
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

                          <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                            <template slot-scope="scope">
                              <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                                placeholder="备注">
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
                        </el-table>
                      </el-form>
                      <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                        <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                        <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ computedValue3 }}</span>
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
            <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品"
              treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
              :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple
              :rowDblclick="false" />
            <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
            <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
              :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
              width="500px">
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
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import SourceArea from './source.vue'
import {
  getShipmentList,
  getpurProcurementRequireDetail,
  editpurProcurementRequire,
  purProcurementRequirementsList
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import { insertOutOrder,purPurchaseOrderLineLast } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCooperativeData, getBimBusinessDetail } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    SourceArea,
    Process
  },
  mixins: [AbProjectMixin],
  name: 'orderCreation',
  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      isattachmentswitch: '',
      categoryId: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      dialogTitle: '',
      getCooperativeData,
      getcategoryTree,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTrees, requestObj: { type: 'outsourcing_suppliers' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码' },
        { prop: 'name', label: '供应商名称' },
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
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },

      inquirySheetId: '', //询价单id
      dataForm: {
        remark: '', // 备注
        approvalCompletionDate: '', // 审批完成时间
        // approvalStatus: "",               // 审批状态
        documentStatus: '', // 单据状态
        id: '',
        orderNo: '', //申请单号
        reasonRejection: '', //驳回理由
        submitDate: '', //提交时间
        approvalFlag: false
      },
      sourceVisibled: false,
      type: 'add',
      dataFormArr: [],
      rules: {
        remark: [{ required: true, message: '请输入备注', trigger: ['blur'] }]
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: {
            classAttribute: '',
            type: 'material'
          }
        }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
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
        { prop: 'projectName', label: '所属项目', sortable: 'custom',render:false },
        { prop: 'code', label: '产品编码', sortable: 'custom' },
        { prop: 'name', label: '产品名称', sortable: 'custom',render:false },
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'productCategoryName', label: '产品分类', sortable: 'custom2' },
        { prop: 'mainUnit', label: '单位', width: 60 },
        { prop: 'createTime', label: '创建日期', sortable: 'custom', width: 180 }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },

      ], // 产品选择弹出框搜索条件
      formLoading: false,
      codeConfig: {},
      oldData: [],
      rules: {
        // applicationReason: [{ required: true, message: '请输入备注', trigger: ['blur'] }],
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productRules: {
        productDrawingNo: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        productName: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        purchaseQuantity: [
          // 数量
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
        deliveryDate: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：交货日期${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          { required: true, message: '请选择交货日期', trigger: ['change'] }
        ]
      },

      taxRateList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      tipsvisible: false,
      btnText: '继续新建'
    }
  },
  computed: {
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.excludingTaxTotalAmount
    },
    computedValue3() {
      // 在这里计算第三个输入框的值
      let count = 0
      let count1 = 0

      this.dataFormTwo.data.forEach((item) => {
        count += item.totalAmount * 1
        count1 += item.excludingTaxAmount * 1
      })

      this.dataForm.totalAmount = this.jnpf.numberFormat(count)

      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(count1)

      return this.dataForm.totalAmount
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
          if ((item.price && item.taxRate) || (item.price && item.taxRate === 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          } else {
            item.excludingTaxPrice = ''
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          } else {
            item.excludingTaxAmount = ''
          }
          if (item.price && item.purchaseQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          } else {
            item.taxAmount = ''
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          } else {
            item.totalAmount = ''
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  mounted() { },
  async created() {
    this.getDeputyUnit()
    this.getBimBusinessDetail()
    this.fetchData('WXDH')
    if (this.$route.query.alert) {
      this.dialogTitle = '新建'
    }
    if (this.$route.query.data) {
      const data = JSON.parse(this.$route.query.data)

      if (data) {
        // 解析 JSON 字符串
        data.forEach((item) => {
          item.productSource = item.productSource // 产品来源 采购
          item.classAttribute = item.classAttribute
          item.productsId = item.id // 产品id
          item.productName = item.name // 产品名称
          item.productCode = item.code // 产品编码
          item.productDrawingNo = item.productDrawingNo // 品名规格
          item.ratio = item.ratio // 转换系数
          item.calculationDirection = item.calculationDirection // 计算方向
          item.mainUnit = item.mainUnit // 主单位
          item.purchaseQuantity = item.inventoryQuantity // 数量
          item.price = item.price // 含税单价
          item.totalAmount = item.totalAmount // 金额(含税)
          item.taxRate = Number(item.taxRate) // 税率
          item.excludingTaxPrice = item.excludingTaxPrice // 不含税单价
          item.taxAmount = item.taxAmount // 税额
          item.excludingTaxAmount = item.excludingTaxAmount // 金额(不含税)
          item.deputyUnit = item.deputyUnit // 副单位
          item.planQuantity = '' //计划数量主
          item.planQuantity2 = '' //计划数量副
          item.remark = item.remark
          item.deliveryDate = '' // 交期
        })
        this.dataFormTwo.data = data

        this.getProductClassFun()
      }
    } else {
    }
    this.getBusInfo()
  },
  methods: {
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `outDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    deliveryDateChange(val) {
      this.dataFormTwo.data.forEach((item) => {
        if (!item.deliveryDate) {
          this.$set(item, 'deliveryDate', val) // 总金额(不含税)
        }
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
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
      } catch (error) { }
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')
      this.dataForm = {}
      this.linesList = []
      this.datafilelist = []
      this.tipsvisible = false
      this.btnLoading = false
    },
    goBom() {
      this.dataForm = {}
      this.linesList = []
      this.datafilelist = []
      this.tipsvisible = false
      this.btnLoading = false
      this.$router.push({
        path: '/outsourcingManagement/productOutsourcingOrder/orderList'
      })
    },
    // 产品组件回调
    addth(id, data) {
      this.getProductClassFun()
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productCategoryName:item.productCategoryName,
            projectName: item.projectName, // 所属项目
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
            taxRate: 13, // 税率
            excludingTaxPrice: item.excludingTaxPrice, // 不含税单价
            taxAmount: item.taxAmount, // 税额
            excludingTaxAmount: item.excludingTaxAmount, // 金额(不含税)
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            planQuantity2: '', //计划数量副
            remark: item.remark,
            deliveryDate: this.dataForm.deliveryDate // 交期
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productDrawingNo)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
        }
        selectArr.forEach((item, index) => {
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
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]

        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
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

    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
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
        this.$refs['dataForm'].validateField('cooperativePartnerName')
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

 
    // 产品弹窗
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
      this.$refs['ComSelect-page'].openDialog()
      // this.productVisibled = true
      // this.$nextTick(() => {
      //   this.$refs.productRef.initData2()
      // })
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.productArr.length === 0) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.productArr.length; i++) {
        const row = this.productArr[i]
        const index = this.dataFormTwo.data.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.productArr = [] // 清空选中的行的数据
    },
    // 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
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
          this.dataFormTwo.data[index].outShipmentList = res.data
          // this.dataFormTwo.data[index].outShipmentList.forEach((item) => {
          //   item.demandQuantity = this.dataFormTwo.data[index].purchaseQuantity
          // })
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

    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$router.push({
        path: '/outsourcingManagement/productOutsourcingOrder/orderList'
      })
    },
    init(id, type) {
      // this.fetchData('QGD')
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''

      this.dialogTitle = type == 'add' ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else if (this.dataForm.id && this.type == 'add') {
          this.loading = true
          getpurProcurementRequireDetail(this.dataForm.id).then((res) => {
            this.dataForm = res.data
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

            purProcurementRequirementsList(this.dataForm.id).then((res) => {
              this.dataForm.approvalStatus = ''
              this.dataForm.submitDate = ''
              this.dataForm.approvalCompletionDate = ''
              this.dataForm.id = ''
              this.dataForm.documentStatus = ''
              this.dataFormTwo.data = res.data
              this.dataFormTwo.data.forEach((item) => {
                item.id = ''
              })
            })
            // 审批
            // this.$nextTick(() => { this.getApproverData() })
          })
        } else {
          this.loading = true
          getpurProcurementRequireDetail(this.dataForm.id).then((res) => {
            this.dataForm = res.data
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
            purProcurementRequirementsList(this.dataForm.id).then((res) => {
              this.dataFormTwo.data = res.data
            })
          })
        }
      })
    },
    // 表单提交
    handleConfirm(type) {
      let submitFlag = true
      this.dataFormTwo.data.map((ele, i) => {
        console.log(ele, 'ppp')
        return
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
      if (submitFlag) {
        this.request(type)
      }
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      this.dataForm.documentStatus = type
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
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)
      if (this.type == 'add') {
        _data = {
          ...this.dataForm,
          attachmentList: this.datafilelist,
          purProcurementRequirements: this.dataForm,
          purchaseOrderLines: this.dataFormTwo.data,
          flowData: this.flowData,
          orderType: 'external'
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        // this.dataFormTwo.data.forEach((item, index) => {
        //   this.dataFormTwo.data[index].inquirySheetId = this.dataForm.id
        // })
        _data = {
          ...this.dataForm,
          attachmentList: this.datafilelist,
          purProcurementRequirements: this.dataForm,
          purchaseOrderLines: this.dataFormTwo.data,
          orderType: 'external'
        }
      }

      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (hasCostPrice) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]

                  if (!item.deliveryDate) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的交货日期',
                      duration: 1500
                    })
                    this.btnLoading = false
                    break
                  }
                  if (!item.purchaseQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的数量',
                      duration: 1500
                    })

                    this.btnLoading = false
                    break
                  }
                  if (!item.price) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的含税单价',
                      duration: 1500
                    })

                    this.btnLoading = false
                    break
                  }
                  if (!item.taxRate) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的税率',
                      duration: 1500
                    })

                    this.btnLoading = false
                    break
                  }
                  if (item.outShipmentList.length == 0) {
                    this.$message({
                      type: 'error',
                      message: '第' + (i + 1) + '行没有发料清单',
                      duration: 1500
                    })
                    this.btnLoading = false
                    break
                  }
                }

                return
              } else {
                this.btnLoading = true
                console.log(_data, '_data')
                if (this.type === 'add') {
                  insertOutOrder(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '新建成功'
                      if (this.dataForm.documentStatus == 'draft') {
                        this.submitmethodsTitle = '保存成功'
                      } else if (this.dataForm.documentStatus == 'submit') {
                        this.submitmethodsTitle = '提交成功'
                      }
                      this.tipsvisible = true
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editpurProcurementRequire(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '修改成功'
                      this.$message({
                        message: msg,
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
              }
            }
          } else {
            this.btnLoading = false
          }
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
    }
  },
  updated() {
    this.$refs['multipleTable'].doLayout()
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
  padding: 0 10px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
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

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  /* padding: 0 20px; */
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

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
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
</style>
