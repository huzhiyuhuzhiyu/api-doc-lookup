<script>
import * as _ from "highcharts";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import { getQuotationsendlist } from "@/api/salesManagement";
import { getLocationList } from "@/api/warehouseManagement/inventory";
import { getcategoryTrees, getsaleOrderDetailList } from "@/api/salesManagement/assemblyOrders";
import { getBatchNumber, getCooperativeData, getWarehouseInfo, getWarehouseList } from "@/api/basicData";
import { dataProcessor } from "./data";
import { addWarehouseData, updateWarehouseData } from "@/api/warehouseManagement/inboundAndOutbound";
import PrintDialog from "@/components/no_mount/printDialog/index.vue";
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import { getPrintBusInfo } from "@/api/system/printDev";
import { getpurPurchaseReceiptReturnGoodsdetail } from "@/api/purchasingManagement/purchaseInquirySheet";
import { standardizeFields } from "@/utils";


export default {
  name: "OutboundForm",
  components: { BatchPrintBrowse, PrintDialog, TableFormProduct },
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '出库单',
      btnType: '',
      loading: false,
      btnLoading: false,
      locationEnabled: false,
      printVisible: false,
      printQuery: {},
      classAttributeList: [],
      warehouseCode: '',
      businessType: '',
      dataForm: {
        approvalFlag: false,
        sourceType: 'notice',
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [],
      linesTableHeight: 0,
      addProductProps: {
        title: '选择产品',
        activeType: '',
        renderTree: false,
        multiple: true,
        treeTitle: '产品分类',
        methodArr: {},
        listMethod: getsaleOrderDetailList,
        tableItems: [
          { prop: 'orderNo', label: '订单号', minWidth: '220px', sortable: 'custom' },
          { prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom' },
          { prop: 'productCode', label: '产品编码', sortable: 'custom' },
          { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
          { prop: 'mainUnit', label: '单位', sortable: 'custom' },
          { prop: 'waitDeliverNum', label: '待发货数量', minWidth: '160px', sortable: 'custom' },
          { prop: 'deliveryDate', label: '交货日期', minWidth: '160px', sortable: 'custom' },
          { prop: 'remark', label: '备注', minWidth: '160px' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom' }
        ],
        listRequestObj: {
          cooperativePartnerId: '',
          deliverQueryFlag: 1,
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
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async (data) => {
          this.defaultInit(data);
          await this.getOrderNoConfig();
        },
      },
      apiMethodActions: {
        edit: updateWarehouseData,
        add: addWarehouseData,
      },
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    businessTypeConfig() {
      return {
        default: {
          fetchLines: null,
          dataPath: null,
          filter: null,
          formatter: null,
          showActions: { selectProduct: true, batchDelete: true },
          print: { enabled: false, enCode: '', fullName: '' },
          defaultForm: {}
        },
        // 采购退货
        outbound_purchase: {
          fetchLines: getpurPurchaseReceiptReturnGoodsdetail,
          dataPath: 'data.noticeLineList',
          filter: {
            classAttribute: this.classAttributeList
          },
          formatter: (item) => ({
            ...item,
            ordersId: item.purchaseOrderId,
            noticeId: item.purchaseReceiptReturnGoodsId,
          }),
          showActions: { selectProduct: true, batchDelete: true },
          print: { enabled: false, enCode: '', fullName: '' },
          defaultForm: {}
        },
      }
    },
    businessConfig() {
      const defaultConfig = this.businessTypeConfig.default;
      const businessConfig = this.businessTypeConfig[this.businessType] || {};

      return _.merge({}, defaultConfig, businessConfig);
    },
    hasC() {
      const actions = this.businessConfig.showActions || {};
      return actions.batchDelete;
    },
    showPrintButton() {
      const config = this.businessConfig.print || {};
      return config.enabled && this.activeType;
    },
    outboundLabel() {
      if (['outbound_sale_send', 'outbound_sale_exchange'].includes(this.businessType)) {
        return '发货'
      }
      if (this.businessType === 'outbound_external_send') {
        return '发料'
      }
      if (['outbound_purchase', 'outbound_external'].includes(this.businessType)) {
        return '退货'
      }
      if (this.businessType === 'outbound_pick_out') {
        return '领料'
      }

      return ''
    }
  },
  mounted() {
  },
  methods: {
    async init(params) {
      const { id, prefillData, btnType, businessType, classAttributeList, warehouseCode } = params;
      this.btnType = btnType
      this.classAttributeList = classAttributeList
      this.warehouseCode = warehouseCode
      this.businessType = businessType
      this.title = this.getTitle(btnType)
      this.getBusInfo('b045')

      if (id && this.actions[btnType]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(prefillData);
      }
      this.setBasicFormSchema()
      this.setLinesListItems()
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.refreshTableHeight()
      })
    },

    async defaultInit(prefillData) {
      this.dataForm = _.merge({}, this.dataForm, _.isArray(prefillData) ? prefillData[0] : prefillData);
      this.dataForm.sourceNo = _.isArray(prefillData) ? prefillData[0].orderNo : prefillData.orderNo;
      this.dataForm.businessType = this.businessType
      await this.fetchAndSetWarehouseInfo();

      if (_.isArray(prefillData)) {
        await this.processLinesData({
          lines: prefillData,
          config: {
            filter: this.businessConfig.filter,
            formatter: this.businessConfig.formatter
          }
        });
      } else {
        await this.fetchBusinessLines(prefillData);
      }
    },

    async processLinesData({ lines, config }) {
      try {
        if (!Array.isArray(lines)) {
          lines = [lines].filter(Boolean);
        }

        const standardizationRules = {
          sourceNo: { compute: (item) => this.dataForm.sourceNo || item.sourceNo },
          businessType: { value: this.businessType },
          productName: { from: ['productName', 'productsName'] },
          productCode: { from: ['productCode', 'productsCode'] },
          productDrawingNo: { from: ['productDrawingNo', 'drawingNo', 'productsDrawingNo'] },
          noticeLineId: { from: 'id' },
          costPrice: { from: 'price', transform: (value) => parseFloat(value) || 0 },
          taxRate: { from: 'taxRate', transform: (value) => value ? parseFloat(value) : null },
          excludingTaxCostPrice: {
            compute: (item) => {
              if (item.price && item.taxRate !== null) {
                return this.jnpf.math('divide', [item.price, 1 + item.taxRate / 100], 6);
              }
              return item.price || 0;
            }
          },
          totalAmount: {
            compute: (item) => this.jnpf.math('multiply', [item.num || 0, item.price || 0], 2)
          },
          taxAmount: {
            compute: (item) => {
              const taxPerUnit = this.jnpf.math(
                'subtract',
                [item.price || 0, item.excludingTaxCostPrice || 0]
              );
              return this.jnpf.math('multiply', [item.num || 0, taxPerUnit], 2);
            }
          },
          excludingTaxTotalAmount: {
            compute: (item) => this.jnpf.math('subtract', [item.totalAmount || 0, item.taxAmount || 0], 2)
          }
        };

        lines = standardizeFields(lines, standardizationRules);

        if (config.filter) {
          lines = dataProcessor.applyFilter(lines, config.filter);
        }

        let formattedLines = config.formatter
          ? lines.map(item => config.formatter(item))
          : lines;

        formattedLines = formattedLines.map(item => ({
          ...item,
          num: item.undeliveredQuantity,
        }));

        this.linesList = formattedLines;

      } catch ( error ) {
        console.error(`[${ this.businessType }] 数据处理失败:`, error);
        this.linesList = [];
      }
    },

    async fetchBusinessLines(data) {
      try {
        const response = await this.businessConfig.fetchLines(data.id);
        let lines = dataProcessor.extractData(response, this.businessConfig.dataPath);

        await this.processLinesData({
          lines: lines,
          config: {
            filter: this.businessConfig.filter,
            formatter: this.businessConfig.formatter
          }
        });

      } catch ( error ) {
        console.error(`[${ this.businessType }] 数据加载失败:`, error);
        this.linesList = [];
      }
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
        this.setBasicFormSchema()
        this.setLinesListItems()
      } catch ( error ) {
      }
    },

    calculateAmountFields(item) {
      // 计算价税合计
      item.totalAmount = this.jnpf.math(
        'multiply',
        [item.num, item.price || 0],
        2
      );

      // 计算税额
      const taxPerUnit = this.jnpf.math(
        'subtract',
        [item.price || 0, item.excludingTaxCostPrice || 0]
      );
      item.taxAmount = this.jnpf.math('multiply', [item.num, taxPerUnit], 2);

      // 计算未税金额
      item.excludingTaxTotalAmount = this.jnpf.math(
        'subtract',
        [item.totalAmount, item.taxAmount],
        2
      );
    },


    setBasicFormSchema() {
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
          prop: "sourceNo",
          label: "业务单号",
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
          options: this.getDictDataSync('warehouseBusinessType'),
          disabled: true,
          itemRules: [{ required: true, trigger: "blur" }],
        },
        {
          prop: "partnerName",
          label: "供应商/客户",
          value: "",
          type: "input",
          render: ['outbound_sale_send', 'outbound_external_send', 'outbound_purchase', 'outbound_external'].includes(this.businessType)
        },
        {
          prop: "supplierPartnerName",
          label: "供应商名称",
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: '选择供应商',
          treeTitle: '供应商分类',
          renderTree: true,
          multiple: false,
          clearable: true,
          methodArr: { method: getcategoryTrees, requestObj: { type: 'supplier' } },
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
            type: 'supplier',
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
          render: ['inbound_finished_package', 'inbound_purchase'].includes(this.businessType)
        },
        {
          prop: "cooperativePartnerName",
          label: "客户名称",
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
          render: ['inbound_finished_package'].includes(this.businessType)
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-list',
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
          itemDisabled: true
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
          width: '200',
          type: 'custom',
          customComponent: 'ComSelect-page',
          beforeOpen: (paramsObj) => {
            if (!this.dataForm.warehouseId) return this.$message.error('请先选择仓库')
            return true
          },
          renderTree: false,
          tableItems: [
            { prop: 'batchNumber', label: '批次号', width: '200' },
            { prop: 'partnerName', label: '供应商名称', width: '180' },
            { prop: 'warehouseName', label: '仓库名称' },
            { prop: 'shelfSpaceName', label: '库位', render: this.locationEnabled },
            { prop: 'inspectionResultsText', label: '检验结果', slot: true, dictType: 'inspectionResultsType' },
            { prop: 'availableQuantity', label: '可用数量' },
            { prop: 'occupancyQuantity', label: '占用数量' }
          ],
          listMethod: getBatchNumber,
          listRequestObj: (index) => {
            const data = this.linesList[index]
            return {
              pageNum: 1,
              pageSize: 20,
              orderItems: [{
                asc: false,
                column: ''
              }],
              availableBatch: true,
              inspectStockFlag: true,
              excludeProcessFlag: data.processId ? 0 : 1,
              productsId: data.productsId,
              vibrationLevel: data.vibrationLevel,
              sealingCoverTyping: data.sealingCoverTyping,
              oil: data.oil,
              processId: data.processId ? data.processId : '',
              clearance: data.clearance,
              accuracyLevel: data.accuracyLevel,
              warehouseId: data.warehouseId || this.dataForm.warehouseId,
              packagingMethod: data.packagingMethod,
              specialRequire: data.specialRequire,
              batchNumber: '',
              partnerName: '',
              shelfSpaceName: ''
            }
          },
          searchList: [
            { prop: 'batchNumber', label: '批次号', type: 'input' },
            { prop: 'partnerName', label: '供应商名称', type: 'input' },
            { prop: 'shelfSpaceName', label: '库位', type: 'input', render: this.locationEnabled }
          ],
          change: (val, data, paramsObj) => {
            const index = paramsObj.scope.$index
            this.$nextTick(() => {
              this.$refs['linesForm'].$refs.main.validateField(`data.${ index }.batchNumber`)
            })
            if (data && data.length) { // 数据有效，进行更新
              data = data[0].all
              const flattenedData = this.linesList
              flattenedData[index].warehouseId = data.warehouseId
              flattenedData[index].shelfSpaceId = data.shelfSpaceId
              flattenedData[index].shelfSpaceName = data.shelfSpaceName
              this.$set(flattenedData[index], 'availableBatchNumber', data.inventoryQuantity) // 用$set防止合计行不计算
              flattenedData[index].batchNumber = data.batchNumber
              // 如果批次数量小于待出库数量，则把出库数量设为批次数量，反之则为待出库数量
              if (['outbound_sale_send', 'outbound_external_send', 'outbound_pick_out'].includes(this.businessType)) {
                const newNum = Math.min(data.inventoryQuantity, flattenedData[index].undeliveredQuantity)
                if (newNum !== Number(flattenedData[index].num)) {
                  this.$message.success(`产品信息第${ index + 1 }行：自动更新${ this.outboundLabel }数量成功`)
                  this.$nextTick(() => {
                    this.$refs['linesForm'].$refs.main.validateField(`data.${ index }.num`)
                  })
                }
                flattenedData[index].num = newNum
              }
            }
          },
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: [null, (errMsg, index) => {
                  this.$message.error(`产品信息第${ index + 1 }行：批次号${ errMsg }`)
                }]
              }), trigger: 'no'
            },
            { required: true, trigger: 'no' }
          ],
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
          value: '',
          minWidth: 220,
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
          change: async (val, data, paramsObj) => {
            if (!val && data.length) return

            const rowIndex = paramsObj.scope.$index
            const updatedRow = { ...paramsObj.scope.row }

            if (data && data.length) {
              updatedRow.shelfSpaceId = data[0].all.id
              updatedRow.shelfSpaceName = data[0].all.name
              updatedRow.warehouseId = data[0].all.warehouseId
              updatedRow.warehouseName = data[0].all.warehouseName
            } else {
              updatedRow.shelfSpaceId = ''
              updatedRow.shelfSpaceName = ''
              updatedRow.warehouseId = ''
              updatedRow.warehouseName = ''
            }

            this.$set(this.linesList, rowIndex, updatedRow)

            this.$nextTick(() => {
              this.$refs['linesForm'].$refs.main.validateField(`data.${ rowIndex }.shelfSpaceName`)
            })
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
          prop: 'singleBoxNum',
          label: '每箱数量',
          type: 'view',
          minWidth: 140,
          render: ['inbound_finished_package'].includes(this.businessType)
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'view',
          minWidth: 170,
          render: ['inbound_finished_package'].includes(this.businessType)
        },
        {
          prop: 'num',
          label: `${ this.outboundLabel }数量`,
          type: 'input',
          minWidth: 220,
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`${ this.outboundLabel }数量`, ...args)] }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({ type: 'decimal', params: [20, 6, null, (...args) => validErrorMessage(`${ this.outboundLabel }数量`, ...args)] }),
              trigger: 'blur'
            },
            { validator: this.formValidate('positiveNumber', null, (...args) => validErrorMessage(`${ this.outboundLabel }数量`, ...args)), trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [(rowIndex, value) => {
                  if ([].includes(this.businessType)) return true
                  return Number(value) <= Number(this.linesList[rowIndex].undeliveredQuantity)
                }, `不能超过对应待${ this.outboundLabel }数量`, (...args) => validErrorMessage(`${ this.outboundLabel }数量`, ...args)]
              }), trigger: 'blur'
            }
          ],
          input: async (val, scope, transformFlag) => {
            await this.$nextTick()

            const item = scope.row

            this.calculateAmountFields(item);
          }
        },
        {
          prop: 'receivedQuantity',
          label: `已${ this.outboundLabel }数量`,
          type: 'view',
          minWidth: 140,
        },
        {
          prop: 'undeliveredQuantity',
          label: `待${ this.outboundLabel }数量`,
          type: 'view',
          minWidth: 140,
        },
        ...(() => {
          if (['inbound_purchase', 'inbound_external', 'inbound_sale_return', 'inbound_purchase_exchange', 'inbound_purchase2', 'inbound_external2'].includes(this.businessType)) {
            // 获取税率(数据字典)
            const taxrateDict = this.$store.getters.dictionaryList.find(item => item.enCode === 'taxrate')
            const taxRateList = taxrateDict.dictionaryList.map(item => ({
              label: item.fullName,
              value: Number(item.enCode)
            }))
            return [
              {
                prop: 'price',
                label: '单价(含税)',
                minWidth: 160,
                type: 'input',
                itemRules: [
                  { required: true, trigger: 'blur' },
                  {
                    validator: this.formValidate({ type: 'decimal', params: [20, 6, null, (...args) => validErrorMessage('单价(含税)', ...args)] }),
                    trigger: 'blur'
                  }
                ],
                input: (val, scope) => {
                  this.linesListItems.find(item => item.prop === 'num').input(scope.row.num, scope)
                },
                clearable: true
              },
              {
                prop: 'excludingTaxCostPrice',
                label: '单价(不含税)',
                minWidth: 160,
                type: 'view',
                itemRules: [
                  { required: true, trigger: 'blur' },
                  {
                    validator: this.formValidate({ type: 'decimal', params: [20, 6, null, (...args) => validErrorMessage('单价(不含税)', ...args)] }),
                    trigger: 'blur'
                  }
                ],
                input: (val, scope) => {
                  this.linesListItems.find(item => item.prop === 'num').input(scope.row.num, scope, 'changeExcludingTaxCostPrice')
                },
                clearable: true,
              },
              {
                prop: 'taxRate',
                label: '税率',
                minWidth: 160,
                type: 'select',
                options: taxRateList,
                itemRules: [
                  { required: true, trigger: 'change' },
                ],
                change: (val, scope) => {
                  this.linesListItems.find(item => item.prop === 'num').input(scope.row.num, scope)
                },
                clearable: true
              },
              { prop: 'taxAmount', label: '税额', minWidth: 160, type: 'view' },
              { prop: 'totalAmount', label: '总金额(含税)', minWidth: 160, type: 'view' },
              { prop: 'excludingTaxTotalAmount', label: '总金额(不含税)', minWidth: 160, type: 'view' },
            ]
          }
          return []
        })(),
      ]
      this.$nextTick(() => {
        this.$refs.linesForm.setDefaultValue()
        this.$refs.linesForm.$refs.tableRef.doLayout()
      })
    },

    async getOrderNoConfig() {
      const { number } = await this.$store.dispatch('base/getOrderNoConfig', 'RKDH')
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

    selectProductRefOpenDialog() {
      this.addProductProps.listRequestObj.cooperativePartnerId = this.dataForm.cooperativePartnerId
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
      const newData = data.map(item => ({
        ...this.createdObj(),
        ...item.all,
        ordersLineId: item.id,
      }));

      this.linesList = [...this.linesList, ...newData]
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
        const res = await getQuotationsendlist(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = data.notice
          this.linesList = data.noticeLineList
          this.loading = false
        }
      } catch ( err ) {
        this.loading = false
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

    async handleSubmit(isPrint = false) {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['linesForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false

      this.dataForm.documentStatus = 'submit'
      this.dataForm.documentType = 'outbound'

      const deepParams = _.merge({}, this.dataForm, this.businessConfig.defaultForm);
      const newLines = this.linesList.map(item => ({
        ...item,
        warehouseId: this.dataForm.warehouseId
      }))

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
          isPrint ? this.printView(this.dataForm) : this.goBack()
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
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit(false)">
              保存并提交
            </el-button>
            <el-button v-if="showPrintButton" type="success" :loading="btnLoading" @click="handleSubmit(true)">
              提交并打印
            </el-button>
          </template>
          <el-button @click="$emit('close',false)">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="loading" ref="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
              </el-collapse-item>
              <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                <div class="TableForm_title"></div>
                <TableForm-product
                  @input="contentChanges"
                  :value="linesList"
                  :hasToolbar="false"
                  ref="linesForm"
                  :tableItems="linesListItems"
                  :btnType="btnType"
                  :hasActionbar="false"
                  :tableProps="{
                        is: 'JNPF-table',
                        customKey:`dbIncomAndOutInventory_tableForm_${businessType}`,
                        fixedNO: true,
                        hasC: hasC,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                        summaryMethod,
                        'show-summary': true
                      }"
                >
                  <template slot="top">
                    <div class="tableTopContainer">
                      <div class="left">
                        <template v-if="activeType">
                          <el-button v-if="businessConfig.showActions.selectProduct" type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog()">
                            选择产品
                          </el-button>
                          <span v-if="businessConfig.showActions.selectProduct && businessConfig.showActions.batchDelete">|</span>
                          <el-button v-if="businessConfig.showActions.batchDelete" type="text" icon="el-icon-delete" class="JNPF-table-delBtn"
                                     @click="$refs.linesForm.batchDelete()">
                            批量删除
                          </el-button>
                        </template>
                      </div>
                      <div class="right">
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                          <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                   @click="$refs.linesForm.$refs.tableRef.showDrawer()"/>
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
    </div>
  </transition>
</template>
