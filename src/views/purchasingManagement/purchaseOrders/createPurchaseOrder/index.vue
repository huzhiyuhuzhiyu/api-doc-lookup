<script>
import {getBasicFormSchema, getOtherFormSchema} from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {getcategoryTree} from "@/api/basicData/materialSettings";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import {getProducts} from "@/api/masterDataManagement";
import {editPurchaseOrder, insertPurchaseOrder, purPurchaseOrderdetail} from "@/api/purchasingAndOutsourcingOrders";
import {purProcurementDemandPoolList} from "@/api/purchasingManagement/purchaseInquirySheet";
import * as _ from "highcharts";

export default {
  props: {
    autoInit: {
      type: Boolean,
      default: true,
    },
  },
  name: "Form",
  components: {TableFormProduct},
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '采购单',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        orderType: 'procure',
        orderNo: '',
        currency: '',
        orderDate: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        deliveryDate: '',
        taxAmount: '',
        totalAmount: '',
        excludingTaxTotalAmount: '',
      },
      dataOtherForm: {
        paymentTerms: '',
        qualityRequirements: '',
        sealingCoverTyping: '',
        packagingRequirements: '',
        remark: '',
      },
      basicFormSchema: [],
      otherFormSchema: [],
      paymentFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'drawingNo',
          label: '型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'demandDate',
          label: '订单交期',
          type: 'date',
          minWidth: 180,
          itemRules: [
            {required: true, message: '订单交期不能为空', trigger: 'change',},
          ]
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'purchaseQuantity',
          label: '采购数',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '采购数不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['采购数不能为空', (errMsg) => {
                  this.$message.error(`	采购数不能为空`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg) => {
                  this.$message.error(errMsg)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {required: true, message: '采购数不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {
          prop: 'price',
          label: '单价(含税)',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate('noZero', '单价(含税)不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['单价(含税)不能为空', (errMsg) => {
                  this.$message.error(`	单价(含税)不能为空`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg) => {
                  this.$message.error(errMsg)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {required: true, message: '单价(含税)不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {
          prop: 'taxRate',
          label: '税率',
          type: 'select',
          options: this.getDictDataSync('taxrate'),
          minWidth: 160,
          itemRules: [
            {required: true, message: '税率不能为空', trigger: 'change',},
          ]
        },
        {
          prop: 'excludingTaxPrice',
          label: '单价(不含税)',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'taxAmount',
          label: '税额',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'totalAmount',
          label: '金额(含税)',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'excludingTaxAmount',
          label: '金额(不含税)',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'discount',
          label: '加点',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'deliveryDate',
          label: '确认交期',
          type: 'date',
          minWidth: 180,
          itemRules: [
            {required: true, message: '订单交期不能为空', trigger: 'change',},
          ]
        },
      ],
      linesTableHeight: 0,
      productRefType: '',
      addProductProps: {
        title: '选择产品',
        activeType: '',
        renderTree: false,
        multiple: true,
        treeTitle: '产品分类',
        methodArr: {
          method: getcategoryTree,
          requestObj: {
            classAttribute: ''
          },
        },
        listMethod: getProducts,
        tableItems: [
          {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'code', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'createTime', label: '创建时间', sortable: 'custom'}
        ],
        listRequestObj: {
          productCode: "",
          productName: "",
          productStatus: 'enable',
          pageNum: 1,
          pageSize: 20,
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_time'
            }
          ]
        },
        beforeSubmit: (data, paramsObj) => {
          if (!data || !data.length) {
            this.$message.error(`请进行产品选择！`)
            return false
          }
          return true
        },
        searchList: [
          {prop: 'productName', label: '产品名称', type: 'input'},
          {prop: 'productCode', label: '产品编码', type: 'input'},
        ]
      },

      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        copy: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig();
        },
        default: async () => {
          await this.getOrderNoConfig();
        },
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    computedLinesList() {
      return this.linesList.map(item => {
        // 计算不含税单价 = 含税单价 / (1 + 税率)
        const excludingTaxPrice = this.jnpf.numberFormat(
          this.calcExcludingTaxPrice(item.price, item.taxRate),
          2
        );
        // 计算税额 = 含税金额 - 不含税金额
        const totalAmount = this.jnpf.numberFormat(
          this.calcTotalAmount(item.price, item.purchaseQuantity),
          2
        );
        // 计算不含税金额 = 数量 × 不含税单价
        const excludingTaxAmount = this.jnpf.numberFormat(
          this.calcExcludingTaxAmount(item.price, item.purchaseQuantity, item.taxRate),
          2
        );
        // 计算含税总金额 = 数量 × 含税单价
        const taxAmount = this.jnpf.numberFormat(
          this.calcTaxAmount(totalAmount, excludingTaxAmount),
          2
        );

        return {
          ...item,
          excludingTaxPrice,
          totalAmount,
          excludingTaxAmount,
          taxAmount,
        };
      });
    },
    totalNum() {
      return this.computedLinesList.reduce((sum, item) => sum + (parseFloat(item.purchaseQuantity) || 0), 0);
    },
    totalAmount() {
      return this.jnpf.numberFormat(
        this.computedLinesList.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0),
        2
      );
    },
    excludingTaxAmount() {
      return this.jnpf.numberFormat(
        this.computedLinesList.reduce((sum, item) => sum + (parseFloat(item.excludingTaxAmount) || 0), 0),
        2
      );
    }
  },
  // 菜单进入 走activated
  activated() {
    this.btnType = ''
    this.title = '采购单'
    this.init('', 'add')
  },
  // 列表操作进入 走created
  created() {
    this.autoInit && this.init('', 'add')
  },
  methods: {
    async init(id = '', type, sourceList) {
      this.btnType = type
      this.title = this.getTitle(type)
      this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
      this.otherFormSchema = getOtherFormSchema(this.$refs.dataForm, this)
      this.dataForm.source = sourceList[0] || ''
      // this.paymentFormSchema = getPaymentFormSchema(this.$refs.dataForm, this)
      this.getBusInfo('b009')
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    calcExcludingTaxPrice(price, taxRate) {
      if (!price || !taxRate) return 0;
      const rate = parseFloat(taxRate) / 100 || 0;
      return price / (1 + rate);
    },
    calcTotalAmount(price, num) {
      if (!price || !num) return 0;
      return price * num;
    },
    calcExcludingTaxAmount(price, num, taxRate) {
      return this.calcExcludingTaxPrice(price, taxRate) * num;
    },
    calcTaxAmount(totalAmount, excludingTaxAmount) {
      return totalAmount - excludingTaxAmount;
    },
    calculateAndAssign() {
      this.dataForm.taxAmount = this.jnpf.numberFormat(
        this.computedLinesList.reduce((sum, item) => sum + (item.taxAmount || 0), 0),
        2
      );

      this.dataForm.totalAmount = this.jnpf.numberFormat(
        this.computedLinesList.reduce((sum, item) => sum + (item.totalAmount || 0), 0),
        2
      );

      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(
        this.computedLinesList.reduce((sum, item) => sum + (item.excludingTaxAmount || 0), 0),
        2
      );
    },

    async getOrderNoConfig() {
      const {number} = await this.$store.dispatch('base/getOrderNoConfig', 'CGDH')
      this.dataForm.orderNo = `${ number }`
    },

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    createdObj() {
      return this.linesListItems.reduce((acc, item) => {
        acc[item.prop] = '';
        return acc;
      }, {});
    },

    selectProductRefOpenDialog(type) {
      this.productRefType = type
      if (type === 'product') {
        this.addProductProps = {
          ...this.addProductProps,
          renderTree: true,
          tableItems: [
            {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
            {prop: 'code', label: '产品编码', sortable: 'custom'},
            {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
            {prop: 'mainUnit', label: '单位', sortable: 'custom'},
            {prop: 'createTime', label: '创建时间', sortable: 'custom'}
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
            saleFlag: true,
          },
          searchList: [
            {prop: 'productName', label: '产品名称', type: 'input'},
            {prop: 'productCode', label: '产品编码', type: 'input'},
          ]
        }
      } else {
        this.addProductProps = {
          ...this.addProductProps,
          title: '选择需求单',
          renderTree: false,
          tableItems: [
            {prop: 'sourceOrderNo', label: '来源单号', minWidth: '220px', sortable: 'custom'},
            {prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom'},
            {prop: 'productCode', label: '产品编码', sortable: 'custom'},
            {prop: 'deliveryDate', label: '交货日期', minWidth: '160px', sortable: 'custom'},
            {prop: 'productDrawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
            {prop: 'mainUnit', label: '单位', sortable: 'custom'},
            {prop: 'createTime', label: '创建时间', minWidth: '180px', sortable: 'custom'}
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
            sourceOrderNo: '',
          },
          searchList: [
            {prop: 'sourceOrderNo', label: '来源单号', type: 'input'},
          ]
        }
      }
      this.addProductProps.listMethod = type === 'product' ? getProducts : purProcurementDemandPoolList
      this.$refs.ComSelectProductRef.openDialog()
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    async submitAllProduct(id, data) {
      const isProduct = this.productRefType === 'product';
      const newData = data.map(({all}) => {
        const {
          name, productName,
          code, productCode,
          drawingNo, productDrawingNo,
          id, productsId,
          ...restAll
        } = all;
        return {
          ...this.createdObj(),
          ...restAll,
          productName: isProduct ? name : productName,
          productCode: isProduct ? code : productCode,
          drawingNo: isProduct ? drawingNo : productDrawingNo,
          productsId: isProduct ? id : productsId,
          ...(!isProduct && {procurementDemandPoolId: id})
        };
      });
      this.linesList = [...this.linesList, ...newData];
    },

    getTitle(type) {
      switch (type) {
        case 'add':
        case 'copy':
          return `创建${ this.title }`
        case 'edit':
          return `编辑${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await purPurchaseOrderdetail(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.linesList = data.purchaseOrderLineVOList
          this.dataForm = Object.assign(this.dataForm, data)
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async handleSubmit(type) {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      this.dataForm.documentStatus = type
      this.calculateAndAssign()
      const deepParams = _.merge({}, this.dataForm, this.dataOtherForm)
      const params = {
        ...deepParams,
        purchaseOrderLines: this.computedLinesList,
        flowData: this.flowData
      }
      let MSG = '提交成功'
      try {
        const apiMethod = params.id ? editPurchaseOrder : insertPurchaseOrder
        const res = await apiMethod(params)
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch (error) {
        this.btnLoading = false
      }
    },

    goBack() {
      if ('close' in this.$listeners) {
        this.$emit('close', this.activeType);
      } else {
        setTimeout(() => {
          this.$router.push('/purchasingManagement/purchaseOrders/purchaseOrder')
        }, 100)
      }
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <!-- :class="btnType === 'add' ? 'el-page-header_left_none' : '' "-->
              <el-page-header @back="goBack"
                :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                    保存草稿
                  </el-button>
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                    保存并提交
                  </el-button>
                </template>
                <el-button @click="$emit('close',false)">{{
                    $t('common.cancelButton')
                  }}
                </el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                      <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                        :btnType="btnType"/>
                    </el-collapse-item>
                    <el-collapse-item class="productInfo"
                      title="产品信息"
                      name="productInfo">
                      <div class="TableForm_title">
                      </div>
                      <TableForm-product
                        @input="contentChanges"
                        :value="computedLinesList"
                        :hasToolbar="false"
                        ref="tableForm" :tableItems="linesListItems"
                        :btnType="btnType"
                        :hasActionbar="false"
                        :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: activeType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true
                      }">
                        <template slot="top">
                          <div class="tableTopContainer">
                            <div class="left">
                              <template v-if="activeType">
                                <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('product')">选择产品</el-button>
                                <span>|</span>
                                <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog">从需求单选择</el-button>
                                <span>|</span>
                                <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除</el-button>
                              </template>
                            </div>
                            <div class="right">
                              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                  @click="$refs.tableForm.$refs.tableRef.showDrawer()"/>
                              </el-tooltip>
                            </div>
                          </div>
                        </template>
                      </TableForm-product>
                      <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                        <span style="font-weight:500;margin-right:10px">总数量：{{ totalNum }}</span>
                        <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ totalAmount }}</span>
                        <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ excludingTaxAmount }}</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="其他要求" name="other">
                  <JNPF-col v-model="dataOtherForm" :tabContent="otherFormSchema" ref="dataForm"
                    :btnType="btnType"/>
                </el-tab-pane>
                <!--                <el-tab-pane label="付款信息" name="payment">-->
                <!--                  <JNPF-col v-model="dataForm" :tabContent="paymentFormSchema" ref="dataForm"-->
                <!--                    :btnType="btnType"/>-->
                <!--                </el-tab-pane>-->
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @change="submitAllProduct"/>
    </div>
  </transition>
</template>
<style scoped lang="scss">
::v-deep .el-page-header_left_none {
  .el-page-header__left {
    display: none;
  }
}
</style>
