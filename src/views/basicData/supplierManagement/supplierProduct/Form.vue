<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="'新建供应商产品'" />
          <div class="options" v-if="type != 'look'">
            <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
              保存草稿
            </el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName" v-if="!approvalFlag">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="8">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <ComSelect-page clearable :treeNodeClick="treeNodeClick" :isdisabled="type === 'look'"
                            :value="dataForm.cooperativePartnerName" ref="ComSelect-page" @change="supplierdata"
                            :tableItems="PartnerTableItems" :placeholder="'请选择供应商'" title="选择供应商" treeTitle="供应商分类"
                            :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                            :listRequestObj="PartnerListRequestObj" :paramsObj="{}"
                            :searchList="PartnerTableSearchList" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="有效起始时间" prop="dateOrderStart">
                          <el-date-picker v-model="dataForm.dateOrderStart" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择有效起始时间"
                            :disabled="type == 'look' ? true : false"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="有效结束时间" prop="dateOrderStop">
                          <el-date-picker v-model="dataForm.dateOrderStop" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择有效结束时间"
                            :disabled="type == 'look' ? true : false"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="备注">
                          <el-input v-model="dataForm.remark" type="textarea" placeholder="备注"
                            :disabled="type === 'look'"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="type !== 'look'" style="margin-left: -12px;">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProductDialog()">
                      选择产品
                    </el-button>
                    |
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                      删除产品
                    </el-button>
                  </div>

                  <el-form :model="dataFormTwo" ref="productForm" style="margin: 0 -12px;">
                    <JNPF-table style="border: 1px solid #e3e7ee;" @selection-change="handeleProductInfoData"
                      :hasC="type != 'look'" hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                      id="table">
                      <el-table-column prop="drawingNo" key="drawingNo" label="品名规格" min-width="180">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'"
                            :rules="productRules.drawingNo">
                            <el-input v-model="scope.row.drawingNo" :disabled="type === 'look'" maxlength="20"
                              :placeholder="type == 'look' ? '' : '品名规格'">
                              {{ scope.row.drawingNo }}
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" key="price" label="协议价" min-width="160">
                        <template slot="header">
                          协议价(含税)
                          <span class="required">*</span>
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                            <el-input v-model="scope.row.price" :disabled="type === 'look'" maxlength="20"
                              placeholder="协议价(含税)">
                              {{ scope.row.price }}
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" key="taxRate" label="税率" width="100">
                        <template slot="header">
                          <span class="required">*</span>
                          税率
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules="productRules.taxRate">
                            <el-select v-model="scope.row.taxRate" placeholder="税率" style="width: 100%;"
                              :disabled="type === 'look' ? true : false">
                              <el-option v-for="item in taxRateList" size="small" :key="item.enCode"
                                :label="item.fullName" :value="item.enCode"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="excludingTaxPrice" key="excludingTaxPrice" label="协议价(不含税)" width="150"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="standardValue" label="规值" width="120" :key="211"
                        v-if="this.dataForm.classAttribute !== 'finish_product'">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.standardValue" placeholder="请选择"
                            :disabled="type == 'look' ? true : false" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list0" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="colour" label="颜色" width="120" :key="212"
                        v-if="this.dataForm.classAttribute !== 'finish_product'">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.colour" placeholder="请选择"
                            :disabled="type == 'look' ? true : false" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                            :disabled="type == 'look' ? true : false" placeholder="请输入备注">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" width="180" fixed="right" v-if="type != 'look'" key="look">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple :renderTree="false"
      :listDataFormatting="listDataFormatting" />
  </div>
</template>
<script>
import {
  getCooperativeData,
  getcategoryTree,
  getBimBusinessDetail,
  addPartnerOrProductData
} from '@/api/basicData/index' //供应商数据

import formValidate from '@/utils/formValidate'
import {
  getbuyFixedPointPricingDetail,
  addbuyFixedPointPricing,
  editbuyFixedPointPricing,
  buyFixedPointPricingUploadData
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getcategoryTree as productCategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表

import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import { getbimProductAttributes, getbimProductAttributesList } from '@/api/masterDataManagement/index'
import { getBimProcessList } from '@/api/bimProcess/index'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { mapGetters, mapState } from 'vuex'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'

export default {
  components: {
    Process,
    recordList
  },
  mixins: [busFlow],
  data() {
    return {
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'name', label: '供应商名称' },
        { prop: 'code', label: '供应商编码' },
        { prop: 'partnerCategoryIdText', label: '所属分类' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'name', label: '供应商名称', type: 'input' },
        { prop: 'code', label: '供应商编码', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier',
        orderItems: [
          {
            asc: false,
            column: 'code'
          }
        ]
      },
      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',

      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: productCategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: 'other',
        productSource: 'purchase',
        productCategoryId: '',
        code: '',
        name: '',
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
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20,
        queryType: 7
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'drawingNo', label: '品名规格', minWidth: 140 },
        { prop: 'code', label: '产品编码', minWidth: 140 },

        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeName', label: '所属分类', minWidth: 140 },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'colour', label: '颜色' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' }
      ], // 产品选择弹出框搜索条件

      dataFormTwo: {
        data: []
      },

      inquirySheetId: '', //询价单id
      dataForm: {
        partnerType: 'supplier',
        approvalCompletionDate: '', //审批完成时间
        approvalStatus: '', // 审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerId: 0, //  供应商id
        cooperativePartnerName: '', //  供应商名称
        cooperativePartnerCode: '',
        
        createBy: '', //
        documentStatus: '', //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        id: 0, //
        listPriceFlag: 0, //是否设置牌价:0否1是
        orderNo: '', //
        reasonRejection: '', //驳回理由
        submitDate: '' //
      },
      codeConfig: {},
      taxRateList: [],
      requestObj2: {
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: -1,
        type: 'supplier'
      },
      type: '',
      dataFormArr: [],
      rules: {
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }]
        // inquiryDate: [{ required: true, message: '请选择询价日期', trigger: ['change'] }],
        // effectiveDate: [{ required: true, message: '请选择报价有效期', trigger: ['change'] }],
      },
      productRules: {
        productsName: [{ required: true, trigger: ['change'] }],
       
        materialPrice: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                8,
                '',
                (errMsg) => {
                  this.$message.error('物料价格：' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          }
        ],
        taxRate: [
          { required: true, trigger: ['blur'] },
          // {
          //   validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('税率' + errMsg) }] }), trigger: 'blur'
          // },
          // { validator: this.formValidate('noZero','', (errMsg) => { this.$message.error('税率不能为0') }), trigger: 'blur' },
          {
            validator: this.checktaxRate(),
            trigger: 'blur'
          }
        ],
        excludingTaxPrice: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                8,
                '',
                (errMsg) => {
                  this.$message.error('不含税价' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('不含税价不能为0')
            }),
            trigger: 'blur'
          }
        ],
        price: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('协议价' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('协议价不能为0')
            }),
            trigger: 'blur'
          }
        ],
        targetPrice: [
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('目标价格' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('目标价格不能为0')
            }),
            trigger: 'blur'
          }
        ]
        // contrastmaterialPrice:[{ required: true, trigger: ['blur'] }, { validator: this.formValidate({ type: 'decimal', params: [20, 8, "", (errMsg) => { this.$message.error('对比物料价格' + errMsg) }] }), trigger: 'blur' }],
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
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
      pool: '',
      list0: [],
      classAttributeList: [],
      uploadVisib: false,
      isattachmentswitch: ''
    }
  },
  mounted() {
    this.getclassAttributeList()
  },
  created() {
    this.getBimBusinessDetail()
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token'])
  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if ((item.price && item.taxRate) || (item.price && item.taxRate == 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          }
        })
      },
      deep: true
    }
  },
  methods: {
    checkDate() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：有效起始日期不能超过有效结束日期`
        if (!value) {
          callback()
        } else {
          if (new Date(value) > new Date(this.dataFormTwo.data[index].dateOrderStop)) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    checkDate2() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：有效结束日期不能超过有效起始日期`
        if (!value) {
          callback()
        } else {
          if (new Date(value) < new Date(this.dataFormTwo.data[index].dateOrderStart)) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 产品组件回调
    addth(id, data) {
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productSource: item.productSource, // 产品来源 采购
            productsId: item.id, // 产品id
            productsName: item.name, // 产品名称
            productsCode: item.code,
            drawingNo: item.drawingNo,
            mainUnit: item.mainUnit,
            taxRate: '13', // 产品税率
            materialPrice: '', // 产品价格
            price: '', // 协议价
            excludingTaxPrice: 0, // 不含税价
            historicalPrice: item.historicalPrice, // 历史价格
            targetPrice: '', // 目标价格
            // contrastProductsId:'',              // 对比物料id
            contrastProducts: '', // 对比物料
            costPrice: '', // 对比价格
        
            standardValue: item.standardValue,
            colour: item.colour,
            sealingCoverTyping: item.sealingCoverTyping,
            accuracyLevel: item.accuracyLevel,
            vibrationLevel: item.vibrationLevel
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productsName)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
        // 获取审批模版
        this.$nextTick(() => {
          this.getBusInfo()
        })
      }
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
      this.UploadProduct(this.file)
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      //调用上传文件接口
      buyFixedPointPricingUploadData(formData)
        .then((res) => {
          this.$message.success(`数据更新成功`)
          this.uploadVisib = false
          this.dataFormTwo.data = res.data
          this.dataFormTwo.data.map((item) => {
            return (item.productsCode = item.productCode)
          })
          this.dataFormTwo.data.map((item) => {
            return (item.productsName = item.productName)
          })
          this.dataFormTwo.data.map((item) => {
            return (item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + item.taxRate / 100)))
          })
          this.formLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          this.$message.error(`文件上传失败`)
          this.formLoading = false
          this.loadingText = ''
        })
    },
    // 下载模板
    downLoadTemplate() {
      if (this.dataForm.classAttribute == 'finish_product') {
        const a = document.createElement('a')
        a.setAttribute('download', '')
        a.setAttribute('href', location.origin + '/static/成品定点定价导入模板.xlsx')
        a.click()
      } else {
        const a = document.createElement('a')
        a.setAttribute('download', '')
        a.setAttribute('href', location.origin + '/static/定点定价导入模板.xlsx')
        a.click()
      }
    },
    checktaxRate() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：税率不能超过100`
        if (!value || value == 0) {
          callback()
        } else {
          if (value * 1 > 100) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    //清除对比物料的值
    btnClearable(index, val) {
      this.dataFormTwo.data[index].contrastProductsId = ''
      this.dataFormTwo.data[index].contrastProductsName = ''
      this.dataFormTwo.data[index].contrastProductsPrice = ''
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },
    supplierdata(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        this.dataForm.cooperativePartnerName = data[0].name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].id
      }
    },

    // 产品弹窗
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()

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
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
      if (this.pool == 'fixPool') {
        this.$emit('closePool', true)
      }
    },

    init(id, type, approvalFlag, classAttributeFlag) {
      console.log(id, 'o')
      console.log(type, 'ty')
      console.log(approvalFlag, 'fl')
      console.log(classAttributeFlag, 'class')
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      // this.pool = pool
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type

      this.approvalFlag = approvalFlag

      this.dataForm.classAttribute = classAttributeFlag
      if (this.dataForm.classAttribute == 'finish_product') {
        this.ProductListRequestObj = {
          classAttribute: 'finish_product',
          productSource: 'purchase',
          productCategoryId: '',
          code: '',
          name: '',
          orderItems: [
            {
              asc: false,
              column: 'code'
            }
          ],
          productStatus: 'enable',
          pageNum: 1,
          pageSize: 20,
          queryType: 7
        }
        this.ProductTableItems = [
          { prop: 'drawingNo', label: '品名规格', minWidth: 140, sortable: 'custom' },
          { prop: 'code', label: '产品编码', minWidth: 140, sortable: 'custom' },
          { prop: 'classAttributeName', label: '所属分类', minWidth: 120, sortable: 'custom' },
          { prop: 'mainUnit', label: '单位', width: 60 },
          { prop: 'sealingCoverTyping', label: '打字内容', sortable: 'custom' },
          { prop: 'accuracyLevel', label: '精度等级', sortable: 'custom' },
          { prop: 'vibrationLevel', label: '振动等级', sortable: 'custom' },
          { prop: 'oil', label: '油脂', sortable: 'custom' },
          { prop: 'oilQuantity', label: '油脂量', sortable: 'custom' },
          { prop: 'clearance', label: '游隙', sortable: 'custom' }
        ]
      } else {
        this.ProductListRequestObj = {
          classAttribute: 'other',
          productSource: 'purchase',
          productCategoryId: '',
          code: '',
          name: '',
          orderItems: [
            {
              asc: false,
              column: 'code'
            }
          ],
          productStatus: 'enable',
          pageNum: 1,
          pageSize: 20,
          queryType: 7
        }
        this.ProductTableItems = [
          { prop: 'drawingNo', label: '品名规格', minWidth: 140 },
          { prop: 'code', label: '产品编码', minWidth: 140 },

          // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
          // { prop: 'processName', label: '工序名称' },
          { prop: 'classAttributeName', label: '所属分类', minWidth: 140 },
          { prop: 'mainUnit', label: '单位' },
          { prop: 'colour', label: '颜色' }
        ]
      }
      console.log(this.dataForm, 'form')
      this.getProductClassFun()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
          // 审批
          this.$nextTick(() => {
            this.getBusInfo()
          })
          // if (pool == 'fixPool') {
          //   this.dataFormTwo.data = fixedData
          //   // 审批
          //   this.$nextTick(() => {
          //     this.getBusInfo()
          //   })
          // }
        } else if (this.type == 'add' && this.dataForm.id) {
          this.loading = true
          getbuyFixedPointPricingDetail(this.dataForm.id).then((res) => {
            this.dataForm = {
              id: res.data.id,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              cooperativePartnerName: res.data.cooperativePartnerName, //  供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId, //  供应商id
              documentStatus: res.data.documentStatus, //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
              listPriceFlag: res.data.listPriceFlag, //是否设置牌价:0否1是
              orderNo: res.data.orderNo, //单号
              approvalFlag: res.data.approvalFlag
            }
            this.dataForm.approvalStatus = ''
            this.dataForm.submitDate = ''
            this.dataForm.approvalCompletionDate = ''
            this.dataForm.id = ''
            this.dataFormTwo.data = res.data.buyFixedPointPricingLineVOList
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
          })
          // 审批
          this.$nextTick(() => {
            this.getBusInfo()
          })
        } else {
          this.loading = true
          getbuyFixedPointPricingDetail(this.dataForm.id).then((res) => {
            this.dataForm = {
              id: res.data.id,
              classAttribute: res.data.classAttribute,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              cooperativePartnerName: res.data.cooperativePartnerName, //  供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId, //  供应商id
              documentStatus: res.data.documentStatus, //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
              listPriceFlag: res.data.listPriceFlag, //是否设置牌价:0否1是
              orderNo: res.data.orderNo, //单号
              approvalFlag: res.data.approvalFlag,
              remark: res.data.remark
            }
            this.dataFormTwo.data = res.data.buyFixedPointPricingLineVOList
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
            console.log(this.dataForm.approvalFlag, 'this.dataForm.approvalFlag')
            // 流程信息和流转记录
            if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
          })
          getSaleBusDetail(this.dataForm.id).then((res) => {
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
                this.transferQuery.documentId = this.dataForm.id
                approvalTransferList(this.transferQuery).then((res) => {
                  this.transferData = res.data.records
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
      })
    },

    getclassAttributeList() {
      let obj = {
        pageNum: 1,
        pageSize: 20
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        this.classAttributeList = arr
      })
    },

    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        item.classAttributeName = this.$getLabel(this.classAttributeList, item.classAttribute, 'value', 'label')
      })

      return res.data.records
    },
    addtable() {
      // 导入产品，获取数据渲染
      if (this.dataFormTwo.data.length) {
        this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' })
          .then(() => {
            // this.$refs.UploadProduct.$el.querySelector('input').click()
            this.uploadVisib = true
            // 审批
            this.$nextTick(() => {
              this.getBusInfo()
            })
          })
          .catch(() => { })
      } else {
        // this.$refs.UploadProduct.$el.querySelector('input').click()
        this.uploadVisib = true
        // 审批
        this.$nextTick(() => {
          this.getBusInfo()
        })
      }
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa008',
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
      getbimProductAttributesList(obj0).then((res) => {
        this.list0 = res.data.records
      })

      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
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
      getbimProductAttributesList(obj1).then((res) => {
        this.list1 = res.data.records
        console.log(this.list1, '1')
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
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
      getbimProductAttributesList(obj2).then((res) => {
        this.list2 = res.data.records
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
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
      getbimProductAttributesList(obj3).then((res) => {
        this.list3 = res.data.records
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
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
      getbimProductAttributesList(obj4).then((res) => {
        this.list4 = res.data.records
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
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
      getbimProductAttributesList(obj5).then((res) => {
        this.list5 = res.data.records
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
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

      getbimProductAttributesList(obj6).then((res) => {
        this.list6 = res.data.records
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
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
      getbimProductAttributesList(obj7).then((res) => {
        this.list7 = res.data.records
      })

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
        this.list8 = res.data.records
      })

      let obj9 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa010',
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
      getbimProductAttributesList(obj9).then((res) => {
        this.list9 = res.data.records
      })
      let obj10 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa016',
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
      getbimProductAttributesList(obj10).then((res) => {
        this.list10 = res.data.records
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    // 表单提交
    handleConfirm(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      let templateLineList = []
      this.btnLoading = true
      this.dataForm.documentStatus = type
      // this.dataForm.classAttribute = 'other'
      // 选择物料之后 限制必须有物料价格的 否则无法提交
      this.dataFormTwo.data.forEach((item) => {
        if (item.contrastProductsName) {
          if (!item.contrastProductsPrice) {
            hasCostPrice = false
            this.btnLoading = false
            this.$message.error('请选择含有物料价格的产品')
          } else {
            hasCostPrice = true
          }
        } else {
          item.contrastProductsId = ''
        }
      })
      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: 'system_attachment',
            configKey: this.dataForm.classAttribute == 'finish_product' ? 'fj_cpdddj' : 'fj_dddj',
            categoryId: this.categoryId,
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }
      if (this.type == 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data)
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map((item) => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList
            ccLists = ccLists.concat(nodeUserList)
          }
          if (templateLineList.length && type === 'submit') {
            hasCostPrice = templateLineList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            hasCostPrice = ccList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode:
                item.type === 'condition' ? item.previousCode : index === 0 ? '' : flattenedNodes[index - 1].code,
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId
                ? item.designatedMembersId
                : item.nodeUserList.length
                  ? item.nodeUserList[0].targetId
                  : ''
            }
          })
          // 抄送人
          ccLists = ccLists.map((item) => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map((item) => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: type,
            documentId: '',
            id: ''
          }
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data)
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map((item) => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList
            ccLists = ccLists.concat(nodeUserList)
          }
          if (templateLineList.length && type === 'submit') {
            hasCostPrice = templateLineList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            hasCostPrice = ccList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId
                ? item.designatedMembersId
                : item.nodeUserList.length
                  ? item.nodeUserList[0].targetId
                  : ''
            }
          })
          // 抄送人
          ccLists = ccLists.map((item) => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map((item) => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: type
          }
        }
      }
      // if (type === 'submit' && this.dataForm.approvalFlag) {

      //   if (!this.busNodeConfig.childNode) {
      //     hasCostPrice = false
      //     this.btnLoading = false
      //     this.$message.error('未找到匹配的审批流程，请联系管理员！')
      //   }
      //   if (formNodeList.length) {
      //     formNodeList.forEach((item) => {
      //       if (item.approvalType === 'option') {
      //         if (!item.designatedMembersId) {
      //           hasCostPrice = false
      //           this.btnLoading = false
      //           this.$message.error('未配置发起人自选！')
      //         }
      //       }
      //     })
      //   }
      // }

      _data = {
        ...this.dataForm,
        list: this.dataFormTwo.data
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
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  if (!item.price) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的协议价',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.taxRate) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的税率',
                      duration: 1500
                    })
                    break
                  }

                  if (!item.excludingTaxPrice) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的不含税价',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.dateOrderStart) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的有效起始时间',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.dateOrderStop) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的有效结束时间',
                      duration: 1500
                    })
                    break
                  }
                }
                return
              } else {
                this.btnLoading = true

                if (!this.dataForm.id) {
                  addPartnerOrProductData(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '新建成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                          if (this.pool == 'fixPool') {
                            this.$emit('closePool', true)
                          }
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editbuyFixedPointPricing(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '修改成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                          if (this.pool == 'fixPool') {
                            this.$emit('closePool', true)
                          }
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
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        // this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
        //   return !data.some(element => element.productsId === item.productsId);
        // });

        // data = data.filter(item1 => this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId) === -1);

        const deletedArray = []
        data = data.filter((item1) => {
          const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
          if (index !== -1) {
            deletedArray.push(item1.productsName)
            if (deletedArray.length) {
              this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
            }
            return false
          }
          return true
        })
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
    },
    // 对比物料弹窗传递数据
    productSubmit(data) {
      this.$set(this.dataFormTwo.data[this.index], 'contrastProductsId', data.id)
      this.$set(this.dataFormTwo.data[this.index], 'contrastProductsName', data.contrastProductsName)
      this.$set(this.dataFormTwo.data[this.index], 'contrastProductsPrice', data.contrastProductsPrice)
      // this.dataFormTwo.data[this.index].contrastProductsId = data.id
      // this.dataFormTwo.data[this.index].contrastProductsName = data.contrastProductsName
      // this.dataFormTwo.data[this.index].contrastProductsPrice = data.contrastProductsPrice
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
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
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

    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b002')
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
                    if (nodeItem.nodeType === 'approver') data.processingTime = nodeItem.processingTime
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

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding-top: 5px;
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

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
