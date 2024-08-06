<template>
  <el-dialog title="标记为开票" :visible.sync="visibleDialog" :close-on-click-modal="false" append-to-body class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item prop="invoiceNumber" label="发票号码">
          <el-input v-model="dataForm.invoiceNumber" placeholder="请输入发票号码">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="realInvoiceDate" label="实际开票日期">
          <el-date-picker v-model="dataForm.realInvoiceDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择实际开票日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="logisticsNumber" label="物流单号">
          <el-input v-model="dataForm.logisticsNumber" placeholder="请输入物流单号">
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
import { updatecrmInvoice, detailcrmInvoice } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      visibleDialog: false,
      btnLoading: false,
      dataForm: {},
      lines: [],
      rules: {
        realInvoiceDate: [
          { required: true, message: '请选择实际开票日期', trigger: ['blur'] },
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
          detailcrmInvoice(this.dataForm.id).then(res => {
            this.dataForm = res.data.invoice
            this.lines = res.data.lines
            this.dataForm.invoiceNumber = ''
            this.dataForm.realInvoiceDate = ''
            this.dataForm.logisticsNumber = ''
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
          updatecrmInvoice({ invoice: this.dataForm, lines: this.lines }).then(res => {
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