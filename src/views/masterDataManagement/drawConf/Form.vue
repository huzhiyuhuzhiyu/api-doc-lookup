<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "./data";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import {addPurPurchaseDrawing, getPurPurchaseDrawing} from "@/api/drawConf";

export default {
  name: "Form",
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '图纸确认',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        code: '',
        name: '',
        drawingNo: '',
        tradeName: '',
        purpose: '',
        type: '',
        brand: '',
        remark: '',
      },
      fileList: [],
      basicFormSchema: getBasicFormSchema(this.$refs.dataForm, this),

      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],

      activeName: 'jcInfo',
      activeNames: ['basicInfo'],
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  created() {
  },
  methods: {
    async init(row, type) {
      this.btnType = type
      this.title = this.getTitle(type)
      // this.getBusInfo('b026')
      const {id, purPurchaseOrderLineId} = row
      const params = {
        id: id,
        purchaseLineId: purPurchaseOrderLineId
      }

      await this.getDetail(params)

      // this.dataForm.approvalFlag && this.getFlowDetail(row.id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
      })
    },

    async getDetail(params) {
      this.loading = true
      try {
        const res = await getPurPurchaseDrawing(params)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data
          this.fileList = this.fileListMap('', data.attachmentList)
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    getTitle(type) {
      switch (type) {
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
      const params = {
        purchaseDrawing: deepParams,
        attachmentList: attachmentList,
        flowData: this.flowData
      }
      let MSG = '提交成功'
      try {
        const res = await addPurPurchaseDrawing(params)
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
      this.$emit('close');
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header @back="goBack" :content="title"/>
            <div class="options">
              <template v-if="activeType">
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit('last_confirmed')">
                  按上次已确认图纸
                </el-button>
                <!--                <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">-->
                <!--                  历史确认-->
                <!--                </el-button>-->
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
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
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
        </div>
      </div>
    </div>
  </transition>
</template>
