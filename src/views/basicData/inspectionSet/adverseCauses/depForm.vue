<template>
  <el-drawer :title="!dataForm.id ? '新建不良原因' : '编辑不良原因'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll width="600px" @close="handleClose" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding: 10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px">
        <el-form-item label="不良名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入不良名称" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>
        <el-form-item label="不良编码" prop="code">
          <el-input v-model="dataForm.code" placeholder="请输入不良编码" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>

      </el-form>
    </div>

    <span class="button-bottom">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交
      </el-button>
    </span>
  </el-drawer>
</template>

<script>
import {
  addAdverseCausesData,
  getAdverseCausesInfo,
  editAdverseCausesData,
  checkadverseCausesCode
} from '@/api/basicData/index'
import formValidate from '@/utils/formValidate'
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      title: '',
      dataForm: {
        name: '',
        code: '',
        id: ''
      },
      btntype: false,
      dataRule: {
        name: [{ required: true, message: '请输入不良名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入不良编码', trigger: 'blur' },
          { validator: formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id)
              checkadverseCausesCode(value, this.dataForm.id)
                .then((res) => {
                  console.log('res===>', res)
                  if (res.data) {
                    callback(new Error('不良编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() { },
  methods: {
    handleClose() { },
    init(id, type) {

      this.visible = true
      this.dataForm.id = id || ''
      this.title = !this.dataForm.id ? '新建不良原因' : '编辑不良原因'
      if (type == 'edit' || type == 'add') {
        this.btntype = false
      } else if (type == 'look') {
        this.btntype = true
      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getAdverseCausesInfo(this.dataForm.id).then((res) => {
            console.log(123321, res)
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
          let formMethod = this.dataForm.id ? editAdverseCausesData : addAdverseCausesData
          let obj = {
            causes: this.dataForm
          }
          formMethod(obj)
            .then((res) => {
              console.log(666, res)
              let msg = ''
              if (formMethod == editAdverseCausesData) {
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
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  margin-left: -12px;
}

.required {
  color: red;
  margin-left: 4px;
}

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>