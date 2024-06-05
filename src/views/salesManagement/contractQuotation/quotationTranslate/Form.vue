<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="basicInfo">
            <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :btnType="btnType" />
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>
  
<script>
import {
  addQuotaionTranslateData,
  updateQuotaionTranslateData,
  detailQuotaionTranslateData,
  handleQuotaionTranslateData,
} from '@/api/salesManagement/quotationTranslate.js'

export default {
  data() {
    return {
      datafilelist: [],

      activeName: 'basicInfo',
      title: "",
      btnType: '',
      formLoading: false,
      btnLoading: false,

      dataForm: {},
      dataFormItems: []
    }
  },
  created() {
    this.setDataFormItems()
  },
  methods: {
    setDataFormItems() {
      this.dataFormItems = [
        { prop: "applyDesc", label: "申请说明", value: "", type: "textarea", itemRules: [{ required: true, trigger: 'blur' }] },
      ]
    },
    init(row, btnType) {
      this.btnType = btnType
      this.formLoading = true
      if (row) {
        this.dataForm = { ...row }
        this.title = btnType === 'look' ? '查看报价翻译申请' : '编辑报价翻译申请'
        detailQuotaionTranslateData(row.id).then(res => {
          this.formLoading = false
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push({
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              })
            })
          }
        })
      } else {
        this.title = '新建报价翻译申请'
        this.formLoading = false
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true

      // 基础信息
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        this.activeName = 'basicInfo'
        submitFlag = false
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }

      // 附件
      if(!this.datafilelist.length && submitFlag) {
        this.$message.error('请至少上传一个附件')
        this.activeName = 'annex'
        submitFlag = false
      }

      // 提交
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: '',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.dataForm.attachmentList = this.datafilelist
        let formMethod = this.dataForm.id ? updateQuotaionTranslateData : addQuotaionTranslateData;
        this.dataForm.documentStatus = submitModel
        formMethod(this.dataForm).then(res => {
          let msg = formMethod == updateQuotaionTranslateData ? '修改成功' : '新建成功'
          this.$emit('close', true)
          this.$message.success(msg)
        }).catch(err => { this.btnLoading = false })
      } else {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>