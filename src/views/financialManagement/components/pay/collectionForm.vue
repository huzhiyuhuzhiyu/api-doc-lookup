<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="showLabel + '款'" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{
            $t("common.cancelButton")
          }}</el-button>
        </div>
      </div>
      <div class="main" ref="main">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

            <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
              label-width="120px">
              <el-row :gutter="30">
                <el-col :span="6">
                  <el-form-item label="对账单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号" maxlength="20" disabled />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '应' + showLabel + '金额' : '应退金额'"
                    prop="totalReconciliationAmount">
                    <el-input v-model="dataForm.totalReconciliationAmount"
                      :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '应' + showLabel + '金额' : '应退金额'"
                      maxlength="20" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="Number(dataForm.totalReconciliationAmount) >= 0 ? '待' + showLabel + '金额' : '待退金额'"
                    prop="dueAmount">
                    <el-input v-model="dataForm.dueAmount"
                      :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '待' + showLabel + '金额' : '待退金额'"
                      maxlength="20" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="Number(dataForm.totalReconciliationAmount) >= 0">
                  <el-form-item label="抵扣金额" prop="deductionAmount">
                    <el-input v-model="deductionAmount" maxlength="20" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? showLabel + '款方式' : '退款方式'"
                    prop="paymentMethod">
                    <el-select v-model="dataForm.paymentMethod"
                      :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '请选择' + showLabel + '款方式' : '请选择退款方式'"
                      clearable style="width: 100%;">
                      <el-option v-for="(item, index) in paymentMethodList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? showLabel + '款金额' : '退款金额'"
                    prop="paymentAmount">
                    <el-input v-model="paymentAmount" :disabled="paymentAmount === 0"
                      :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '请输入' + showLabel + '款金额' : '请输入退款金额'"
                      maxlength="20" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">

                  <el-form-item :label="Number(dataForm.totalReconciliationAmount) >= 0 ? showLabel + '款日期' : '退款日期'"
                    prop="paymentDate">
                    <el-date-picker v-model="dataForm.paymentDate" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;"
                      :placeholder="Number(dataForm.totalReconciliationAmount) >= 0 ? '请选择' + showLabel + '款日期' : '请选择退款日期'">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
                      :disabled="btntype ? true : false" placeholder="请输入备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="预收款信息" name="productInfo" v-if="Number(dataForm.totalReconciliationAmount) >= 0">
            <div style="display: flex;flex-direction: column;" :style="{ height: height + 'px' }">
              <JNPF-table @selection-change="handeleProductInfoData" :hasC="type != 'look'" fixedNO
                v-loading="formLoading" :data="payData" custom-column ref="payRef" :checkSelectable="checkSelectable">

                <el-table-column prop="remainingAmount" :label="showLabel + '款剩余金额'" min-width="160" />
                <el-table-column prop="paymentDate" :label="showLabel + '款日期'" min-width="180" />
                <el-table-column prop="paymentMethod" :label="showLabel + '款方式'" min-width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.paymentMethod === 'transfer_accounts'">转账</div>
                    <div v-if="scope.row.paymentMethod === 'draft'">汇票</div>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="createByName" label="创建人" width="100" />
              </JNPF-table>
            </div>

          </el-collapse-item>
        </el-collapse>

      </div>
    </div>
  </transition>
</template>

<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'

import { addfinInvoiceRecords, getfinPaymentRecords, addfinPaymentRecords } from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  components: {
  },
  props: {
    reconciliationType: {
      type: String,
      required: true
    },
  },
  computed: {
    showLabel() {
      let label = this.reconciliationType !== 'receivable' ? '付' : '收'
      return label
    },
  },
  data() {
    return {
      height: 0,
      activeNames: ['productInfo', 'basicInfo'],
      payData: [],
      payForm: {
        partnerId: '',
        createByName: "",
        endTime: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: -1,
        reconciliationDate: '',
        paymentEndDate: "",
        paymentStartDate: "",
        reconciliationType: "receivable",
        startTime: "",
        paymentDateArr: [],
        createTimeArr: [],
        sourcePaymentRecordsId: '',
        remainLtZero: 1,     // "剩余预收付款>0 0否 1是"
        prePayFlag: 1,       // 预收付款列表标识 0否 1是"
      },
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
      paymentAmount: 0,
      deductionAmount: 0,
      noZero: '',
      paymentMethodList: [
        { label: '转账', value: ' transfer_accounts' },
        { label: '汇票', value: ' draft' },
      ],
      btntype: false,
      dataRule: {
        paymentMethod: { required: true, message: this.reconciliationType != 'receivable' ? '请选择付款方式' : '请选择收款方式', trigger: 'change' },
        paymentDate: [
          { required: true, message: this.reconciliationType != 'receivable' ? '请选择付款日期' : '请选择收款日期', trigger: 'change' }
        ],
        paymentAmount: [
          { required: true, message: this.reconciliationType != 'receivable' ? '请输入付款金额' : '请输入收款金额', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal2', params: [10, 2, "",] }), trigger: 'blur' },
          { validator: this.numCalcMethod(), trigger: 'blur' },
          // { validator: this.formValidate('noZero', `付款金额不能为0`,), trigger: 'blur' }
        ],
      },
    }
  },
  created() {
  },
  mounted() {
    this.switchStyle()
  },
  methods: {
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      console.log(this.$refs.main, 'this.$refs.main')
      let allHeight = this.$refs.main.clientHeight
      console.log(allHeight, 'allHeight')
      // let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      // let Heightradio = this.$refs.radio.clientHeight
      this.height = (allHeight - 425) < 340 ? 340 : (allHeight - 425)
      console.log(this.height, 'this.height')
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    goBack() {
      this.$emit("close", true);
    },
    checkSelectable(row) {
      return !row.disabled
    },
    numCalcMethod() {
      return (rule, value, callback) => {
        let msg = Number(this.dataForm.totalReconciliationAmount) > 0 ? this.showLabel + '款金额不能超过待' + this.showLabel + '款金额' : '退款金额不能超过待退款金额'
        if (!value) { callback() }
        else {
          if (value > 0) {
            if (value > this.dataForm.dueAmount) {
              callback(msg)
            } else { callback() }
          } else {
            if (Math.abs(value) > Math.abs(this.dataForm.dueAmount)) {
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
            reconciliationType: res.data.reconciliationType,
            paymentDate: '',
            remark: '',
            paymentAmount: '',
            duePayAmount: res.data.totalReconciliationAmount - (res.data.totalPaymentAmount ? res.data.totalPaymentAmount : 0),
            accountsReceivableReconciliationId: this.dataForm.accountsReceivableReconciliationId
          }
          this.paymentAmount = this.dataForm.dueAmount
          this.payForm.partnerId = res.data.cooperativePartnerId
          this.payForm.reconciliationType = res.data.reconciliationType
          this.orgainDataForm = JSON.parse(JSON.stringify(this.dataForm))
          if (Number(this.dataForm.totalReconciliationAmount) < 0) {
            this.dataRule.paymentMethod.message = '请选择退款方式'
            this.dataRule.paymentDate[0].message = '请选择退款日期'
            this.dataRule.paymentAmount[0].message = '请输入退款金额'
            this.noZero = '退款金额不能为0'
          } else {
            this.dataRule.paymentMethod.message = '请选择' + this.showLabel + '款方式'
            this.dataRule.paymentDate[0].message = '请选择' + this.showLabel + '款日期'
            this.dataRule.paymentAmount[0].message = '请输入' + this.showLabel + '款金额'
            this.noZero = this.showLabel + '款金额不能为0'
          }
          getfinPaymentRecords(this.payForm).then(res => {
            console.log(res, 'iuuu')
            console.log(this.dataForm.dueAmount, 'oii')
            if (this.dataForm.dueAmount < 0) {
              this.payData = res.data.records.map(item => {
                return {
                  ...item,
                  disabled: true
                }
              })
              console.log(this.payData, '[]')
            } else {
              this.payData = res.data.records
              console.log(this.payData, 'day')
            }
            this.formLoading = false
          })
        })

      })
    },
    dataFormSubmit() {
      this.btnLoading = true;
      this.dataForm.reconciliationType = this.reconciliationType
      this.dataForm.paymentAmount = Number(this.paymentAmount) + Number(this.deductionAmount)
      let queryData = {
        paymentRecords: this.dataForm,
        prePayIdList: this.prePayIdList
      }
      let msg = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (msg) {

            let formMethod = addfinPaymentRecords

            formMethod(queryData).then(res => {
              console.log(666, res);
              let msg = Number(this.dataForm.totalReconciliationAmount) >= 0 ? this.showLabel + "款成功" : '退款成功'
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
    },
    // 处理与抵扣金额方法
    handleAmount(arr) {
      console.log(arr, 'ppiijjj')
      let remaining = this.dataForm.duePayAmount
      const newArr = arr.map(obj => {
        const num = +obj.remainingAmount
        let newNum = 0;
        if (remaining >= num) {
          newNum = num;
          remaining -= num;
        } else {
          newNum = remaining;
          remaining = 0;
        }
        return { num: num - newNum, id: obj.id, deductionAmount: newNum };
      });
      return newArr
    },
    // 选中列表的数据 将其带到进行抵抗计算 传值等
    handeleProductInfoData(val) {
      console.log(val, 'pppp')
      this.selectData = val
      this.deductionAmount = 0
      this.dataForm.dueAmount = this.orgainDataForm.dueAmount
      //  勾选id数组
      if (this.selectData.length !== 0) {
        const numArr = this.handleAmount(this.selectData)
        console.log(numArr, 'numArr')
        this.prePayIdList = numArr.map(item => item.id)
        this.deductionAmount = numArr.reduce((acc, item) => {
          console.log(acc, 'acc')
          console.log(item.deductionAmount, 'pppp')
          return acc * 1 + item.deductionAmount * 1
        }, 0)
        this.dataForm.deductionAmount = this.deductionAmount

        console.log(this.deductionAmount, 'this.dataForm.deductionAmount')
      } else {
        this.prePayIdList = []
        this.deductionAmount = 0
        this.dataForm.deductionAmount = this.deductionAmount
      }
      this.paymentAmount = Number(this.dataForm.dueAmount) - Number(this.deductionAmount)
    },
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

.main {
  padding: 10px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}

.JNPF-preview-main .main {
  padding-top: 5px;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}
</style>