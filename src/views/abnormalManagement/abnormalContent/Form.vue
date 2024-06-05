<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" @close="$emit('close')">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="formLoading"
      :btnType="btnType" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>
  
<script>
import { addAbnoramlTypeData, updateAbnoramlTypeData, detailAbnoramlTypeData, checkAbnoramlTypeCode, getAbnoramlTypeData } from '@/api/abnormalManagement/index.js'

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
      AbnormaltypeList: []
    }
  },
  methods: {
    async setDataFormItems() {
      this.dataFormItems = [
        { prop: "parentId", label: "异常类型", value: undefined, type: "select", options: this.AbnormaltypeList, itemRules: [{ required: true, trigger: "change" }], sm: 24 },
        {
          prop: "code", label: "内容编码", value: "", type: "input",
          itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate('enCode'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!value) { callback() }
                else if (this.dataForm.code === this.autoCode) { callback() }
                else {
                  checkAbnoramlTypeCode(value).then((res) => {
                    if (!res.data) { callback() }
                    else { callback(new Error('此内容编码已存在')) }
                  }).catch((err) => { callback(new Error(" ")) })
                }
              },
              trigger: 'blur'
            }
          ], sm: 24, itemDisabled: this.btnType !== 'add'
        },
        { prop: "name", label: "内容名称", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }], sm: 24 },
      ]
    },
    async init(row, btnType) {
      this.visible = true
      this.btnType = btnType
      this.formLoading = true
      this.setDataFormItems()

      // 异步获取异常类型选项
      let res = await getAbnoramlTypeData({
        parentId: '-1',
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        pageSize: -1
      }).catch((err) => false)
      if (res) {
        this.AbnormaltypeList = res.data.records.map(row => {
          return { label: row.name, value: row.id }
        })
        this.setDataFormItems()
      }

      if (row) {
        this.dataForm = { ...row }
        this.autoCode = row.code
        this.formLoading = false
        this.title = this.btnType === 'look' ? '查看异常内容' : '编辑异常内容'
      } else {
        this.title = '新建异常内容'
        this.formLoading = false
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true
      let form_1 = this.$refs.dataForm.$refs.main
      let valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        let formItems = form_1.$children[0].$children
        formItems.some(item => {
          let formItem = item.$children[0].$children[0]
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      if (submitFlag) {
        let formMethod = this.dataForm.id ? updateAbnoramlTypeData : addAbnoramlTypeData;
        this.dataForm.documentStatus = submitModel
        formMethod(this.dataForm).then(res => {
          let msg = formMethod == updateAbnoramlTypeData ? '修改成功' : '新建成功'
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