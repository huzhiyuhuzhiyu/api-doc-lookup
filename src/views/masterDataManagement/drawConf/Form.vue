<script>
import { deepClone } from "@/utils";
import { getBasicFormSchema } from "./data";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import HistoricalDrawings from "./historicalDrawings.vue";
import { addPurPurchaseDrawing, getProductionDrawing, getPurPurchaseDrawing, updatePurPurchaseDrawing } from "@/api/drawConf";

export default {
  name: "Form",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['purchase', 'produce'].includes(value)
    }
  },
  components: { HistoricalDrawings },
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '图纸确认',
      btnType: '',
      loading: false,
      historicalDrawingsVisible: false,
      btnLoading: false,
      drawingDetailId: '',
      dataForm: {
        purchaseOrderNo: '',
        purchaser: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        cooperativePartnerPhone: '',
        cooperativePartnerFax: '',
        cooperativePartnerContacts: '',
        cooperativePartnerMobilePhone: '',
        cooperativePartnerEmail: '',
        drawingNo: '',
        productName: '',
        customerProductDrawingNo: '',
        orderDate: null,
        confirmDate: null,
        sizeReportFlag: false,
        heatTreatmentReportFlag: false,
        materialReportFlag: false,
        paralympicReportFlag: false,
        ultrasonicDetectionReportFlag: false,
        annealingSpectrumFlag: false,
        quenchingPatternFlag: false,
        ppapFlag: false,
        paymentTerms: '',
        qualityRequirements: '',
        sealingCoverTyping: '',
        remark: ''
      },
      fileList: [],
      basicFormSchema: getBasicFormSchema(this.$refs.dataForm, this),

      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],

      activeName: 'jcInfo',
      activeNames: ['basicInfo'],

      apiMethodDetail: {
        purchase: getPurPurchaseDrawing,
        produce: getProductionDrawing,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    isPurchase() {
      return this.type === 'purchase'
    },
  },
  created() {
  },
  methods: {
    async init(row, type) {
      this.btnType = type
      this.title = this.getTitle(type)
      this.drawingDetailId = ''
      // 从列表页新增时，禁用采购单号到打字要求之间的基础信息字段
      if (type === 'add') {
        this.disableBasicInfoFields()
      }
      // this.getBusInfo('b026')
      const { id, purPurchaseOrderLineId } = row
      const params = {
        id: id,
        purchaseLineId: purPurchaseOrderLineId
      }

      await this.getDetail(params, row)

      // this.dataForm.approvalFlag && this.getFlowDetail(row.id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
      })
    },
    // 从列表页新增图纸确认时，禁用"采购单号"到"打字要求"（或"生产任务单号"到"产线"）之间的字段
    disableBasicInfoFields() {
      const disabledBoundary = this.isPurchase ? 'sealingCoverTyping' : 'productionLineName'
      for (const item of this.basicFormSchema) {
        item.disabled = true
        if (item.prop === disabledBoundary) break
      }
    },
    handleQuoteCallBack(data) {
      this.fileList = this.fileListMap('', data?.attachmentList)
    },
    handleHistoricalSubmit() {
      this.historicalDrawingsVisible = true
    },
    async getDetail(params, row = {}) {
      this.loading = true
      try {
        const res = await this.apiMethodDetail[this.type](params)
        const { msg, data } = res
        if (msg === 'Success') {
          // 新逻辑：只根据详情接口返回的 id 判断提交时走新增还是修改。
          this.drawingDetailId = data?.id || ''
          this.dataForm = {
            ...this.dataForm,
            ...data,
            confirmDate: data?.confirmDate || this.jnpf.getToday()
          }
          this.fileList = this.fileListMap('', data.attachmentList)
        }
      } catch ( err ) {
        // 原逻辑：详情报错时只关闭 loading；现在报错也按“无详情 id”处理，后续提交走新增。
        this.drawingDetailId = ''
        const { id, attachmentList, ...rowData } = row || {}
        this.dataForm = {
          ...this.dataForm,
          ...rowData,
          confirmDate: rowData?.confirmDate || this.jnpf.getToday()
        }
        this.fileList = this.fileListMap('', attachmentList) || []
      } finally {
        this.loading = false
      }
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
          return `${ this.title }`
        case 'look':
          return `查看${ this.title }`
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
    normalizeFlags(deepParams) {
      const flags = [
        'sizeReportFlag',
        'heatTreatmentReportFlag',
        'materialReportFlag',
        'paralympicReportFlag',
        'ultrasonicDetectionReportFlag',
        'annealingSpectrumFlag',
        'quenchingPatternFlag',
        'ppapFlag'
      ];

      flags.forEach(flag => {
        if (deepParams[flag] === null || deepParams[flag] === '') {
          deepParams[flag] = false;
        }
      });

      return deepParams;
    },
    async handleSubmit(type) {
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1) return this.btnLoading = false
      this.dataForm.status = type
      const attachmentList = this.fileListMap('submit', this.fileList)
      const deepParams = this.normalizeFlags(deepClone(this.dataForm))

      deepParams.drawingType = this.type

      const params = {
        purchaseDrawing: deepParams,
        attachmentList: attachmentList,
        flowData: this.flowData
      }
      let MSG = '提交成功'
      try {
        // 原逻辑：图纸确认固定调用新增接口。
        // const res = await addPurPurchaseDrawing(params)
        const apiMethod = this.drawingDetailId ? updatePurPurchaseDrawing : addPurPurchaseDrawing
        if (this.drawingDetailId) params.purchaseDrawing.id = this.drawingDetailId
        const res = await apiMethod(params)
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
      this.$emit('close');
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="title"/>
        <div class="options">
          <template v-if="activeType">
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('last_confirmed')">
              按上次已确认图纸
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleHistoricalSubmit()" v-if="isPurchase">
              历史确认
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('confirmed')">
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
            <el-collapse v-model="activeNames" style="margin-top: 5px;">
              <el-collapse-item title="基本信息" name="basicInfo" ref="dataFormRegion">
                <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                          :btnType="btnType"/>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="fileList" :disabled="!activeType" :detailed="!activeType"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <HistoricalDrawings :visible.sync="historicalDrawingsVisible" :formData="dataForm" @quoteClick="handleQuoteCallBack"/>
    </div>
  </transition>
</template>
