<template>
  <el-dialog title="取消计划" :visible.sync="visibleDialog" :close-on-click-modal="false" append-to-body class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item prop="cancelReason" label="取消原因">
          <el-input v-model="dataForm.cancelReason" placeholder="请输入取消原因">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="cancelRemark" label="备注">
          <el-input type="textarea" :rows="4" v-model="dataForm.cancelRemark" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialog = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="confirm" :loading="btnLoading">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detailcrmVisit, updatecrmVisit } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      visibleDialog: false,
      btnLoading: false,
      dataForm: {},
      rules: {
        cancelReason: [
          { required: true, message: '请输入取消原因', trigger: ['blur'] },
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.visibleDialog = true
      this.btnLoading = false
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmVisit(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.dataForm.cancelReason = ''
            this.dataForm.cancelRemark = ''
          }).catch(() => {
            this.visibleDialog = false
          })
        }
      })
    },
    confirm() {
      this.btnLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          updatecrmVisit(this.dataForm).then(res => {
            this.$message({
              message: this.dataForm.id ? '修改成功' : '新建成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visibleDialog = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        } else {
          this.btnLoading = false
        }
      })
    },
  },
}
</script>