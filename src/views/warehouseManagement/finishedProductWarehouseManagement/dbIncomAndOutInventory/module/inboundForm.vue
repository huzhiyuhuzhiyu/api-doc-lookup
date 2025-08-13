<script>
import * as _ from "highcharts";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";

import {deepClone} from "@/utils";
import {addQuotationsendlist, editQuotationMsendlist, getQuotationsendlist} from "@/api/salesManagement";
import {getLocationList} from "@/api/warehouseManagement/inventory";
import {getpurPurchaseReceiptReturnGoodsdetail} from "@/api/purchasingManagement/purchaseInquirySheet";
import {getsaleOrderDetailList} from "@/api/salesManagement/assemblyOrders";
import {getWarehouseInfo, getWarehouseList} from "@/api/basicData";
import {dataProcessor} from "./data";
import {purPurchaseOrderdetail} from "@/api/purchasingAndOutsourcingOrders";


export default {
  name: "inboundForm",
  components: {TableFormProduct},
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '入库单',
      btnType: '',
      loading: false,
      btnLoading: false,
      locationEnabled: false,
      classAttributeList: [],
      warehouseCode: '',
      businessType: '',
      dataForm: {
        approvalFlag: false,
        orderNo: '',
        sourceNo: '',
        businessType: '',
        partnerName: '',
        warehouseName: '',
        shelfSpaceName: '',
        inspectionResults: '',
        orderDate: '',
        remark: '',
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
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
            if (this.productData.some(item => item.shelfSpaceId === data.id && (item.noticeLineId || item.ordersLineId) === groupKey)) {
              this.$message.error('同一来源产品的入库库位不能重复！')
              return false
            }
            return true
          },
          change: (val, data, paramsObj) => {
            this.$nextTick(() => {
              this.$refs['tableForm'].$refs.main.validateField(`data.${paramsObj.scope.$index}.shelfSpaceName`)
            })
            if (!val && data.length) return
            if (data && data.length) {
              paramsObj.scope.row.shelfSpaceId = data[0].all.id
              paramsObj.scope.row.shelfSpaceName = data[0].all.name
              paramsObj.scope.row.warehouseId = data[0].all.warehouseId
              paramsObj.scope.row.warehouseName = data[0].all.warehouseName
            } else {
              paramsObj.scope.row.shelfSpaceId = ''
              paramsObj.scope.row.shelfSpaceName = ''
              paramsObj.scope.row.warehouseId = ''
              paramsObj.scope.row.warehouseName = ''
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
          render: this.allocationFlag && !this.dataForm.totalStockOutboundFlag,
          width: '180',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['', (...args) => validErrorMessage('库位', ...args)]
              }), trigger: 'no'
            },
            { required: true, trigger: 'no' }
          ]
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户产品型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'ordersNum',
          label: '订单数量',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'notifiedQuantity',
          label: '已通知数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'warehouseDelivery',
          label: '仓库发货数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'onlineQuantity',
          label: '线上数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'availableQuantity',
          label: '当前库存',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging'),
          minWidth: 170,
        },
        {
          prop: 'waitDeliverNum',
          label: '待发货数量',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'deliveryQuantity',
          label: '本次发货数',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '本次发货数不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['本次发货数不能为空', (errMsg) => {
                  this.$message.error(`	本次发货数不能为空`)
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
            {required: true, message: '本次发货数不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {
          prop: "remark",
          label: "备注",
          value: "",
          minWidth: 220,
          type: "input",
        }
      ],
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
          {prop: 'orderNo', label: '订单号', minWidth: '220px', sortable: 'custom'},
          {prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'productCode', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'waitDeliverNum', label: '待发货数量', minWidth: '160px', sortable: 'custom'},
          {prop: 'deliveryDate', label: '交货日期', minWidth: '160px', sortable: 'custom'},
          {prop: 'remark', label: '备注', minWidth: '160px'},
          {prop: 'createTime', label: '创建时间', sortable: 'custom'}
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
          {prop: 'productName', label: '产品名称', type: 'input'},
          {prop: 'productCode', label: '产品编码', type: 'input'},
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
        copy: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig();
        },
        default: async (data) => {
          this.defaultInit(data);
          await this.getOrderNoConfig();
        },
      },
      apiMethodActions: {
        edit: {
          api: editQuotationMsendlist,
          deliveryStatus: '',
        },
        add: {
          api: addQuotationsendlist,
          deliveryStatus: 'waiting',
        },
        copy: {
          api: addQuotationsendlist,
          deliveryStatus: 'waiting',
        }
      },
      businessTypeConfig: {
        default: {},
        // 采购收货
        inbound_purchase: {
          api: {
            fetchLines: purPurchaseOrderdetail,
            dataPath: 'purchaseOrderLineVOList',
            filter: {
              classAttribute: this.classAttributeList
            },
            formatter: (item) => ({
              ...item,
              undeliveredQuantity: item.waitReceiptNum,
              ordersId: item.purchaseOrderId,
              productDrawingNo: item.drawingNo,
            })
          },
          print: {},
        },
      },
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    }
  },
  mounted() {
  },
  methods: {
    async init(params) {
      const {id, prefillData, btnType, businessType, classAttributeList, warehouseCode} = params;
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
        this.linesList = prefillData.map(item => ({
          ...item,
        })) || [];
      } else {
        await this.fetchBusinessLines(prefillData);
      }
    },

    async fetchBusinessLines(data) {
      const config = this.businessTypeConfig[this.businessType]?.api || {};

      try {
        const response = await config.fetchLines(data.id);

        let lines = dataProcessor.extractData(response, config.dataPath);
        if (!Array.isArray(lines)) {
          lines = [lines].filter(Boolean);
        }

        lines = dataProcessor.applyFilter(lines, config.filter);

        this.linesList = lines.map(item => ({
          ...(config.formatter ? config.formatter(item) : item)
        }));

      } catch (error) {
        console.error(`[${ this.businessType }] 数据加载失败:`, error);
        this.linesList = [];
      }
    },

    async fetchAndSetWarehouseInfo() {
      try {
        const {data: warehouses} = await getWarehouseList({code: this.warehouseCode});
        if (!warehouses || warehouses.length === 0) {
          this.$message.error('未找到匹配的仓库');
        }

        const primaryWarehouse = warehouses[0];
        this.dataForm.warehouseName = primaryWarehouse.name;
        this.dataForm.warehouseId = primaryWarehouse.id;

        const {data: warehouseDetails} = await getWarehouseInfo(primaryWarehouse.id);
        this.wareHouseInfo = warehouseDetails;
        this.dataForm.warehouseType = warehouseDetails.type;
        this.locationEnabled = warehouseDetails.locationStatus !== 'disabled';
        this.setBasicFormSchema()
      } catch (error) {
      }
    },

    setBasicFormSchema() {
      this.basicFormSchema = [
        {
          prop: "orderNo",
          label: "入库单号",
          value: "",
          type: "input",
          disabled: true,
          itemRules: [{required: true, trigger: "blur"}],
        },
        {
          prop: "sourceNo",
          label: "业务单号",
          value: "",
          type: "input",
          disabled: true,
          itemRules: [{required: true, trigger: "blur"}],
        },
        {
          prop: "businessType",
          label: "业务类型",
          value: "",
          type: "select",
          options: this.getDictDataSync('warehouseBusinessType'),
          disabled: true,
          itemRules: [{required: true, trigger: "blur"}],
        },
        {
          prop: "partnerName",
          label: "供应商/客户",
          value: "",
          type: "input",
          render: ['inbound_purchase'].includes(this.businessType)
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
          requestObj: {type: 'normal', state: 'enable'},
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
            {prop: 'name', label: '库位名称', type: 'input'},
            {prop: 'code', label: '库位编码', type: 'input'}
          ],
          tableItems: [
            {prop: 'name', label: '库位名称'},
            {prop: 'code', label: '库位编码'},
            {prop: 'remark', label: '备注'}
          ],
          change: (val, data, paramsObj) => {
            if (!val && data.length) return
            if (data && data.length) {
              this.dataForm.shelfSpaceId = data[0].all.id
              this.dataForm.shelfSpaceName = data[0].all.name
              this.productData = this.productData.map(item => ({
                ...item,
                shelfSpaceId: data[0].all.id,
                shelfSpaceName: data[0].all.name,
                warehouseId: data[0].all.warehouseId,
                warehouseName: data[0].all.warehouseName
              }))
            } else {
              this.dataForm.shelfSpaceId = ''
              this.dataForm.shelfSpaceName = ''
              this.productData = this.productData.map(item => ({
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
            orderItems: [{asc: false, column: ''}, {asc: false, column: 'createTime'}],
            state: 'enable'
          },
          dialogTitle: '选择库位',
          listMethod: getLocationList,
          render: this.locationEnabled && !this.dataForm.totalStockOutboundFlag
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          value: 'qualified',
          type: 'select',
          options: [
            {label: '合格', value: 'qualified'},
            {label: '待检验', value: 'unInspect'}
          ],
          clearable: false,
          render: ['inbound_purchase'].includes(this.businessType),
          itemRules: [
            {required: true, trigger: 'change'}
          ]
        },
        {
          prop: "orderDate",
          label: "单据日期",
          value: this.jnpf.getToday(),
          type: "date",
          itemRules: [{required: true, trigger: "change"}],
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

    globalChange(val, prop) {
      this.linesList.forEach(item => {
        item[prop] = val;
      });
    },

    async getOrderNoConfig() {
      const {number} = await this.$store.dispatch('base/getOrderNoConfig', 'RKDH')
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
        notifyType: 'sale',
        ordersLineId: item.id,
      }));

      this.linesList = [...this.linesList, ...newData]
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
        const res = await getQuotationsendlist(id)
        const {msg, data} = res
        if (msg === 'Success') {
          const {country, countryName, provinceName, cityName, areaName, address} = data.notice
          this.dataForm = data.notice
          this.linesList = data.noticeLineList
          this.dataForm.defaultAddress = country === 'CN'
            ? `${ countryName }${ provinceName }${ cityName }${ areaName }${ address }`
            : `${ countryName }${ address }`
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    summaryMethod(param) {
      const {columns, data} = param
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

    async handleSubmit(type) {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      this.dataForm.documentStatus = type
      const deepParams = deepClone(this.dataForm)
      deepParams.deliveryStatus = this.apiMethodActions[this.btnType].deliveryStatus || this.dataForm.deliveryStatus
      const params = {
        notice: deepParams,
        noticeLineList: this.linesList,
        attachmentList: attachmentList,
        flowData: this.flowData
      }
      if (this.btnType === 'copy') {
        params.notice.id = ''
      }
      let MSG = '提交成功'
      try {
        const apiMethod = this.apiMethodActions[this.btnType].api
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
      this.$emit('close', this.activeType);
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
              <el-page-header @back="$emit('close',false)" :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                    保存并提交
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
                        :value="linesList"
                        :hasToolbar="false"
                        ref="tableForm"
                        :tableItems="linesListItems"
                        :btnType="btnType"
                        :hasActionbar="false"
                        :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: activeType,
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
                                <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog()">
                                  选择产品
                                </el-button>
                                <span>|</span>
                                <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn"
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
          </div>
        </div>
      </div>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false"
        @change="submitAllProduct"/>
    </div>
  </transition>
</template>
