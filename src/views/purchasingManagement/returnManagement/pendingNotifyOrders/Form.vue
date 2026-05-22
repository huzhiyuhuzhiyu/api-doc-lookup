<script>
import {deepClone} from "@/utils";
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import moment from "moment";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import {getBasicFormSchema} from "./data";
import * as _ from "highcharts";
import {addpurPurchaseReceiptReturnGoods, editpurPurchaseReceiptReturnGoods, getpurPurchaseReceiptReturnGoodsdetail} from "@/api/purchasingManagement/purchaseInquirySheet";

export default {
  name: "Form",
  components: {TableFormProduct},
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '采购退货单',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        approvalFlag: false,
        exchangeGoodsFlag: false,
        receiptReturnType: 'back',
        notificationType: 'procure',
        orderNo: '',
        partnerName: '',
        cooperativePartnerCode: '',
        cooperativePartnerId: '',
        deliverDate: '',
        remark: '',
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: 'productCode',
          label: '产品编码',
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
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'view',
          minWidth: 180,
        },
        // {
        //   prop: 'receivedQuantity',
        //   label: '数量',
        //   type: 'view',
        //   minWidth: 90,
        // },
        // 5.22
         {
          prop: 'returnQuantity',
          label: '数量',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'returnReason',
          label: '退货原因',
          type: 'view',
          minWidth: 160
        }
      ],
      fileList: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      linesTableHeight: 0,
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
        add: addpurPurchaseReceiptReturnGoods,
        edit: editpurPurchaseReceiptReturnGoods,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    totalNum() {
      return this.linesList.reduce((sum, item) => sum + (parseFloat(item.receivedQuantity) || 0), 0);
    }
  },
  created() {
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag = false, prefillData = []) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      this.getBusInfo('b029')

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(prefillData);
      }
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => this.refreshTableHeight())
    },

    async defaultInit(prefillData) {
      const firstData = prefillData[0]
      this.dataForm = _.merge(this.dataForm, firstData, {
        notificationType: 'procure'
      })
      // this.dataForm.partnerName = firstData.cooperativePartnerName
      this.dataForm.partnerName = firstData.supplierName || firstData.cooperativePartnerName
      this.dataForm.cooperativePartnerCode = firstData.supplierCode || firstData.cooperativePartnerCode

      this.linesList = prefillData || []
    },

    async getOrderNoConfig() {
      const {number} = await this.$store.dispatch('base/getOrderNoConfig', 'CGTH')
      this.dataForm.orderNo = number
      this.dataForm.deliverDate = moment(new Date()).format('YYYY-MM-DD')
    },

    getTitle(type) {
      switch (type) {
        case 'add':
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
        const res = await getpurPurchaseReceiptReturnGoodsdetail(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data.notice
          this.fileList = this.fileListMap('', data.attachmentList)
          this.linesList = data.noticeLineList
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
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

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 100 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    goBack() {
      this.$emit('close');
    },

    async handleSubmit(type) {
      if (!this.linesList.length) return this.$message.error('无退货信息')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      this.dataForm.documentStatus = type
      const attachmentList = this.fileListMap(type, this.fileList)
      const params = deepClone(this.dataForm)
      const linesList = this.linesList.map(item => ({
        ...item,
        notificationType: 'procure',
        receivedQuantity: item.unqualifiedQuantity,
        unqualifiedQuantity: 0
      }))

      let MSG = '提交成功'
      try {
        const apiMethod = this.apiMethodActions[this.btnType]
        const res = await apiMethod({
          returnGoods: params,
          lines: linesList,
          attachmentList: attachmentList,
          flowData: this.flowData
        },)
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
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header @back="$emit('close', false)"
              :content="title"/>
            <div class="options">
              <template v-if="activeType">
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                  保存并提交
                </el-button>
              </template>
              <el-button @click="$emit('close', false)">{{
                  $t('common.cancelButton')
                }}
              </el-button>
            </div>
          </div>
          <div class="main" v-loading="loading" ref="main">
            <el-tabs v-model="activeName" v-if="!approvalFlag">
              <el-tab-pane label="基础信息" name="jcInfo">
                <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                    <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                      :btnType="btnType"/>
                  </el-collapse-item>
                  <el-collapse-item class="productInfo"
                    title="退货清单"
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
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true
                      }"/>
                    <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;"
                      class="text">
                      <span style="font-weight:500;margin-right:10px">退货数量：{{ totalNum }}</span>
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
  </transition>
</template>
