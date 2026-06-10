<script>
import { getBasicFormSchema, getOtherFormSchema } from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getcategoryTree } from "@/api/basicData/materialSettings";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import { getProducts } from "@/api/masterDataManagement";
import {
  detailpurchaseOrderList,
  editPurchaseOrder,
  insertPurchaseOrder,
  purPurchaseOrderdetail
} from "@/api/purchasingAndOutsourcingOrders";
import { getEnquiryDetailList } from '@/api/enquiryManagement/enquiryDetail';
import { getColumns as getEnquiryDetailColumns } from '@/views/enquiryManagement/enquiryOrder/enquiryDetail/data';
import { purProcurementDemandPoolList } from "@/api/purchasingManagement/purchaseInquirySheet";
import * as _ from "highcharts";
import { createEmptyObject, standardizeFields } from "@/utils";

export default {
  props: {
    autoInit: {
      type: Boolean,
      default: true,
    },
  },
  name: "Form",
  components: { TableFormProduct },
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '采购单',
      btnType: '',
      loading: false,
      btnLoading: false,
      isGenerate: false,
      isOrderNoEditable: false,
      dataForm: {
        orderType: 'procure',
        orderNo: '',
        currency: 'CNY',
        orderDate: this.jnpf.getToday(),
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
      linesListItems: [],
      linesTableHeight: 0,
      productRefType: '',
      productReferenceType: '',
      selectedProductLine: null,
      selectedProductLineIndex: -1,
      selectedProductLineRows: [],
      productLineTableRef: null,
      productReferenceDialogProps: {
        title: '选择',
        activeType: '',
        renderTree: false,
        multiple: false,
        listMethod: getProducts,
        tableItems: [],
        listRequestObj: {
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
        beforeSubmit: () => true,
        searchList: []
      },
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
          { prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom' },
          { prop: 'code', label: '产品编码', sortable: 'custom' },
          { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
          { prop: 'mainUnit', label: '单位', sortable: 'custom' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom' }
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
          { prop: 'productName', label: '产品名称', type: 'input' },
          { prop: 'productCode', label: '产品编码', type: 'input' },
        ]
      },

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig();
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        generate: async (prefillData) => {
          this.generateOperation(prefillData)
          await this.getOrderNoConfig();
        },
        default: async () => {
          await this.getOrderNoConfig();
        },
      },
      apiMethodActions: {
        add: insertPurchaseOrder,
        generate: insertPurchaseOrder,
        edit: editPurchaseOrder,
      },
      productFieldMap: {
        productName: ['productName', 'productsName', 'name'],
        productCode: ['productCode', 'productsCode', 'code'],
        drawingNo: ['productDrawingNo', 'productsDrawingNo', 'drawingNo'],
        productsId: ['productsId', 'productId', 'id'],
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    computedLinesList() {
      return this.linesList.map((item, index) => {
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
          _lineIndex: index,
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
    this.$unsavedGuard.set(true, this.$route.fullPath);

    this.autoInit && this.init('', 'add')
  },
  beforeDestroy() {
    if (this.productLineTableRef) {
      this.productLineTableRef.$off('row-click', this.handleProductLineRowClick)
      this.productLineTableRef = null
    }
  },
  methods: {
    async init(params) {
      const { id, type, sourceList, prefillData } = params;
      this.btnType = type;
      this.title = this.getTitle(type)
      this.isGenerate = type === 'generate';
      this.sourceList = sourceList;

      this.setFormSchema()
      this.setLinesListItems()

      this.dataForm.source = sourceList[0] || ''
      this.getBusInfo('b009')

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else if (this.actions[type]) {
        await this.actions[type](prefillData);
      } else {
        await this.actions.default();
      }

      this.dataForm.approvalFlag && this.getFlowDetail(id)

      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
        this.bindProductLineRowClick()
      })
    },
    generateOperation(data) {
      this.dataForm.source = data[0]?.source
      this.linesList = standardizeFields(data, this.productFieldMap).map(item => {
        const num = this.jnpf.math('-', [item.planDemandQuantity, item.orderedQuantity])
        return {
          ...createEmptyObject(this.linesListItems),
          ...item,
          demandDate: item.feedbackDeliveryDate,
          orderQuantity: num,
          purchaseQuantity: num,
          procurementDemandPoolId: item.id,
          taxRate: '13',
        }
      })
    },
    setFormSchema() {
      const cooperativePartnerType = this.sourceList.includes('factory') ? 'factory_supplier' : 'supplier';
      this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
        .map(item => item.prop === 'cooperativePartnerName'
          ? {
            ...item,
            methodArr: { ...item.methodArr, requestObj: { ...item.methodArr.requestObj, type: cooperativePartnerType } },
            listRequestObj: { ...item.listRequestObj, type: cooperativePartnerType }
          }
          : item
        );
      this.otherFormSchema = getOtherFormSchema(this.$refs.dataForm, this)
      // this.paymentFormSchema = getPaymentFormSchema(this.$refs.dataForm, this)
    },
    setLinesListItems() {
      this.linesListItems = [
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
            { required: true, message: '订单交期不能为空', trigger: 'change', },
          ]
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'orderQuantity',
          label: '可下单数量',
          type: 'view',
          minWidth: 120,
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
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex) => {
                    const orderQty = this.linesList[rowIndex].orderQuantity;
                    const purchaseQty = this.linesList[rowIndex].purchaseQuantity;

                    if (orderQty === null || orderQty === undefined || orderQty === '' || isNaN(+orderQty)) {
                      return true;
                    }

                    return +purchaseQty <= +orderQty;
                  },
                  "采购数不能超过可下单数量",
                  (errMsg) => {
                    this.$message.error(errMsg);
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, message: '采购数不能为空', trigger: ['blur', 'change'], },
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
            { required: true, message: '单价(含税)不能为空', trigger: ['blur', 'change'], },
          ]
        },
        {
          prop: 'taxRate',
          label: '税率',
          type: 'select',
          options: this.getDictDataSync('taxrate'),
          minWidth: 160,
          itemRules: [
            { required: true, message: '税率不能为空', trigger: 'change', },
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
          // itemRules: [
          //   { required: true, message: '订单交期不能为空', trigger: 'change', },
          // ]
        },
      ]
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
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'CGDH')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (['add', 'generate'].includes(this.btnType)) {
        this.dataForm.orderNo = `${ number }`
      }
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
    getProductReferenceDialogConfigs(line) {
      const productCode = line.productCode || line.productsCode || line.code || '';
      const dialogActiveType = this.activeType ? '' : 'look';
      const purchaseHistoryColumns = [
        { prop: 'cooperativePartnerCode', label: '供应商编号', minWidth: '140px', sortable: 'custom' },
        { prop: 'orderNo', label: '采购单号', minWidth: '180px', sortable: 'custom' },
        { prop: 'orderDate', label: '订单日期', minWidth: '160px', sortable: 'custom' },
        { prop: 'price', label: '价格', minWidth: '120px', sortable: 'custom' }
      ];
      // 旧逻辑：purchaseHistorySearchList 支持按采购单号搜索。新逻辑要求不再额外传搜索条件。
      const purchaseHistoryRequest = {
        // 旧逻辑：orderType、productsId、productId、productName、productDrawingNo 也会随请求传递。
        // 新逻辑：供应商采购历史只传产品编码、可选供应商 id 以及分页排序条件。
        productCode,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: 'order_date'
          }
        ]
      };
      return {
        currentSupplierPurchase: {
          title: '当前供应商采购',
          activeType: dialogActiveType,
          renderTree: false,
          multiple: false,
          listMethod: detailpurchaseOrderList,
          tableItems: purchaseHistoryColumns,
          listRequestObj: {
            ...purchaseHistoryRequest,
            cooperativePartnerId: this.dataForm.cooperativePartnerId
          },
          searchList: [],
          beforeSubmit: () => true
        },
        allSupplierPurchase: {
          title: '所有供应商采购',
          activeType: dialogActiveType,
          renderTree: false,
          multiple: false,
          listMethod: detailpurchaseOrderList,
          tableItems: purchaseHistoryColumns,
          listRequestObj: purchaseHistoryRequest,
          searchList: [],
          beforeSubmit: () => true
        },
        quotation: {
          title: '报价单',
          activeType: dialogActiveType,
          renderTree: false,
          multiple: false,
          // 旧逻辑：listMethod: () => priceList(productId)
          // 新逻辑：报价单改查询询价明细分页接口，字段复用询价明细列表。
          listMethod: getEnquiryDetailList,
          tableItems: getEnquiryDetailColumns(),
          listRequestObj: {
            productsCode: productCode,
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                asc: false,
                column: ''
              },
              {
                asc: false,
                column: 't1.create_time'
              }
            ]
          },
          searchList: [],
          beforeSubmit: () => true
        },
        product: {
          title: '选择产品',
          activeType: dialogActiveType,
          renderTree: true,
          multiple: false,
          treeTitle: '产品分类',
          methodArr: {
            method: getcategoryTree,
            requestObj: {
              classAttribute: ''
            },
          },
          listMethod: getProducts,
          tableItems: [
            { prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'code', label: '产品编码', sortable: 'custom' },
            { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', sortable: 'custom' }
          ],
          listRequestObj: {
            productCode: '',
            productName: '',
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
          searchList: [
            { prop: 'productName', label: '产品名称', type: 'input' },
            { prop: 'productCode', label: '产品编码', type: 'input' },
          ],
          beforeSubmit: () => true
        }
      }
    },
    stripLineMeta(line) {
      const { _lineIndex, ...realLine } = line || {};
      return realLine;
    },
    getSelectedProductLine() {
      // 旧逻辑：先用左侧复选框选择的行作为参考弹窗目标。
      // if (this.selectedProductLineRows.length > 1) return null
      // if (this.selectedProductLineRows.length === 1) {
      //   const index = this.resolveProductLineIndex(this.selectedProductLineRows[0])
      //   this.selectedProductLineIndex = index
      // }
      // 新逻辑：优先使用直接点击的当前产品行，复选框只作为未点击行时的兼容兜底。
      if (this.selectedProductLineIndex < 0 || !this.linesList[this.selectedProductLineIndex]) {
        if (this.selectedProductLineRows.length > 1) {
          this.$message.error('请选择一行产品信息')
          return null
        }
        if (this.selectedProductLineRows.length === 1) {
          const index = this.resolveProductLineIndex(this.selectedProductLineRows[0])
          if (index > -1) {
            this.selectedProductLineIndex = index
            this.selectedProductLine = this.linesList[index]
          }
        }
      }
      if (this.selectedProductLineIndex < 0 || !this.linesList[this.selectedProductLineIndex]) {
        this.$message.error('请先选择产品信息中的一行')
        return null
      }
      this.selectedProductLine = this.linesList[this.selectedProductLineIndex]
      return this.selectedProductLine
    },
    resolveProductLineIndex(row) {
      if (!row) return -1
      if (row._lineIndex !== undefined && row._lineIndex !== null) return row._lineIndex
      return this.linesList.findIndex(item => {
        const productId = item.productsId || item.productId || item.id
        const rowProductId = row.productsId || row.productId || row.id
        return productId && rowProductId && productId === rowProductId
      })
    },
    handleProductLineSelectionChange(selection) {
      this.selectedProductLineRows = selection
      if (this.$refs.tableForm) this.$refs.tableForm.selectedList = selection
      if (selection.length === 1) {
        this.selectedProductLineIndex = this.resolveProductLineIndex(selection[0])
        this.selectedProductLine = this.linesList[this.selectedProductLineIndex] || null
      }
    },
    handleProductLineCurrentChange(row) {
      const index = this.resolveProductLineIndex(row)
      if (index < 0) return
      this.selectedProductLineIndex = index
      this.selectedProductLine = this.linesList[index]
    },
    bindProductLineRowClick() {
      const tableRef = this.$refs.tableForm && this.$refs.tableForm.$refs.tableRef
      if (!tableRef || tableRef === this.productLineTableRef) return
      if (this.productLineTableRef) {
        this.productLineTableRef.$off('row-click', this.handleProductLineRowClick)
      }
      this.productLineTableRef = tableRef
      tableRef.$off('row-click', this.handleProductLineRowClick)
      tableRef.$on('row-click', this.handleProductLineRowClick)
    },
    handleProductLineRowClick(row) {
      // Old logic: users had to tick the left checkbox before opening reference dialogs.
      this.handleProductLineCurrentChange(row)
    },
    openProductReferenceDialog(type) {
      const line = this.getSelectedProductLine()
      if (!line) return
      const productCode = line.productCode || line.productsCode || line.code
      if (['currentSupplierPurchase', 'allSupplierPurchase', 'quotation'].includes(type) && !productCode) {
        this.$message.error('请先选择有效的产品编码')
        return
      }
      if (type === 'currentSupplierPurchase' && !this.dataForm.cooperativePartnerId) {
        this.$message.error('请先选择供应商')
        return
      }
      const config = this.getProductReferenceDialogConfigs(line)[type]
      this.productReferenceType = type
      this.productReferenceDialogProps = {
        ...this.productReferenceDialogProps,
        ...config
      }
      this.$nextTick(() => {
        this.$refs.ProductReferenceDialogRef.openDialog()
      })
    },
    selectProductRefOpenDialog(type) {
      this.productRefType = type
      if (type === 'product') {
        this.addProductProps = {
          ...this.addProductProps,
          renderTree: true,
          tableItems: [
            { prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'code', label: '产品编码', sortable: 'custom' },
            { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', sortable: 'custom' }
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
            saleFlag: true,
          },
          searchList: [
            { prop: 'productName', label: '产品名称', type: 'input' },
            { prop: 'productCode', label: '产品编码', type: 'input' },
          ]
        }
      } else {
        this.addProductProps = {
          ...this.addProductProps,
          title: '选择需求单',
          renderTree: false,
          tableItems: [
            { prop: 'sourceOrderNo', label: '来源单号', minWidth: '220px', sortable: 'custom' },
            { prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'productCode', label: '产品编码', sortable: 'custom' },
            { prop: 'deliveryDate', label: '交货日期', minWidth: '160px', sortable: 'custom' },
            { prop: 'productDrawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', sortable: 'custom' },
            { prop: 'planDemandQuantity', label: '需求数量', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', minWidth: '180px', sortable: 'custom' }
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
            sourceOrderNo: '',
          },
          searchList: [
            { prop: 'sourceOrderNo', label: '来源单号', type: 'input' },
          ]
        }
      }
      this.addProductProps.listMethod = type === 'product' ? getProducts : purProcurementDemandPoolList
      this.$refs.ComSelectProductRef.openDialog()
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        // 旧逻辑：this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex)).map(this.stripLineMeta)
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    handleProductReferenceChange(id, data) {
      const selected = data && data[0] ? data[0].all : null
      const index = this.selectedProductLineIndex
      if (!selected || index < 0 || !this.linesList[index]) return
      if (['currentSupplierPurchase', 'allSupplierPurchase', 'quotation'].includes(this.productReferenceType)) {
        this.applyReferencePurchasePrice(index, selected)
        return
      }
      if (this.productReferenceType === 'product') {
        this.replaceSelectedProductLine(index, selected)
      }
    },
    applyReferencePurchasePrice(index, selected) {
      const price = selected.price || selected.purchasePrice || selected.costPrice || selected.procurementAmounts || selected.sampleAmounts || ''
      this.$set(this.linesList[index], 'price', price)
      if (selected.taxRate !== undefined && selected.taxRate !== null) {
        this.$set(this.linesList[index], 'taxRate', selected.taxRate)
      }
      if (selected.excludingTaxPrice !== undefined && selected.excludingTaxPrice !== null) {
        this.$set(this.linesList[index], 'excludingTaxPrice', selected.excludingTaxPrice)
      }
      this.$set(this.linesList[index], 'fixedPrice', selected.fixedPrice || price)
    },
    replaceSelectedProductLine(index, selected) {
      this.$set(this.linesList, index, {
        ...this.linesList[index],
        productName: selected.name || selected.productName || '',
        productCode: selected.code || selected.productCode || '',
        drawingNo: selected.drawingNo || selected.productDrawingNo || '',
        productCategoryName: selected.productCategoryName || selected.classAttributeText || '',
        mainUnit: selected.mainUnit || '',
        productsId: selected.id || selected.productsId || selected.productId || ''
      })
    },
    async submitAllProduct(id, data) {
      const isProduct = this.productRefType === 'product';
      const newData = data.map(({ all }) => {
        const {
          name, productName,
          code, productCode,
          drawingNo, productDrawingNo,
          id,
          productsId,
          planDemandQuantity,
          orderedQuantity,
          ...restAll
        } = all;

        const baseItem = {
          ...createEmptyObject(this.linesListItems),
          ...restAll,
          productName: isProduct ? name : productName,
          productCode: isProduct ? code : productCode,
          drawingNo: isProduct ? drawingNo : productDrawingNo,
          productsId: isProduct ? id : productsId,
          ...(isProduct ? {} : { procurementDemandPoolId: id })
        };

        if (!isProduct) {
          const num = this.jnpf.math('-', [planDemandQuantity || 0, orderedQuantity || 0]);
          baseItem.orderQuantity = num;
          baseItem.purchaseQuantity = num;
        }

        return baseItem;
      });

      this.linesList = [...this.linesList, ...newData];
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
          return `创建${ this.title }`
        case 'generate':
          return `生成${ this.title }`
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
        const { msg, data } = res
        if (msg === 'Success') {
          this.linesList = data.purchaseOrderLineVOList
          this.dataForm = Object.assign(this.dataForm, data)
          // 其他要求页签单独绑定 dataOtherForm，详情回显时需要从接口数据同步一次。
          this.dataOtherForm = Object.assign(this.dataOtherForm, {
            paymentTerms: data.paymentTerms || '',
            qualityRequirements: data.qualityRequirements || '',
            sealingCoverTyping: data.sealingCoverTyping || '',
            packagingRequirements: data.packagingRequirements || '',
            remark: data.remark || '',
          })
          this.loading = false
        }
      } catch ( err ) {
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
        // 旧逻辑：purchaseOrderLines: this.computedLinesList
        purchaseOrderLines: this.computedLinesList.map(this.stripLineMeta),
        flowData: this.flowData
      }
      let MSG = '提交成功'
      try {
        const res = await this.apiMethodActions[this.btnType](params)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch ( error ) {
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
      this.$unsavedGuard.set(false, this.$route.fullPath);
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
                      <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
                    </el-collapse-item>
                    <el-collapse-item class="productInfo"
                                      title="产品信息"
                                      name="productInfo">
                      <!-- 原逻辑：引用按钮单独占一行放在 TableForm_title 中。现在统一放到表格工具栏同一行展示。 -->
                      <TableForm-product
                        @input="contentChanges"
                        :value="computedLinesList"
                        :hasToolbar="false"
                        ref="tableForm"
                        :tableItems="linesListItems"
                        :btnType="btnType"
                        :hasActionbar="false"
                        :single="true"
                        :selectionChange="handleProductLineSelectionChange"
                        @currentChange="handleProductLineCurrentChange"
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
                              <template v-if="activeType && !isGenerate">
                                <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('product')">选择产品</el-button>
                                <span>|</span>
                                <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog">从需求单选择</el-button>
                                <span>|</span>
                                <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除</el-button>
                                <span>|</span>
                              </template>
                              <el-button type="text" icon="el-icon-view" @click="openProductReferenceDialog('currentSupplierPurchase')">当前供应商采购</el-button>
                              <span>|</span>
                              <el-button type="text" icon="el-icon-view" @click="openProductReferenceDialog('allSupplierPurchase')">所有供应商采购</el-button>
                              <span>|</span>
                              <!-- 原逻辑：<el-button type="text" icon="el-icon-plus" @click="openProductReferenceDialog('product')">选择产品</el-button> -->
                              <el-button type="text" icon="el-icon-view" @click="openProductReferenceDialog('quotation')">报价单</el-button>
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
                  <JNPF-col v-model="dataOtherForm" :tabContent="otherFormSchema" ref="dataOtherForm" :btnType="btnType"/>
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
      <ComSelect-page
        v-bind="productReferenceDialogProps"
        ref="ProductReferenceDialogRef"
        :element-show="false"
        @change="handleProductReferenceChange"
      >
        <template slot="table-action">
          <!-- 旧逻辑：使用 ComSelect-page 默认“选择”操作列。三个固定参考弹窗都只展示数据，不显示操作列。 -->
          <span></span>
        </template>
      </ComSelect-page>
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
