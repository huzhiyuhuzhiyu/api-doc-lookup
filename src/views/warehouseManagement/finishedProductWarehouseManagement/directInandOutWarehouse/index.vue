<script>
import * as _ from "highcharts";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import { getLocationList } from "@/api/warehouseManagement/inventory";
import { getcategoryTrees } from "@/api/salesManagement/assemblyOrders";
import { getBatchNumber, getCooperativeData, getWarehouseInfo, getWarehouseList } from "@/api/basicData";
import { addWarehouseData, detailWarehouseData, stockWarehouseBusinessTypeList, updateWarehouseData } from "@/api/warehouseManagement/inboundAndOutbound";
import PrintDialog from "@/components/no_mount/printDialog/index.vue";
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import { getPrintBusInfo } from "@/api/system/printDev";
import { getClassAttributeListByCode } from "@/api/masterDataManagement";
import { getBimProcessList } from "@/api/bimProcess";
import { getProductList } from "@/api/basicData/materialFiles";
import { standardizeFields } from "@/utils";


export default {
  name: "index",
  components: { BatchPrintBrowse, PrintDialog, TableFormProduct },
  mixins: [flowMixin, busFlow],
  props: {
    warehouseCode: {
      type: String,
      default: ''
    },
    autoInit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      title: '直接出入库单',
      btnType: '',
      loading: false,
      btnLoading: false,
      locationEnabled: false,
      printVisible: false,
      showScanDialog: false,
      scanLoading: false,
      printQuery: {},
      classAttributeList: [],
      businessTypeList: [],
      processList: [],
      dataForm: {
        approvalFlag: false,
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [],
      linesTableHeight: 0,
      addProductProps: {},

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],

      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
          await this.setBusinessTypeDefaults();
          await this.fetchClassAttributeList();
          await this.fetchProcessList();
          await this.fetchAndSetWarehouseInfo();
          await this.fetchBusinessTypeList();
        },
      },
      apiMethodActions: {
        edit: updateWarehouseData,
        add: addWarehouseData,
      },
      productFieldMap: {
        productName: ['productName', 'productsName', 'name'],
        productCode: ['productCode', 'productsCode', 'code'],
        productDrawingNo: ['productDrawingNo', 'productsDrawingNo', 'drawingNo'],
        productsId: ['productsId', 'productId', 'id'],
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    businessTypeConfig() {
      return {
        default: {
          print: { enabled: false, enCode: '', fullName: '' },
          defaultForm: {}
        },
        // 采购收货
        inbound_purchase: {
          print: { enabled: false, enCode: '', fullName: '' },
          defaultForm: {}
        },
        // 成品包装入库
        inbound_finished_package: {
          print: { enabled: true, enCode: '', fullName: '' },
          defaultForm: {
            sourceType: 'notice'
          }
        },
      }
    },
    businessConfig() {
      const defaultConfig = this.businessTypeConfig.default;
      return {
        ...defaultConfig,
        ...this.businessTypeConfig[this.dataForm.businessType] || {}
      };
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
    supplierFieldConfig() {
      switch ( this.dataForm.businessType ) {
        case 'inbound_purchase':
        case 'outbound_purchase':
        case 'inbound_other':
          return { label: '采购供应商', type: 'supplier', render: true };

        case 'outbound_external_send':
        case 'inbound_external':
          return { label: '外协供应商', type: 'outsourcing_suppliers', render: true };

        default:
          return { label: '供应商', type: 'supplier', render: false };
      }
    },
    showPrintButton() {
      const config = this.businessConfig.print || {};
      return config.enabled && this.activeType;
    },
  },
  // 菜单进入 走activated
  activated() {
    this.btnType = ''
    this.title = '直接出入库单'
    this.init('', 'add')
  },
  created() {
    this.autoInit && this.init('', 'add')
  },
  mounted() {
  },
  methods: {
    async init(id = '', type) {
      this.btnType = type
      this.title = this.getTitle(type)
      this.getBusInfo('b046')
      this.setBasicFormSchema()
      this.setLinesListItems()
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }

      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
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

    async fetchBusinessTypeList() {
      const { data } = await stockWarehouseBusinessTypeList(this.dataForm.warehouseId);
      const dictData = this.getDictDataSync('warehouseBusinessType');
      const businessTypeLabelMap = new Map(dictData.map(item => [item.value, item.label]));
      this.businessTypeList = data.records.map(item => ({
        label: businessTypeLabelMap.get(item.businessType) || item.businessType,
        value: item.businessType
      }))
      this.setBasicFormSchema()
      this.setLinesListItems()
    },

    async fetchClassAttributeList() {
      const { data } = await getClassAttributeListByCode({ code: this.warehouseCode });
      this.classAttributeList = data
    },

    async fetchProcessList() {
      const params = {
        orderItems: [{ asc: false, column: 'create_time' }],
        pageNum: -1,
        pageSize: -1,
      }
      const { data } = await getBimProcessList(params);
      this.processList = data.records.map(item => ({
        label: item.name,
        value: item.id
      }))
    },

    async fetchAndSetWarehouseInfo() {
      try {
        const { data: warehouses } = await getWarehouseList({ code: this.warehouseCode });
        if (!warehouses || warehouses.length === 0) {
          this.$message.error('未找到匹配的仓库');
        }

        const primaryWarehouse = warehouses[0];
        this.dataForm.warehouseName = primaryWarehouse.name;
        this.dataForm.warehouseId = primaryWarehouse.id;

        const { data: warehouseDetails } = await getWarehouseInfo(primaryWarehouse.id);
        this.wareHouseInfo = warehouseDetails;
        this.dataForm.warehouseType = warehouseDetails.type;
        this.locationEnabled = warehouseDetails.locationStatus !== 'disabled';
      } catch ( error ) {
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await detailWarehouseData(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = data.stockMove
          this.linesList = standardizeFields(data.lines, this.productFieldMap);
          await this.fetchClassAttributeList();
          await this.fetchProcessList();
          await this.fetchAndSetWarehouseInfo();
          await this.fetchBusinessTypeList();
          this.loading = false
        }
      } catch ( err ) {
        this.loading = false
      }
    },

    setBusinessTypeDefaults() {
      switch ( this.dataForm.businessType ) {
        case 'inbound_purchase':
        case 'inbound_external':
        case 'inbound_return_materials':
        case 'inbound_order_production':
        case 'inbound_production':
        case 'inbound_sale_return':
        case 'inbound_other':
          this.dataForm.documentType = 'inbound';
          this.getOrderNoConfig('RKDH')
          break;
        case 'outbound_sale_send':
        case 'outbound_purchase':
        case 'outbound_pick_out':
        case 'outbound_external_send':
        case 'outbound_other':
          this.dataForm.documentType = 'outbound';
          this.getOrderNoConfig('CKDH')
          break;
        default:
          this.dataForm.orderDate = this.jnpf.getToday();
      }
    },

    setBasicFormSchema() {
      const { label: supplierLabel, type: supplierType, render: supplierRender } = this.supplierFieldConfig;
      this.basicFormSchema = [
        {
          prop: "orderNo",
          label: "入库单号",
          value: "",
          type: "input",
          disabled: true,
          itemRules: [{ required: true, trigger: "blur" }],
        },
        {
          prop: "businessType",
          label: "业务类型",
          value: "",
          type: "select",
          options: this.businessTypeList,
          itemRules: [{ required: true, trigger: "blur" }],
          change: async () => {
            await this.setBusinessTypeDefaults();
            this.setAddProductProps()
            this.setBasicFormSchema()
            this.setLinesListItems()
          }
        },
        {
          prop: "supplierPartnerName",
          label: supplierLabel,
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: `选择${ supplierLabel }`,
          treeTitle: `${ supplierLabel }分类`,
          renderTree: true,
          multiple: false,
          clearable: true,
          methodArr: { method: getcategoryTrees, requestObj: { type: supplierType } },
          listMethod: getCooperativeData,
          tableItems: [
            { prop: 'code', label: '供应商编码' },
            { prop: 'name', label: '供应商名称' },
            { prop: 'nameEn', label: '英文名称' },
            { prop: 'taxId', label: '税号' }
          ],
          listRequestObj: {
            code: '',
            name: '',
            type: supplierType,
            partnerCategoryId: '',
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
            { prop: 'code', label: '供应商编码', type: 'input' },
            { prop: 'name', label: '供应商名称', type: 'input' }
          ],
          change: (id, data) => {
            // dom更新后重新校验此元素
            this.$nextTick(() => {
              this.$refs.dataForm.$refs.main.validateField('supplierPartnerName');
            });
            this.dataForm.supplierPartnerId = data[0].all.id;
            this.dataForm.supplierPartnerCode = data[0].all.code;
            this.dataForm.supplierPartnerName = data[0].all.name;
          },
          treeNodeClick: (data, node, listQuery) => {
            if (listQuery.partnerCategoryId === data.id) return listQuery
            listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
            listQuery.classAttribute = data.classAttribute
            return listQuery
          },
          render: supplierRender
        },
        {
          prop: "cooperativePartnerName",
          label: "客户",
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: '选择客户',
          treeTitle: '客户分类',
          renderTree: true,
          multiple: false,
          clearable: true,
          methodArr: { method: getcategoryTrees, requestObj: { type: 'customer' } },
          listMethod: getCooperativeData,
          tableItems: [
            { prop: 'code', label: '供应商编码' },
            { prop: 'name', label: '供应商名称' },
            { prop: 'nameEn', label: '英文名称' },
            { prop: 'taxId', label: '税号' }
          ],
          listRequestObj: {
            code: '',
            name: '',
            type: 'customer',
            partnerCategoryId: '',
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
            { prop: 'code', label: '供应商编码', type: 'input' },
            { prop: 'name', label: '供应商名称', type: 'input' }
          ],
          change: (id, data) => {
            // dom更新后重新校验此元素
            this.$nextTick(() => {
              this.$refs.dataForm.$refs.main.validateField('cooperativePartnerName');
            });
            this.dataForm.cooperativePartnerId = data[0].all.id;
            this.dataForm.cooperativePartnerCode = data[0].all.code;
            this.dataForm.cooperativePartnerName = data[0].all.name;
          },
          treeNodeClick: (data, node, listQuery) => {
            if (listQuery.partnerCategoryId === data.id) return listQuery
            listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
            listQuery.classAttribute = data.classAttribute
            return listQuery
          },
          render: [
            'inbound_finished_package',
            'inbound_sale_return',
            'outbound_sale_send'
          ].includes(this.dataForm.businessType)
        },
        {
          prop: "contractNo",
          label: "客户合同号",
          value: "",
          type: "input",
          render: ['outbound_sale_send'].includes(this.dataForm.businessType),
        },
        {
          prop: 'diffBatchNumFlag',
          label: '批次号生成规则',
          value: '',
          type: 'select',
          options: [
            { label: '产品生成同批次号', value: false },
            { label: '产品生成不同批次号', value: true }
          ],
          itemRules: [
            { required: true, trigger: 'change' }
          ],
          clearable: false,
          render: [
            'inbound_sale_return',
            'inbound_purchase',
            'inbound_external',
            'inbound_return_materials',
            'inbound_order_production',
            'inbound_production',
            'inbound_flip',
            'inbound_return'
          ].includes(this.dataForm.businessType),
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-list',
          itemDisabled: true,
          change: (val, data, paramsObj) => {
            this.$nextTick(() => {
              this.$refs['dataForm'].$refs.main.validateField('warehouseName')
            })
            if (!val && data.length) return
            if (data && data.length) {
              this.dataForm.warehouseId = data[0].id
              this.dataForm.warehouseName = data[0].name
              this.dataForm.warehouseType = data[0].all.type
              this.locationEnabled = data[0].all.locationStatus !== 'disabled'
            } else {
              this.dataForm.warehouseId = ''
              this.dataForm.warehouseName = ''
              this.dataForm.warehouseType = ''
            }
          },
          requestObj: { type: 'normal', state: 'enable' },
          dialogTitle: '选择仓库',
          method: getWarehouseList,
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          renderTree: false,
          searchList: [
            { prop: 'name', label: '库位名称', type: 'input' },
            { prop: 'code', label: '库位编码', type: 'input' }
          ],
          tableItems: [
            { prop: 'name', label: '库位名称' },
            { prop: 'code', label: '库位编码' },
            { prop: 'remark', label: '备注' }
          ],
          change: (val, data, paramsObj) => {
            if (!val && data.length) return
            if (data && data.length) {
              this.dataForm.shelfSpaceId = data[0].all.id
              this.dataForm.shelfSpaceName = data[0].all.name
              this.linesList = this.linesList.map(item => ({
                ...item,
                shelfSpaceId: data[0].all.id,
                shelfSpaceName: data[0].all.name,
                warehouseId: data[0].all.warehouseId,
                warehouseName: data[0].all.warehouseName
              }))
            } else {
              this.dataForm.shelfSpaceId = ''
              this.dataForm.shelfSpaceName = ''
              this.linesList = this.linesList.map(item => ({
                ...item,
                shelfSpaceId: '',
                shelfSpaceName: '',
                warehouseId: '',
                warehouseName: ''
              }))
            }
          },
          listRequestObj: {
            warehouseId: this.dataForm.warehouseId,
            pageNum: 1,
            pageSize: 20,
            orderItems: [{ asc: false, column: '' }, { asc: false, column: 'createTime' }],
            state: 'enable'
          },
          dialogTitle: '选择库位',
          listMethod: getLocationList,
          render: this.locationEnabled
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          value: 'qualified',
          type: 'select',
          options: [
            { label: '合格', value: 'qualified' },
            { label: '待检验', value: 'unInspect' }
          ],
          clearable: false,
          render: ['inbound'].includes(this.dataForm.documentType),
          itemRules: [
            { required: true, trigger: 'change' }
          ]
        },
        {
          prop: "orderDate",
          label: "单据日期",
          value: this.jnpf.getToday(),
          type: "date",
          itemRules: [{ required: true, trigger: "change" }],
        },
        {
          prop: "remark",
          label: "备注",
          value: "",
          type: "textarea",
          sm: 24
        }
      ]
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.$refs.dataForm.setDefaultValue()
        this.refreshTableHeight()
      })
    },

    setAddProductProps() {
      const baseConfig = {
        title: '选择产品',
        activeType: '',
        treeTitle: '产品分类',
        multiple: true,
        renderTree: false,
        searchList: [
          { prop: 'productCode', label: '产品编码', type: 'input' },
          { prop: 'productName', label: '产品名称', type: 'input' },
          { prop: 'productDrawingNo', label: '产品型号', type: 'input' }
        ],
        listRequestObj: {
          productName: '',
          productCode: '',
          productDrawingNo: '',
          pageNum: 1,
          pageSize: 20,
          classAttributeList: this.classAttributeList,
          orderItems: [
            { asc: false, column: '' },
            { asc: false, column: 't1.create_time' }
          ]
        },
      };

      const commonTableItems = [
        { prop: 'productCode', label: '产品编码', minWidth: 120 },
        { prop: 'productName', label: '产品名称', minWidth: 160 },
        { prop: 'productDrawingNo', label: '产品型号', minWidth: 300 },
        { prop: 'mainUnit', label: '单位', width: 120, sortable: 'custom' },
      ];

      const outboundConfig = {
        listMethod: getBatchNumber,
        tableItems: [
          ...commonTableItems,
          {
            prop: 'partnerName', label: '供应商名称', minWidth: 160,
            render: this.dataForm.businessType === 'outbound_pick_out'
          },
          { prop: 'inventoryQuantity', label: '库存数量', width: 160 },
          { prop: 'availableQuantity', label: '可用库存数量', width: 160 },
          { prop: 'occupancyQuantity', label: '占用库存数量', width: 160 },
          { prop: 'shelfSpaceName', label: '库位', width: 120 },
          { prop: 'batchNumber', label: '批次号', width: 180 },
          { prop: 'remark', label: '备注', width: 100 }
        ],
        listRequestObj: {
          productName: '',
          productCode: '',
          productDrawingNo: '',
          pageNum: 1,
          pageSize: 20,
          classAttributeList: this.classAttributeList,
          warehouseId: this.dataForm.warehouseId,
          availableBatch: true,
          inventoryFlag: 'stock_gt_zero',
          scrapFlag: false,
          virtuallyFlag: false,
          excludeProcessFlag: ['outbound_sale_send'].includes(this.dataForm.businessType) ? true : null,
          orderItems: [
            { asc: false, column: '' },
            { asc: false, column: 't1.create_time' }
          ]
        }
      };

      const inboundConfig = {
        listMethod: getProductList,
        tableItems: commonTableItems,
        listRequestObj: {
          productName: '',
          productCode: '',
          productDrawingNo: '',
          pageNum: 1,
          pageSize: 20,
          classAttributeList: this.classAttributeList,
          orderItems: [
            { asc: false, column: '' },
            { asc: false, column: 't1.create_time' }
          ]
        },
        listDataFormatting: (res) => {
          return res.data.records.map(item => ({
            ...item,
            productCode: item.code,
            productName: item.name,
            productDrawingNo: item.drawingNo,
            num: ''
          }));
        }
      };

      const defaultConfig = {
        listMethod: getProductList,
        tableItems: commonTableItems
      };

      const dynamicConfig =
        this.dataForm.documentType === 'outbound' ? outboundConfig :
          this.dataForm.documentType === 'inbound' ? inboundConfig :
            defaultConfig;

      this.addProductProps = { ...baseConfig, ...dynamicConfig };
    },

    setLinesListItems() {
      const getRealRowIndex = (index) => {
        let result = 0
        for (let i = 0; i < index[0]; i++) {
          result++
          result += this.linesList[i].children.length
        }
        return result + index[1]
      }
      const validErrorMessage = (...args) => {
        let [label, errMsg, index] = args
        if (Array.isArray(index)) index = getRealRowIndex(index)
        this.$message.error(`产品信息第${ index + 1 }行：${ label }${ errMsg }`)
      }

      this.linesListItems = [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          renderTree: false,
          searchList: [
            { prop: 'name', label: '库位名称', type: 'input' },
            { prop: 'code', label: '库位编码', type: 'input' }
          ],
          tableItems: [
            { prop: 'name', label: '库位名称' },
            { prop: 'code', label: '库位编码' },
            { prop: 'remark', label: '备注' }
          ],
          beforeSubmit: (data, paramsObj) => {
            const groupKey = paramsObj.scope.row.noticeLineId || paramsObj.scope.row.ordersLineId
            if (this.linesList.some(item => item.shelfSpaceId === data.id && (item.noticeLineId || item.ordersLineId) === groupKey)) {
              this.$message.error('同一来源产品的入库库位不能重复！')
              return false
            }
            return true
          },
          change: (val, data, paramsObj) => {
            const { scope } = paramsObj;
            const fieldPath = `data.${ scope.$index }.shelfSpaceName`;
            this.$nextTick(() => {
              this.$refs.tableForm?.$refs.main?.validateField(fieldPath);
            });
            const index = scope.$index;
            const selectedShelfSpace = data[0].all;
            this.linesList[index].shelfSpaceName = selectedShelfSpace.name
            this.linesList[index].shelfSpaceId = selectedShelfSpace.id
            this.linesList[index].warehouseId = selectedShelfSpace.warehouseId
          },
          listRequestObj: {
            warehouseId: this.dataForm.warehouseId,
            pageNum: 1,
            pageSize: 20,
            orderItems: [{ asc: false, column: '' }, { asc: false, column: 'createTime' }],
            state: 'enable'
          },
          dialogTitle: '选择库位',
          listMethod: getLocationList,
          width: '180',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['', (...args) => validErrorMessage('库位', ...args)]
              }), trigger: 'no'
            },
            { required: true, trigger: 'no' }
          ],
          render: this.locationEnabled
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          minWidth: 170,
          options: this.getDictDataSync('packaging'),
          // render: ['inbound_finished_package'].includes(this.dataForm.businessType)
        },
        {
          prop: 'processId',
          label: '工序',
          type: 'select',
          minWidth: 170,
          options: this.processList,
          // render: ['inbound_finished_package'].includes(this.dataForm.businessType)
        },
        {
          prop: 'num',
          label: `数量`,
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '数量不能为0', (...args) => validErrorMessage('数量', ...args)), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['数量不能为0', (...args) => validErrorMessage('数量', ...args)]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (...args) => validErrorMessage('数量', ...args)]
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
      ]
      this.$nextTick(() => {
        this.$refs.tableForm.setDefaultValue()
        this.$refs.tableForm.$refs.tableRef.doLayout()
      })
    },

    async getOrderNoConfig(code) {
      const { number } = await this.$store.dispatch('base/getOrderNoConfig', code)
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

    async handleScanSubmit(scanCode) {
      this.scanLoading = true
      try {
        const params = {
          productCode: scanCode,
          classAttributeList: this.classAttributeList,
          orderItems: [
            {
              asc: false,
              column: 'create_time'
            }
          ],
          pageNum: 1,
          pageSize: 20,
        }
        const res = await getProductList(params)
        const product = res.data.records[0]
        if (!product) return this.$message.warning('未找到匹配的产品信息')
        this.submitAllProduct([product.id], [{
          id: product.id,
          name: product.name,
          all: product
        }])
      } catch ( error ) {
        console.error('扫码处理失败:', error)
        this.$message.error('扫码处理失败')
      } finally {
        this.scanLoading = false
      }
    },

    selectProductRefOpenDialog() {
      this.$refs.ComSelectProductRef.openDialog()
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    submitAllProduct(id, data) {
      const newData = data.map(item => {
        const standardizedData = standardizeFields(item.all, this.productFieldMap);

        return {
          ...this.createdObj(),
          ...standardizedData,
        };
      });

      this.linesList = [...this.linesList, ...newData];
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

    summaryMethod(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.type === 'index') {
          return sums[index] = '合计'
        } else if (![
          'num',
          'undeliveredQuantity',
          'taxAmount',
          'totalAmount'
        ].includes(column.property)) {
          return sums[index] = ' '
        }
        const values = data.map(item => Number(item[column.property]))
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return this.jnpf.math('add', [prev, curr])
          } else {
            return prev
          }
        }, 0)
      })
      return sums
    },

    closePrint() {
      this.printVisible = false
    },

    printView(row) {
      this.selectedRow = [row]
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.businessConfig.print.enCode)
      })
    },

    async printOrder(enCode) {
      try {
        const res = await getPrintBusInfo(enCode)
        if (!res.data) {
          return this.$message.warning('未找到相应打印模版')
        }
        const id = res.data.id
        const printData = this.selectedRow.map(item => ({
          formId: item.id,
          id: id
        }))
        this.$refs.batchPrint.print(printData);
      } catch ( e ) {
      }
    },

    async handleSubmit(isPrint = false, type = '') {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false

      this.dataForm.documentStatus = type

      const deepParams = _.merge({}, this.dataForm, this.businessConfig.defaultForm);
      const needDiffBatchNumFlagBusinessTypes = [
        'inbound_sale_return',
        'inbound_purchase',
        'inbound_external',
        'inbound_return_materials',
        'inbound_order_production',
        'inbound_production',
        'inbound_flip',
        'inbound_return'
      ];
      if (!needDiffBatchNumFlagBusinessTypes.includes(deepParams.businessType)) {
        delete deepParams.diffBatchNumFlag;
      }

      const newLines = this.computedLinesList

      const params = {
        stockMove: deepParams,
        lines: newLines,
        spaceLines: newLines,
        flowData: this.flowData
      }

      let MSG = '提交成功'
      try {
        const apiMethod = this.apiMethodActions[this.btnType]
        const res = await apiMethod(params)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          if (isPrint) return this.printView(this.dataForm)
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
        this.init('', 'add')
      }
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header :class="btnType === 'add' ? 'el-page-header_left_none' : '' " @back="$emit('close',false)" :content="title"/>
        <div class="options">
          <template v-if="activeType">
            <el-button type="success" :loading="btnLoading" @click="handleSubmit(false,'draft')">
              保存草稿
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit(false,'submit')">
              保存并提交
            </el-button>
            <el-button v-if="showPrintButton" type="primary" :loading="btnLoading" @click="handleSubmit(true,'')">
              提交并打印
            </el-button>
          </template>
          <el-button v-if="btnType !== 'add'" @click="$emit('close',false)">{{ $t('common.cancelButton') }}</el-button>
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
                  ref="tableForm"
                  :tableItems="linesListItems"
                  :btnType="btnType"
                  :hasActionbar="false"
                  :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: btnType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                        summaryMethod,
                        'show-summary': true
                      }">
                  <template slot="top">
                    <div class="tableTopContainer">
                      <div class="left">
                        <template v-if="activeType">
                          <el-button :disabled="!dataForm.businessType" type="text" icon="icon-ym icon-ym-scanCode1" @click="showScanDialog = true">
                            扫码录入
                          </el-button>
                          <span>|</span>
                          <el-button :disabled="!dataForm.businessType" type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog()">
                            选择产品
                          </el-button>
                          <span>|</span>
                          <el-button :disabled="!dataForm.businessType" type="text" icon="el-icon-delete" class="JNPF-table-delBtn"
                                     @click="$refs.tableForm.batchDelete()">批量删除
                          </el-button>
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
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
      <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
                   :printQuery="printQuery" :enCode="businessConfig.print.enCode" ref="printTemplate"/>
      <BatchPrintBrowse ref="batchPrint" :fullName="businessConfig.print.fullName"/>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false"
                      @change="submitAllProduct"/>
      <scanInputDialog
        :visible.sync="showScanDialog"
        :loading="scanLoading"
        @close="showScanDialog  = false"
        @submit="handleScanSubmit"
      />
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
