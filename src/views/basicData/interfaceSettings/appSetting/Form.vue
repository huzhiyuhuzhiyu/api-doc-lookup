<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode"
      v-loading="formLoading" />
    <span slot="footer" class="dialog-footer" v-show="!readOnly">
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton') }}</el-button>
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAppData, updateAppData, detailAppData, generateUuid } from '@/api/basicData/interfaceSettings'

export default {
  data() {
    return {
      title: "",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      readOnly: false,
      dataFormItems: []
    }
  },
  created() {
    this.setDataFormItems()
  },
  methods: {
    setDataFormItems() {
      this.dataFormItems = [
        { prop: "companyName", label: "公司名称", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }], sm: 24, maxlength: 200 },
        { prop: "appid", label: "appid", value: "", type: "input", sm: 24, itemDisabled: true },
        {
          prop: "appSecret", label: "appSecret", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }], sm: 24, maxlength: 200,
          itemSlot: {
            position: 'append', content: '重新生成', click: () => {
              this.formLoading = true
              generateUuid().then(res => {
                this.dataForm.appSecret = res.data.uid
                this.formLoading = false
              })
            }
          }
        },
        { prop: "state", label: "启用状态", value: "enable", type: "select", options: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], itemRules: [{ required: true, trigger: "change" }], sm: 24 }
      ]
    },
    init(id, readOnly) {
      this.visible = true
      this.readOnly = readOnly
      this.dataForm.id = id || ''
      this.formLoading = true
      if (this.dataForm.id) {
        this.title = this.readOnly ? '查看应用' : '编辑应用'
        detailAppData(this.dataForm.id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        })
      } else {
        this.title = '新建应用'
        let successTotal = 0
        generateUuid().then(res => {
          // this.dataForm.uuid = res.data.uid
          this.dataForm.appid = res.data.uid
          ++successTotal == 2 ? this.formLoading = false : ""
        })
        generateUuid().then(res => {
          this.dataForm.appSecret = res.data.uid
          ++successTotal == 2 ? this.formLoading = false : ""
        })
      }
    },
    async handleConfirm() {
      this.btnLoading = true;
      let focusFlag = true
      let form = this.$refs['dataForm'].$children[0]
      let valid_1 = await form.validate().catch(err => false)
      if (!valid_1 && focusFlag) {
        let formItems = form.$children[0].$children
        formItems.some(item => {
          let formItem = item.$children[0].$children[0]
          if (formItem.validateState === 'error') {
            focusFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }

      if (focusFlag) {
        let formMethod = this.dataForm.id ? updateAppData : addAppData;
        formMethod(this.dataForm).then(res => {
          let msg = formMethod == updateAppData ? '修改成功' : '新建成功'
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
            }
          })
          this.$emit('close', true)
        }).catch(err => { this.btnLoading = false })
      } else {
        this.btnLoading = false
      }
    },
  },
  computed: {
    openMode() {
      return this.title.includes("新建") ? '新建' : this.title.includes("编辑") ? '编辑' : '只读'
    }
  }
}
</script>