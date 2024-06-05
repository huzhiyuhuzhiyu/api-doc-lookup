<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" @close="$emit('close')">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="formLoading" :btnType="btnType" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>
  
<script>
import { handleQuotaionTranslateData } from '@/api/salesManagement/quotationTranslate.js'

export default {
  data() {
    return {
      title: "",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      btnType: 'add',
      autoCode: '',
      dataFormItems: [],
    }
  },
  methods: {
    setDataFormItems() {
      this.dataFormItems = [
        { prop: "processDesc", label: "处理说明", value: "", type: "textarea", sm: 24 },
      ]
    },
    init(id, btnType) {
      this.visible = true
      this.btnType = btnType
      this.formLoading = true
      if (id) {
        this.dataForm = { id }
        this.formLoading = false
        this.title = this.btnType === 'look' ? '查看' : '处理报价翻译申请'
      } else {
        this.title = '新建'
        this.formLoading = false
      }
      this.setDataFormItems()
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true

      if (submitFlag) {
        let formMethod = this.dataForm.id ? handleQuotaionTranslateData : '';
        this.dataForm.documentStatus = submitModel
        formMethod(this.dataForm).then(res => {
          let msg = formMethod == handleQuotaionTranslateData ? '处理成功' : '新建成功'
          this.visible = false
          this.$emit('close', true)
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
            }
          })
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