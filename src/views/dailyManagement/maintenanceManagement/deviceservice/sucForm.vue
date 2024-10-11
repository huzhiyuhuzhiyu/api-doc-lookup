<template>
  <el-dialog title="完成维修" :visible.sync="visibleDialog" :close-on-click-modal="false" append-to-body class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item label="故障原因" prop="reason">
          <el-input v-model="dataForm.reason" placeholder="请输入故障原因" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="维修完成时间" prop="repairCompletionTime">
          <el-date-picker v-model="dataForm.repairCompletionTime" type="datetime" placeholder="请选择维修完成时间" style="width: 100%;" clearable @change="nextMaintenanceTimeactionwan" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < times - 1000 * 3599 * 24;
                        }
                      }">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="解决措施" prop="solutionMeasures">
          <el-input v-model="dataForm.solutionMeasures" placeholder="请输入解决措施" type="textarea" maxlength="200" :rows="2" />
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
import { distributionCustomer } from '@/api/customerManagement/index'
export default {
  data() {
    return {
      visibleDialog: false,
      btnLoading: false,
      dataForm: {
        idList: [],
        reason: '',
        repairCompletionTime: '',
        solutionMeasures: ''
      },
      rules: {
        reason: [
          { required: true, message: '故障原因不能为空', trigger: 'blur' },
        ],
        repairCompletionTime: [
          { required: true, message: '维修完成时间不能为空', trigger: 'blur' }
        ],
        solutionMeasures: [
          { required: true, message: '解决措施不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reviewCommentschange(e) {
      if (e == 'reject') return this.dataForm.startMaintenanceTime = ''
      this.dataForm.startMaintenanceTime = this.jnpf.getToday('YYYY-MM-DD HH:mm:ss')
    },
    init(idList) {
      this.visibleDialog = true
      this.btnLoading = false
      this.dataForm.idList = idList
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
      })
    },
    confirm() {
      this.btnLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          distributionCustomer(this.dataForm).then(res => {
            this.$message({
              message: '移交成功',
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