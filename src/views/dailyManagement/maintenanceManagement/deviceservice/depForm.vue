<template>
  <el-dialog title="审核派工" :visible.sync="visibleDialog" :close-on-click-modal="false" append-to-body class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item label="审核意见" prop="reviewComments">
          <el-select v-model="dataForm.reviewComments" placeholder="请选择审核意见" @change="reviewCommentschange" clearable style="width: 100%;">
            <el-option v-for="(item, index) in reviewCommentsList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="dataForm.reviewComments=='reject'">
        <el-form-item label="驳回理由" prop="rejectReason">
          <el-select v-model="dataForm.rejectReason" placeholder="请选择驳回理由" clearable style="width: 100%;">
            <el-option v-for="(item, index) in rejectReasonList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="dataForm.reviewComments!=='reject'">
        <el-form-item label="紧急程度" prop="degree">
          <el-select v-model="dataForm.degree" placeholder="请选择紧急程度" clearable style="width: 100%;">
            <el-option v-for="(item, index) in degreeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="dataForm.reviewComments!=='reject'">
        <el-form-item label="派工时间" prop="startMaintenanceTime">
          <el-date-picker v-model="dataForm.startMaintenanceTime" type="datetime" placeholder="请选择派工时间" style="width: 100%;" clearable @change="nextMaintenanceTimeactionwei" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < timefaultStartTime - 1000 * 3599 * 24;
                        }
                      }">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
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
      rejectReasonList: [
        { label: '暂不需要维修', value: '暂不需要维修' },
        { label: '待统一维修', value: '待统一维修' },
        { label: '操作工自行解决', value: '操作工自行解决' },
        { label: '其他', value: '其他' }
      ],
      degreeList: [
        { label: '特别紧急', value: '1' },
        { label: '紧急', value: '2' },
        { label: '一般', value: '3' },
        { label: '不急', value: '4' }
      ],
      reviewCommentsList: [
        { label: '立即维修', value: 'immediately' },
        { label: '驳回', value: 'reject' },
        { label: '转委外', value: 'outsourcing' }
      ],
      visibleDialog: false,
      btnLoading: false,
      dataForm: {
        idList: [],
        reviewComments: '',
        degree: '',
        startMaintenanceTime: '',
        rejectReason: ''
      },
      rules: {
        reviewComments: [
          { required: true, message: '审核意见不能为空', trigger: 'change' },
        ],
        degree: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' }
        ],
        startMaintenanceTime: [
          { required: true, message: '派工时间不能为空', trigger: 'blur' }
        ],
        rejectReason: [
          { required: true, message: '驳回理由不能为空', trigger: 'change' }
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