<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import {getsaleOrderDetailList} from "@/api/salesManagement/assemblyOrders";
import {getAddressInfo} from "@/api/basicData";
import * as _ from "highcharts";
import changeAddress from "@/views/salesManagement/shippingnotice/saleMetalworking/changeAddress.vue";
import {addQuotationsendlist, editQuotationMsendlist, getQuotationsendlist} from "@/api/salesManagement";

export default {
  name: "Form",
  components: {changeAddress, TableFormProduct},
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '销售发货通知单',
      btnType: '',
      loading: false,
      btnLoading: false,
      addressVisible: false,
      globalPackagingMethod: '',
      originalFormData: {},
      dataForm: {
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
        delivery: 'deliver_goods',
        inspectionResults: 'qualified',
        exchangeGoodsFlag: false,
        orderNo: '',
        cooperativePartnerId: '',
        partnerName: '',
        partnerCode: '',
        recipient: '',
        phone: '',
        logisticsCompany: '',
        priority: '',
        deliverDate: '',
        defaultAddress: '',
        remark: '',
        deliveryStatus: '',
      },
      fileList: [],
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: 'ordersNo',
          label: '订单号',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'drawingNo',
          label: '型号',
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
      productRefType: '',
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
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    totalNum() {
      return this.linesList.reduce((sum, item) => sum + (parseFloat(item.deliveryQuantity) || 0), 0);
    },
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag, prefillData = []) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      this.getBusInfo('b026')

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(prefillData);
      }

      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    async defaultInit(prefillData) {
      const firstData = prefillData[0]
      this.dataForm = _.merge({}, this.dataForm, firstData)
      this.dataForm.partnerName = firstData.cooperativePartnerName
      this.dataForm.partnerCode = firstData.cooperativePartnerCode
      await this.getAddressInfo(firstData.cooperativePartnerId)
      this.linesList = prefillData.map(item => ({
        ...item,
        notifyType: 'sale',
        ordersLineId: item.id,
        ordersNum: item.num,
        productDrawingNo: item.drawingNo,
        deliveryQuantity: item.waitDeliverNum
      })) || []
    },

    async getAddressInfo(id) {
      const {data} = await getAddressInfo(id)
      const defaultAddress = data.find(item => item.defaultFlag);
      const {
        recipient,
        phone,
        country,
        province,
        city,
        area,
        address,
        countryText,
        provinceText,
        cityText,
        areaText
      } = defaultAddress;

      this.dataForm = {
        ...this.dataForm,
        recipient,
        phone,
        country,
        province,
        city,
        area,
        address,
        defaultAddress: country === 'CN'
          ? `${ countryText }${ provinceText }${ cityText }${ areaText }${ address }`
          : `${ countryText }${ address }`
      };
    },

    globalChange(val, prop) {
      this.linesList.forEach(item => {
        item[prop] = val;
      });
    },

    async getOrderNoConfig() {
      const {number} = await this.$store.dispatch('base/getOrderNoConfig', 'SSDH')
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

    submitAddress(data) {
      const {
        recipient,
        phone,
        country,
        province,
        city,
        area,
        address,
        countryText,
        provinceText,
        cityText,
        areaText
      } = data;

      this.dataForm = {
        ...this.dataForm,
        recipient,
        phone,
        country,
        province,
        city,
        area,
        address,
        defaultAddress: country === 'CN'
          ? `${ countryText }${ provinceText }${ cityText }${ areaText }${ address }`
          : `${ countryText }${ address }`
      };
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
          this.originalFormData = deepClone(this.dataForm)
          this.fileList = this.fileListMap('', data.attachmentList)
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
      const deepParams = deepClone(this.dataForm)
      deepParams.deliveryStatus = this.apiMethodActions[this.btnType].deliveryStatus || this.dataForm.deliveryStatus
      const attachmentList = this.fileListMap(type, this.fileList)
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
              <el-page-header @back="goBack" :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                    保存草稿
                  </el-button>
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                    保存并提交
                  </el-button>
                </template>
                <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
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
                        customColumn: true
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
                              <template v-if="activeType">
                                <el-form class="height-full" inline label-width="60px" v-if="linesList.length">
                                  <el-form-item label="包装">
                                    <el-select v-model="globalPackagingMethod" placeholder="包装"
                                      @change="(val) => globalChange(val,'packagingMethod')"
                                      style="width: 80px">
                                      <el-option v-for="item in getDictDataSync('packaging')" :key="item.value"
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
                      <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;"
                        class="text">
                        <span style="font-weight:500;margin-right:10px">共发数量：{{ totalNum }}</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex">
                  <UploadWj v-model="fileList" :disabled="!activeType" :detailed="!activeType"></UploadWj>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <changeAddress v-if="addressVisible" ref="addressRef" @getChangeAddress="submitAddress"></changeAddress>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false"
        @change="submitAllProduct"/>
    </div>
  </transition>
</template>
