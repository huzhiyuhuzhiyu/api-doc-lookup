<template>
  <el-dialog title="分配客户" :visible.sync="visibleDialog" :close-on-click-modal="false" append-to-body class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item label="负责人" prop="userId">
          <user-select v-model="dataForm.userId" placeholder="请选择负责人" clearable style="width: 100%" @change="hangleSelectSales">
          </user-select>
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
        userId: ''
      },
      rules: {
        userId: [
          { required: true, message: '请选择负责人', trigger: ['blur'] },
        ]
      }
    }
  },
  methods: {
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("userId") });
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
              message: '分配成功',
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