<template>
  <el-dialog title="完成计划" :visible.sync="visibleDialog" :close-on-click-modal="false" append-to-body class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item prop="activityName" label="跟进内容">
          <el-input type="textarea" :rows="4" v-model="dataForm.activityName" placeholder="请输入跟进内容">
          </el-input>
        </el-form-item>
        <el-form-item label="下次拜访时间" prop="nextTime">
          <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次拜访时间">
          </el-date-picker>
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
        activityName: [
          { required: true, message: '请输入跟进内容', trigger: ['blur'] },
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
            this.dataForm.activityName = ''
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