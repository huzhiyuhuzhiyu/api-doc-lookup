<template>
  <el-dialog append-to-body title="收票" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="对账单号" prop="orderNo">
            <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号" maxlength="20" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账单金额" prop="totalReconciliationAmount">
            <el-input v-model="dataForm.totalReconciliationAmount" placeholder="账单金额" maxlength="20" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="待收金额" prop="dueAmount">
            <el-input v-model="dataForm.dueAmount" placeholder="待收金额" maxlength="20" disabled />
          </el-form-item>
        </el-col>


        <el-col :span="12">
          <el-form-item label="收票金额" prop="invoicingAmount">
            <el-input v-model="dataForm.invoicingAmount" placeholder="请输入收票金额" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票代码" prop="invoiceCode">
            <el-input v-model="dataForm.invoiceCode" placeholder="请输入发票代码" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号码" prop="invoiceNumber">
            <el-input v-model="dataForm.invoiceNumber" placeholder="请输入发票号码" maxlength="20" />
          </el-form-item>
        </el-col>

        <el-col :span="12">

          <el-form-item label="开票日期" prop="invoiceDate">
            <el-date-picker v-model="dataForm.invoiceDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;"
              placeholder="请选择开票日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
              :disabled="btntype ? true : false" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import dayjs from 'dayjs'
import { addfinInvoiceRecords } from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  components: {
  },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        accountsReceivableReconciliationId: '',
        id: 0,
        invoiceCode: "",
        invoiceDate: "",
        invoiceNumber: "",
        invoicingAmount: 0,
        remark: "",
        reconciliationType: "outside_processing",
        includingTaxAmount: '',
      },

      btntype: false,
      dataRule: {
        paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        invoiceDate:[
        { required: true, message: '请选择开票日期', trigger: 'change' }
        ],
        // invoiceCode:[{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        invoiceNumber:[{ required: true, message: '请输入发票号码', trigger: 'blur' }],
        invoicingAmount: [
          { required: true, message: '请输入收票金额', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal2', params: [10, 2, "",  ] }), trigger: 'blur' },
          { validator: this.numCalcMethod(), trigger: 'blur' },
          // { validator: this.formValidate('noZero', '开票金额不能为0', ), trigger: 'blur' }
        ],
      },
    }
  },
  created() {
  },
  methods: {
    numCalcMethod() {
      return (rule, value, callback) => {
        let msg = "收票金额不能超过待收金额"
        if (!value) { callback() }
        else {
          if (value > 0) {
            if (value > this.dataForm.dueAmount ) {
              callback(msg)
            } else { callback() }
          }else{
            if (Math.abs(value) > Math.abs(this.dataForm.dueAmount) ) {
              callback(msg)
            } else { callback() }
          }
        }
      };
    },
    init(id, type) {
      this.visible = true
      console.log(id);
      this.dataForm.accountsReceivableReconciliationId = id
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()

        this.loading = true
        getfinAccountDetail(this.dataForm.accountsReceivableReconciliationId).then(res => {
          console.log(res, '详情');

          this.dataForm = {
            id: '',
            orderNo: res.data.orderNo,
         
            includingTaxAmount: res.data.includingTaxAmount,
            totalInvoicingAmount: res.data.totalInvoicingAmount ? res.data.totalInvoicingAmount : 0,   
            totalReconciliationAmount:res.data.totalReconciliationAmount ? res.data.totalReconciliationAmount : 0,
            dueAmount:res.data.totalReconciliationAmount < 0 ?  -(Math.abs(res.data.totalReconciliationAmount)  - Math.abs((res.data.totalInvoicingAmount ? res.data.totalInvoicingAmount : 0))) : Math.abs(res.data.totalReconciliationAmount)  - Math.abs((res.data.totalInvoicingAmount ? res.data.totalInvoicingAmount : 0)),
            

            accountsReceivableReconciliationId: this.dataForm.accountsReceivableReconciliationId,
            invoiceCode: "",
            invoiceDate: this.jnpf.getToday(),
            invoiceNumber: "",
            invoicingAmount: 0,
            remark: "",
            reconciliationType: "outside_processing",
          }
          this.dataForm.invoicingAmount = this.dataForm.dueAmount
        })

      })
    },
    dataFormSubmit() {
      this.btnLoading = true;
      let queryData = {
        invoiceRecords:  JSON.parse(JSON.stringify(this.dataForm)) 
      }
      let msg = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (msg) {

            let formMethod = addfinInvoiceRecords

            formMethod(queryData).then(res => {
              console.log(666, res);
              let msg = "收票成功"
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



        }else{
          this.btnLoading = false
        }
      })
    }
  }
}
</script>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>