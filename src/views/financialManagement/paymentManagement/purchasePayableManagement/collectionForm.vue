<template>
  <el-dialog append-to-body title="付款" :close-on-click-modal="false" :close-on-press-escape="false"
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
          <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '应付金额' : '应退金额'"
            prop="totalReconciliationAmount">
            <el-input v-model="dataForm.totalReconciliationAmount"
              :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '应付金额' : '应退金额'" maxlength="20" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '待付金额' : '待退金额'" prop="dueAmount">
            <el-input v-model="dataForm.dueAmount"
              :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '待付金额' : '待退金额'" maxlength="20" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '付款方式' : '退款方式'" prop="paymentMethod">
            <el-select v-model="dataForm.paymentMethod"
              :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '请选择付款方式' : '请选择退款方式'" clearable
              style="width: 100%;">
              <el-option v-for="(item, index) in paymentMethodList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '付款金额' : '退款金额'" prop="paymentAmount">
            <el-input v-model="dataForm.paymentAmount"
              :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '请输入付款金额' : '请输入退款金额'" maxlength="20" />
          </el-form-item>
        </el-col>

        <el-col :span="12">

          <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '付款日期' : '退款日期'" prop="paymentDate">
            <el-date-picker v-model="dataForm.paymentDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;"
              :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '请选择付款日期' : '请选择退款日期'">
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

import { addfinPaymentRecords } from '@/api/financialManagement/index'
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
        accountsReceivableReconciliationId: 0,
        orderNo: '',
        totalReconciliationAmount: '',       // 应收 金额
        totalPaymentAmount: '',              // 已收
        dueAmount: '',                       // 待收
        id: 0,
        paymentAmount: 0,
        paymentDate: "",
        paymentMethod: "",
        reconciliationType: "payable",
        remark: ""
      },
      noZero:'',
      paymentMethodList: [
        { label: '转账', value: ' transfer_accounts' },
        { label: '汇票', value: ' draft' },
      ],
      btntype: false,
      dataRule: {
        paymentMethod: { required: true, message: '请选择付款方式', trigger: 'change' },
        paymentDate: [
          { required: true, message: '请选择付款日期', trigger: 'change' }
        ],
        paymentAmount: [
          { required: true, message: '请输入付款金额', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal2', params: [10, 2, "",] }), trigger: 'blur' },
          { validator: this.numCalcMethod(), trigger: 'blur' },
          { validator: this.formValidate('noZero', `付款金额不能为0`,), trigger: 'blur' }
        ],
      },
    }
  },
  created() {
  },
  methods: {
    numCalcMethod() {
      return (rule, value, callback) => {
        let msg = Number(this.dataForm.totalReconciliationAmount) > 0 ? "付款金额不能超过待付款金额" : '退款金额不能超过待退款金额'
        if (!value) { callback() }
        else {
          if (value > 0) {
            if (value > this.dataForm.dueAmount ) {
              callback(msg)
            } else { callback() }
          }else{
            if (Math.abs(value) < Math.abs(this.dataForm.dueAmount) ) {
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
            totalReconciliationAmount: res.data.totalReconciliationAmount,
            totalPaymentAmount: res.data.totalPaymentAmount ? res.data.totalPaymentAmount : 0,
            dueAmount: res.data.totalReconciliationAmount - (res.data.totalPaymentAmount ? res.data.totalPaymentAmount : 0),
            paymentMethod: '',
            reconciliationType: "payable",
            paymentDate: '',
            remark: '',
            paymentAmount: '',
            accountsReceivableReconciliationId: this.dataForm.accountsReceivableReconciliationId
          }
          this.dataForm.paymentAmount = this.dataForm.dueAmount
          if (Number(this.dataForm.totalReconciliationAmount) < 0) {
            this.dataRule.paymentMethod.message = '请选择退款方式'
            this.dataRule.paymentDate[0].message = '请选择退款日期'
            this.dataRule.paymentAmount[0].message = '请输入退款金额'
            this.noZero = '退款金额不能为0'
          }else{
            this.dataRule.paymentMethod.message = '请选择付款方式'
            this.dataRule.paymentDate[0].message = '请选择付款日期'
            this.dataRule.paymentAmount[0].message = '请输入付款金额'
            this.noZero = '付款金额不能为0'
          }
        })

      })
    },
    dataFormSubmit() {
      this.btnLoading = true;
      let queryData = {
        paymentRecords: this.dataForm
      }
      let msg = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (msg) {

            let formMethod = addfinPaymentRecords

            formMethod(queryData).then(res => {
              console.log(666, res);
              let msg = Number(this.dataForm.totalReconciliationAmount) >= 0 ? "付款成功" : '退款成功' 
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



        } else {
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
}</style>