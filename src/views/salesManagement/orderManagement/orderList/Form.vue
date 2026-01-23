<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { createEmptyObject, deepClone } from "@/utils";
import { getBasicFormSchema } from "./data";
import { getcategoryTree } from "@/api/basicData/materialSettings";
import { getOrganization } from "@/api/permission/user";
import { getOrganizeInfo } from "@/api/permission/organize";
import { addOrders, editOrders, getcooperativeProduct, getOrderDetail, getOrderNumberByCode, uploadProduct } from "@/api/salesManagement/assemblyOrders";
import { getProducts } from "@/api/masterDataManagement";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import TypingEditorDialog from './typingEditDialog.vue'
import RecordList from "@/views/workFlow/components/RecordList.vue";
import Process from "@/components/Process/index.vue";
import { getBusinessComponent, getBusinessComponentPage } from "@/api/assemblyMaintenance";

export default {
  name: "Form",
  components: { Process, RecordList, TableFormProduct, TypingEditorDialog },
  mixins: [flowMixin, busFlow],
  props: {
    fromPage: {
      type: String,
      default: "form",
    }
  },
  data() {
    return {
      title: '销售订单',
      btnType: '',
      isOrderNoEditable: false,
      loading: false,
      btnLoading: false,
      uploadVisible: false,
      showDialog: false,
      departments: [],
      salesList: [],
      globalPackagingMethod: '',
      globalBrand: '',
      originalFormData: {},
      dataForm: {
        orderNo: '',
        orderType: 'normal',
        departments: [],
        cooperativePartnerId: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        departmentId: '',
        salesId: '',
        orderDate: moment(new Date()).format('YYYY-MM-DD'),
        deliveryDate: '',
        remark: '',
        remark1: '',
      },
      extraFormData: {},
      fileList: [],
      basicFormSchema: [],
      linesList: [],
      formLinesListItems: [
        {
          prop: 'customerProductNo',
          label: '客户料号',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'customerProductName',
          label: '客户产品名称',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'drawingNo',
          label: '型号',
          type: 'input',
          remote: true,
          minWidth: 200,
          remoteMethod: this.drawingNoFetchSuggestions,
          select: (item, scope) => this.drawingSelect(item, scope),
        },
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
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'num',
          label: '数量',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '数量不能为0', (errMsg, rowIndex) => {
                this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['数量不能为空', (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：数量${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            { required: true, message: '数量不能为空', trigger: ['blur', 'change'], },
          ]
        },
        {
          prop: 'price',
          label: '单价(含税)',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate('noZero', '单价(含税)不能为0', (errMsg, rowIndex) => {
                this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['单价(含税)不能为空', (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：单价(含税)${ errMsg }`)
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
          prop: 'targetPrice',
          label: '目标价',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '目标价不能为0', (errMsg, rowIndex) => {
                this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            // {
            //   validator: this.formValidate({
            //     type: 'noEmtry', params: ['目标价不能为空', (errMsg, rowIndex) => {
            //       this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
            //     }]
            //   }), trigger: 'blur',
            // },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：目标价${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            { required: false, message: '目标价不能为空', trigger: ['blur', 'change'], },
          ]
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'date',
          minWidth: 180,
          itemRules: [
            { required: true, message: '交货日期不能为空', trigger: 'change', },
          ]
        },
        {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging'),
          minWidth: 170,
        },
        {
          prop: 'specialRequire',
          label: '包装要求',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'clearance',
          label: '品牌',
          type: 'select',
          options: this.getDictDataSync('brand'),
          minWidth: 150,
        },
        {
          prop: 'oil',
          label: '机型',
          type: 'input',
          minWidth: 150,
        },
        {
          prop: 'accuracyLevel',
          label: '制令号',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'vibrationLevel',
          label: '图纸版本号',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input',
          minWidth: 180,
        }
      ],
      confLinesListItems: [
        {
          prop: 'drawingNo',
          label: '产品型号',
          type: 'view',
        },
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
          prop: 'customerProductNo',
          label: '客户料号',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'customerProductName',
          label: '客户产品名称',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'cgzt',
          label: '采购状态',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'deliveryStatus',
          label: '交期状态',
          type: 'select',
          options: this.global.deliveryStatus,
          minWidth: 160,
        },
        {
          prop: 'deliveryDate',
          label: '计划交期',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'feedbackDeliveryDate',
          label: '反馈交期',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'kcap',
          label: '库存安排',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'zt',
          label: '状态',
          type: 'view',
          minWidth: 120,
        },
      ],
      linesListItems: [],
      linesTableHeight: 0,
      uploadProduct,
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
        listMethod: getcooperativeProduct,
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
          await this.getOrderNoConfig('KHDD');
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        copy: async (id) => {
          await this.getDetail(id);
          await this.getOrderNumberByCode();
        },
        default: async () => {
          await this.getOrderNoConfig('KHDD');
        },
      },
      apiMethodActions: {
        add: addOrders,
        copy: addOrders,
        edit: editOrders,
      },

      productRefConfigs: {
        customer: {
          title: '选择客户产品',
          renderTree: false,
          tableItems: [
            { prop: 'customerProductNo', label: '客户料号', fixed: 'left' },
            { prop: 'customerProductName', label: '客户产品名称', fixed: 'left' },
            { prop: 'customerProductDrawingNo', label: '客户型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'productCode', label: '产品编码', sortable: 'custom' },
            { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', minWidth: '220px', sortable: 'custom' }
          ],
          searchList: [
            { prop: 'customerProductDrawingNo', label: '客户型号', type: 'input' },
            { prop: 'drawingNo', label: '型号', type: 'input' },
          ],
          listRequestObj: (partnerId) => ({
            partnerId,
            partnerType: 'customer',
            productCode: "",
            productName: "",
            productStatus: 'enable',
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              { asc: false, column: '' },
              { asc: false, column: 'create_time' }
            ]
          }),
          listMethod: getcooperativeProduct,
          mapItem: (item) => ({
            ...item,
            productsId: item.productsId,
            cooperativePartnerProductId: item.id,
            productName: item.customerProductName || item.name,
            productCode: item.productCode || item.code,
            drawingNo: item.customerProductDrawingNo || item.drawingNo,
          })
        },
        product: {
          title: '选择产品',
          renderTree: true,
          tableItems: [
            { prop: 'drawingNo', label: '型号', minWidth: '180px', sortable: 'custom' },
            { prop: 'name', label: '产品名称', minWidth: '180px', sortable: 'custom' },
            { prop: 'code', label: '产品编码', minWidth: '180px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', minWidth: '90px', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', minWidth: '220px', sortable: 'custom' }
          ],
          searchList: [
            { prop: 'drawingNo', label: '型号', type: 'input' },
            { prop: 'name', label: '产品名称', type: 'input' },
          ],
          listRequestObj: () => ({
            productCode: "",
            productName: "",
            productStatus: 'enable',
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              { asc: false, column: '' },
              { asc: false, column: 'create_time' }
            ]
          }),
          listMethod: getProducts,
          mapItem: (item) => ({
            ...item,
            productsId: item.id,
            cooperativePartnerProductId: undefined,
            productName: item.name,
            productCode: item.code,
            drawingNo: item.drawingNo,
          })
        },
        assemblingUnit: {
          title: '选择组合件',
          multiple: false,
          renderTree: false,
          tableItems: [
            { prop: 'name', label: '机型', minWidth: '180px' },
            { prop: 'cooperativePartnerCode', label: '客户编码', minWidth: '180px', sortable: 'custom' },
            { prop: 'cooperativePartnerName', label: '客户名称', minWidth: '180px', sortable: 'custom' },
          ],
          searchList: [
            { prop: 'name', label: '机型', type: 'input' },
          ],
          listRequestObj: () => ({
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              { asc: false, column: '' },
              { asc: false, column: 'create_time' }
            ]
          }),
          listMethod: getBusinessComponentPage,
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
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
          this.calcTotalAmount(item.price, item.num),  // 使用num字段
          2
        );
        // 计算不含税金额 = 数量 × 不含税单价
        const excludingTaxAmount = this.jnpf.numberFormat(
          this.calcExcludingTaxAmount(item.price, item.num, item.taxRate),
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
      return this.computedLinesList.reduce((sum, item) => sum + (parseFloat(item.num) || 0), 0);
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
  created() {
    this.$unsavedGuard.set(true, this.$route.fullPath);
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type) {
      this.btnType = type
      this.title = this.getTitle(type)
      this.getBusInfo('b025')
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.updateLinesListItems()
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    updateLinesListItems() {
      const { formLinesListItems, confLinesListItems, fromPage } = this
      this.linesListItems = fromPage === 'form' ? formLinesListItems : confLinesListItems
      this.$nextTick(() => {
        this.$refs.tableForm.setDefaultValue()
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

    handleTypingEditorConfirm(data) {
      this.linesList = this.linesList.map((item, index) => ({
        ...item,
        sealingCoverTyping: data[index]?.sealingCoverTyping
      }));
    },

    globalChange(val, prop) {
      this.linesList.forEach(item => {
        item[prop] = val;
      });
    },

    importProduct() {
      if (!this.dataForm.cooperativePartnerId) {
        return this.$message.error("请先选择客户");
      }
      this.extraFormData = {
        partnerId: this.dataForm.cooperativePartnerId,
      }
      if (this.linesList.length) {
        const hasExistingProducts = this.linesList.some(item => item.id);
        if (hasExistingProducts) {
          this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' })
            .then(() => {
              this.uploadVisible = true
            })
            .catch(() => {
            });
        } else {
          this.uploadVisible = true;
        }
      }
    },

    importDataSuccess(res, file, fileList) {
      if (!res.data) {
        this.$message.success(`导入成功`)
        this.uploadVisible = false
      } else {
        this.uploadVisible = false
        this.handleMessage(res.data)
      }
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h(
          'div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在产品标准工时相关信息错误！'),
            h(
              'el-button',
              {
                props: {
                  type: 'text',
                  size: 'mini',
                  icon: 'el-icon-download'
                },
                on: {
                  click: () => {
                    this.downNoProduct(data)
                  }
                },
                style: {
                  border: 'none',
                  textAlign: 'center',
                  // width:"20%",
                  margin: '0 5px 0 5px '
                }
              },
              '下载导入错误数据'
            )
          ]
        )
      })
    },

    async drawingSelect(item, scope) {
      const {
        drawingNo,
        mainUnit,
        ratio,
        classAttribute,
        calculationDirection,
        id,
        name,
        code,
        customerProductNo,
        taxRate
      } = item;
      Object.assign(this.linesList[scope.$index], {
        productDrawingNo: drawingNo,
        mainUnit,
        ratio,
        classAttribute,
        calculationDirection,
        productsId: id,
        productName: name,
        productCode: code,
        customerProductNo,
        taxRate,
      });
    },

    async drawingNoFetchSuggestions(queryString, cb) {
      try {
        const params = {
          productDrawingNo: queryString,
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
        }
        const response = await getProducts(params)
        const suggestions = response.data.records.map(item => ({
          value: item.drawingNo,
          ...item
        }))
        cb(suggestions)
      } catch ( error ) {
        console.error('Error fetching suggestions:', error)
        cb([])
      }
    },

    async getOrderNumberByCode() {
      try {
        const { data } = await getOrderNumberByCode(this.dataForm.orderNo)
        this.isOrderNoEditable = true
        this.dataForm.orderNo = data
      } catch ( e ) {
      }
    },

    async getOrderNoConfig(code) {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', code)
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.btnType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },

    async fetchDepartment() {
      const res = await getOrganizeInfo(this.dataForm.departmentId);
      this.dataForm.departments = [...res.data.organizeIdTree, this.dataForm.departmentId]
      await this.$nextTick()
      this.$refs.tableForm.setDefaultValue()
    },

    async fetchOrganization() {
      try {
        const params = {
          keyword: "",
          organizeId: this.dataForm.departmentId
        };
        const res = await getOrganization(params);
        this.salesList = res.data?.length
          ? res.data.map(item => ({
            ...item,
            label: item.fullName?.split('/')[0] || '',
            value: item.id
          }))
          : [];
      } finally {
        this.loading = false
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

    addLineForm() {
      this.linesList.push(createEmptyObject(this.linesListItems));
    },

    selectProductRefOpenDialog(type) {
      const config = this.productRefConfigs[type];
      if (!config) {
        console.warn(`Unsupported productRefType: ${ type }`);
        return;
      }

      if (type === 'customer' && !this.dataForm.cooperativePartnerId) {
        return this.$message.error("请先选择客户");
      }

      const baseListRequestObj = {
        productCode: "",
        productName: "",
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          { asc: false, column: '' },
          { asc: false, column: 'create_time' }
        ]
      };

      const listRequestObj = config.listRequestObj(
        type === 'customer' ? this.dataForm.cooperativePartnerId : undefined
      );

      this.addProductProps = {
        ...this.addProductProps,
        title: config.title,
        renderTree: config.renderTree,
        tableItems: config.tableItems,
        searchList: config.searchList,
        listMethod: config.listMethod,
        listRequestObj
      };

      if (type !== 'customer') {
        delete this.addProductProps.listRequestObj.partnerId;
        delete this.addProductProps.listRequestObj.partnerType;
      }

      this.productRefType = type;
      this.$refs.ComSelectProductRef.openDialog();
    },
    deleteLines(scope) {
      this.linesList.splice(scope.$index, 1)
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    async submitAllProduct(id, data) {
      const type = this.productRefType;
      const config = this.productRefConfigs[type];

      if (!config) {
        console.warn(`No config for productRefType: ${ type }`);
        return;
      }

      if (type === 'customer' || type === 'product') {
        const newData = data.map(item => {
          const base = createEmptyObject(this.linesListItems);
          const mapped = config.mapItem(item.all);
          return {
            ...base,
            ...mapped,
            taxRate: '13',
          };
        });
        this.linesList = [...this.linesList, ...newData];
        return;
      }

      if (type === 'assemblingUnit') {
        this.loading = true;
        try {
          const selectedItem = data[0]?.all;
          if (!selectedItem) {
            this.$message.warning('未选择有效的组合件');
            return;
          }

          const res = await getBusinessComponent(selectedItem.id);
          const { businessComponentLineList } = res.data

          const newLines = businessComponentLineList.map(sub => {
            const base = createEmptyObject(this.linesListItems);
            return {
              ...base,
              productName: sub.productsName,
              productCode: sub.productsCode,
              drawingNo: sub.productsDrawingNo,
              oil: selectedItem.name,
              taxRate: '13',
            };
          });

          this.linesList = [...this.linesList, ...newLines];
        } catch ( error ) {
          this.$message.error('加载组合件明细失败');
        } finally {
          this.loading = false;
        }
      }
    },

    getTitle(type) {
      switch ( type ) {
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
        const res = await getOrderDetail(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = Object.assign(this.dataForm, data.order)
          this.originalFormData = deepClone(this.dataForm)
          this.fileList = this.fileListMap('', data.attachmentList)
          this.linesList = data.orderLines
          await this.fetchDepartment()
          await this.fetchOrganization()
        }
      } catch ( err ) {
        this.loading = false
      }
    },

    fileListMap(type, fileList) {
      if (!fileList && !fileList?.length) return
      if (['submit', 'draft'].includes(type)) {
        return fileList.map((item, index) => ({
          ...item,
          bimAttachments: {
            businessType: '',
            configKey: '',
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        }))
      } else {
        return fileList.map((item, index) => ({
          ...item,
          name: item.document.fullName,
          fileSize: item.document.fileSize,
          filename: item.document.filePath,
          id: item.document.id,
          url: item.url
        }))
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
      const deepParams = deepClone(this.dataForm)
      const attachmentList = this.fileListMap(type, this.fileList)
      const params = {
        order: deepParams,
        orderLineList: this.computedLinesList,
        attachmentList: attachmentList,
        flowData: this.flowData
      }
      if (this.btnType === 'copy') {
        params.order.id = ''
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
      this.$emit('close', this.activeType);
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header @back="$emit('close',false)" :content="title"/>
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
              <el-collapse-item
                class="productInfo"
                title="产品信息"
                name="productInfo"
              >
                <div class="TableForm_title">
                </div>
                <TableForm-product
                  @input="contentChanges"
                  :value="computedLinesList"
                  :hasToolbar="false"
                  ref="tableForm"
                  :tableItems="linesListItems"
                  :btnType="btnType"
                  @deleteth="deleteLines"
                  :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: activeType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }">
                  <template slot="top">
                    <div class="tableTopContainer">
                      <div class="left">
                        <template v-if="activeType">
                          <el-button type="text" icon="el-icon-plus" @click="addLineForm">新增一行</el-button>
                          <span>|</span>
                          <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('customer')">选择客户产品</el-button>
                          <span>|</span>
                          <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('product')">选择产品</el-button>
                          <span>|</span>
                          <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('assemblingUnit')">选择组合件</el-button>
                          <span>|</span>
                          <el-button type="text" icon="el-icon-plus" @click="importProduct">导入产品</el-button>
                          <span>|</span>
                          <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除</el-button>
                        </template>
                      </div>
                      <div class="right">
                        <template v-if="activeType">
                          <el-button type="text" icon="el-icon-edit" @click="showDialog = true">打字内容</el-button>
                          <el-form class="height-full" inline label-width="60px" v-if="linesList.length">
                            <el-form-item label="包装">
                              <el-select v-model="globalPackagingMethod" placeholder="包装"
                                         @change="(val) => globalChange(val,'packagingMethod')"
                                         style="width: 80px">
                                <el-option v-for="item in getDictDataSync('packaging')" :key="item.value"
                                           :label="item.label" :value="item.value"/>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="品牌">
                              <el-select v-model="globalBrand" placeholder="品牌"
                                         @change="(val) => globalChange(val,'clearance')"
                                         style="width: 100px">
                                <el-option v-for="item in getDictDataSync('brand')" :key="item.value"
                                           :label="item.label" :value="item.value"/>
                              </el-select>
                            </el-form-item>
                          </el-form>
                        </template>
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
          <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId"
                     style="margin-top: 5px;"/>
          </el-tab-pane>
          <el-tab-pane v-if="!activeType && dataForm.approvalFlag" label="流转记录"
                       name="transferList">
            <recordList :list='flowTaskOperatorRecordList' :endTime='endTime'/>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="fileList" :disabled="!activeType" :detailed="!activeType"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @change="submitAllProduct"/>
      <TypingEditorDialog
        :visible.sync="showDialog"
        :linesFormList="linesList"
        @confirm="handleTypingEditorConfirm"
      />
      <!--  导入-->
      <UploadImportData ref="uploadRef" v-if="uploadVisible" :extraFormData="extraFormData" :uploadApi="uploadProduct" @success="importDataSuccess"
                        @close="uploadVisible = false" templateDownLoadPath="/static/销售订单导入模板.xlsx"/>
    </div>
  </transition>
</template>
