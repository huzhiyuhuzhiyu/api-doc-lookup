<script>
import {deepClone} from "@/utils";
import {getPackingBasicFormSchema} from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {getAddressInfo} from "@/api/basicData";
import {confirmOrdersNotice, getQuotationsendlist} from "@/api/salesManagement";
import autoRecBatchPacking from "./components/autoRecBatchPacking.vue";

export default {
  name: "packingForm",
  components: {autoRecBatchPacking, TableFormProduct},
  data() {
    return {
      title: '销售发货通知单',
      btnType: '',
      loading: false,
      btnLoading: false,
      autoRecBatchPackingFormVisible: false,
      globalPackagingMethod: '',
      classAttributeList: [],
      warehouseCode: '',
      businessType: '',
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
          label: '客户订单号',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'drawingNo',
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
          prop: 'noticeNum',
          label: '已通知数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'packingQuantity',
          label: '仓库发货数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'inventoryQuantity ',
          label: '当前库存',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'onlineNum',
          label: '线上数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'onlineInventoryNum',
          label: '线上库存',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'deliveryQuantity',
          label: '本次发货数',
          type: 'view',
          minWidth: 160
        },
        {
          prop: 'unrecommendQuantity',
          label: '未推荐数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'urgentQuantity',
          label: '加急数',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：加急数${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging'),
          minWidth: 170,
        },
        {
          prop: 'oil',
          label: '机型',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'specialRequire',
          label: '包装要求',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'accuracyLevel',
          label: '制令号',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: "saleLineRemark",
          label: "销售备注",
          value: "",
          minWidth: 220,
          type: "view",
        }
      ],
      confirmProps: new Set([
        'ordersNum',
        'packingQuantity',
        'onlineNum',
        'deliveryQuantity',
        'urgentQuantity'
      ]),
      // 装箱操作特有的字段
      packingProps: new Set([
        'oil',
        'sealingCoverTyping',
        'onlineInventoryNum',
        'unrecommendQuantity'
      ]),
      linesTableHeight: 0,

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      deliveryStatusMap: {
        ready: 'arranged',
        arranged: 'picked',
        picked: 'verified',
        verified: 'confirmed',
        confirmed: 'finished',
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    isEdit() {
      return this.btnType === 'confirm' && this.dataForm.deliveryStatus === 'ready'
    },
    isConfirm() {
      return this.btnType === 'confirm'
    },
    isPacking() {
      return this.btnType === 'packing'
    },
    totalNum() {
      return this.linesList.reduce((sum, item) => sum + (parseFloat(item.deliveryQuantity) || 0), 0);
    },
  },
  mounted() {
    this.basicFormSchema = getPackingBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(params) {
      const {id, btnType, businessType, classAttributeList, warehouseCode} = params;
      this.btnType = btnType
      this.title = this.getTitle(btnType)
      this.classAttributeList = classAttributeList
      this.warehouseCode = warehouseCode
      this.businessType = businessType
      this.updateLinesListItems()
      await this.getDetail(id);

      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    updateLinesListItems() {
      this.linesListItems = this.linesListItems.map(item => {
        if (item.prop === 'urgentQuantity') {
          return {...item, render: this.isConfirm}
        }

        if (this.confirmProps.has(item.prop)) {
          return {...item, render: this.isConfirm}
        } else if (this.packingProps.has(item.prop)) {
          return {...item, render: this.isPacking}
        }

        return item
      })
    },

    handleOpenTransitionPage(actionType, btnType) {
      switch (actionType) {
        case 'packing':
        case 'autoRecommend':
          this.autoRecBatchPackingFormVisible = true;
          this.$nextTick(() => {
            this.$refs.autoRecBatchPacking.init({
              id: this.dataForm.id,
              formType: actionType,
              type: btnType,
              formData: this.dataForm
            })
          })
          break;
        default:
      }
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

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    getTitle(type) {
      switch (type) {
        case 'packing':
          return `${ this.title }装箱`
        case 'confirm':
          return `${ this.title }确认`
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
          this.fileList = this.fileListMap('', data.attachmentList)
          this.linesList = data.noticeLineList.map(item => ({
            ...item,
            urgentNumber: item.urgentNumber || 0,
          }))
          this.dataForm.defaultAddress = country === 'CN'
            ? `${ countryName }${ provinceName }${ cityName }${ areaName }${ address }`
            : `${ countryName }${ address }`
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    globalChange(val, prop) {
      this.linesList.forEach(item => {
        item[prop] = val;
      });
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
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

    async handleSubmit() {
      this.btnLoading = true
      const deepParams = deepClone(this.dataForm)
      const deliveryStatus = this.deliveryStatusMap[this.dataForm.deliveryStatus]
      deepParams.deliveryStatus = deliveryStatus ? deliveryStatus : this.dataForm.deliveryStatus
      const attachmentList = this.fileListMap('submit', this.fileList)
      const params = {
        notice: deepParams,
        noticeLineList: this.linesList,
        attachmentList: attachmentList,
      }
      let MSG = '确认成功'
      try {
        const res = await confirmOrdersNotice(params)
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
                  <template v-if="btnType === 'confirm'">
                    <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                      确认
                    </el-button>
                  </template>
                  <template v-else-if="btnType === 'packing'">
                    <el-button type="primary" :loading="btnLoading" @click="handleOpenTransitionPage('packing','add')">
                      装箱单
                    </el-button>
                    <el-button type="primary" :loading="btnLoading" @click="handleOpenTransitionPage('autoRecommend','add')">
                      自动推荐批次
                    </el-button>
                    <el-button type="primary" :loading="btnLoading">
                      完成
                    </el-button>
                    <el-button type="danger" :loading="btnLoading">
                      箱单撤回
                    </el-button>
                  </template>
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
                        btnType="look"/>
                    </el-collapse-item>
                    <el-collapse-item class="productInfo"
                      title="产品信息"
                      name="productInfo">
                      <TableForm-product
                        @input="contentChanges"
                        :value="linesList"
                        :hasToolbar="false"
                        ref="tableForm"
                        :btnType="isEdit ? '' : 'look'"
                        :tableItems="linesListItems"
                        :hasActionbar="false"
                        :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }">
                        <template slot="top">
                          <div class="tableTopContainer">
                            <div class="left">
                            </div>
                            <div class="right">
                              <template v-if="isEdit">
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
                  <UploadWj v-model="fileList" :disabled="true" :detailed="true"></UploadWj>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <autoRecBatchPacking ref="autoRecBatchPacking" v-if="autoRecBatchPackingFormVisible" @close="autoRecBatchPackingFormVisible = false"/>
    </div>
  </transition>
</template>
