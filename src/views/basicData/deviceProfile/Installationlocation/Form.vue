<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item :label="value=='workshop'?'车间':'安装地点'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="value=='workshop'?'请输入车间':'请输入安装地点'" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detaileequMountedPlaces, updateequMountedPlaces, addequMountedPlaces } from "@/api/basicData/materialSettings"
export default {
  data() {
    return {
      title: '',
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        type: '',
        name: '',
        id: ''
      },
      dataRule: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    init(id, type, value) {
      this.value = value
      this.dataForm.type = value
      if (value == 'workshop') {
        if (type == 'add') {
          this.title = '新增车间'
        } else {
          this.title = '编辑车间'
        }
      } else {
        if (type == 'add') {
          this.title = '新增安装地点'
        } else {
          this.title = '编辑安装地点'
        }
      }
      this.visible = true
      this.dataForm.id = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detaileequMountedPlaces(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? updateequMountedPlaces : addequMountedPlaces
          formMethod(this.dataForm).then(res => {
            let msg = ""
            if (formMethod == updateequMountedPlaces) {
              msg = '修改成功'
            } else {
              msg = '新建成功'
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
