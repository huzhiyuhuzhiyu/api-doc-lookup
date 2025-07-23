<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "@/views/masterDataManagement/productManagement/components/data";
import {cpAddProduct, detailProduct, updateProductData} from "@/api/masterDataManagement/productManage";
import {getUnitData} from "@/api/basicData/materialSettings";

export default {
  name: "Form",
  data() {
    return {
      title: '成品',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        classAttribute: 'finish_product',
        name: '',
        code: '',
        drawingNo: '',
        material: '',
        insideDiameter: '',
        externalDiameter: '',
        width: '',
        hoseInternalDiameter: '',
        hoseOd: '',
        grossWeight: '',
        mainUnit: '',
        productCategoryId: '',
        productCategoryName: '',
        hsProductsId: '',
        productSource: '',
        sealingCoverTyping: '',
        remark: '',
      },
      basicFormSchema: [],
      fileList: [],
      activeName: 'jcInfo',
      activeNames: ['basicInfo'],
      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],
      linesTableHeight: 0,
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
        default: async () => {
          await this.getOrderNoConfig();
        },
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  created() {
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag = false) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      await this.getUnitData()
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },
    async getUnitData() {
      const response = await getUnitData({pageNum: 1, pageSize: 100});
      this.basicFormSchema = this.basicFormSchema.map(item => {
        if (item.prop === 'mainUnit') {
          item.options = response.data.records.map(unit => ({
            label: unit.name,
            value: unit.name
          }))
        }
        return item
      })
    },
    async getOrderNoConfig() {
      const {number, modifyFlag} = await this.$store.dispatch('base/getOrderNoConfig', 'CPBM')
      this.basicFormSchema = this.basicFormSchema.map(item => {
        if (item.prop === 'code') {
          item.itemDisabled = !modifyFlag
        }
        return item
      })
      this.dataForm.code = number
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
        const res = await detailProduct(id)
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
    async handleSubmit() {
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1) return this.btnLoading = false
      const params = deepClone(this.dataForm)
      params.attachmentList = this.fileListMap('submit', this.fileList)
      if (this.btnType === 'copy') params.id = ''
      let MSG = '提交成功'
      try {
        const apiMethod = params.id ? updateProductData : cpAddProduct
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
    updateBasicFormSchema() {
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
              <el-page-header :class="btnType === 'add' ? 'el-page-header_left_none' : '' " @back="goBack"
                :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                    保存并提交
                  </el-button>
                </template>
                <el-button @click="goBack">{{
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
    </div>
  </transition>
</template>
