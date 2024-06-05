<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="收票" />
          <div class="options">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
            <el-button @click="goBack">{{
              $t("common.cancelButton")
            }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-row :gutter="30">
                <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
                  label-width="120px">
                  <el-col :span="8">
                    <el-form-item label="对账单号" prop="orderNo">
                      <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号" maxlength="20" disabled />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="账单金额" prop="totalReconciliationAmount">
                      <el-input v-model="dataForm.totalReconciliationAmount" placeholder="账单金额" maxlength="20" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="待付款金额" prop="duePayAmount">
                      <el-input v-model="dataForm.duePayAmount" maxlength="20" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="抵扣金额" prop="deductionAmount">
                      <el-input v-model="dataForm.deductionAmount" maxlength="20" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="待收票金额" prop="dueAmount">
                      <el-input v-model="dataForm.dueAmount" placeholder="待收票金额" maxlength="20" disabled />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="收票金额" prop="invoicingAmount">
                      <el-input v-model="dataForm.invoicingAmount" placeholder="请输入收票金额" maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发票代码" prop="invoiceCode">
                      <el-input v-model="dataForm.invoiceCode" placeholder="请输入发票代码" maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发票号码" prop="invoiceNumber">
                      <el-input v-model="dataForm.invoiceNumber" placeholder="请输入发票号码" maxlength="20" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="开票日期" prop="invoiceDate">
                      <el-date-picker v-model="dataForm.invoiceDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%" placeholder="请选择开票日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
                        :disabled="btntype ? true : false" placeholder="请输入备注" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="预付款信息" name="receiverInfo">
              <div style="display: flex;flex-direction: column;height: 100%;">
                <JNPF-table @selection-change="handeleProductInfoData" hasC fixedNO v-loading="formLoading"
                  :data="payData" custom-column ref="payRef" :checkSelectable="checkSelectable">
                  <el-table-column prop="remainingAmount" label="付款剩余金额" min-width="160" />
                  <el-table-column prop="paymentDate" label="付款日期" min-width="180" />
                  <el-table-column prop="paymentMethod" label="付款方式" min-width="160">
                    <template slot-scope="scope">
                      <div v-if="scope.row.paymentMethod === 'transfer_accounts'">转账</div>
                      <div v-if="scope.row.paymentMethod === 'draft'">汇票</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="160" />
                  <el-table-column prop="createTime" label="创建时间" min-width="160" />
                  <el-table-column prop="createByName" label="创建人" min-width="140" />
                </JNPF-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getfinAccountList,
  getfinAccountDetail,
} from "@/api/ReconciliaRePayments/index";
import { addfinInvoiceRecords, getfinPaymentRecords } from "@/api/financialManagement/index";
import formValidate from "@/utils/formValidate";
export default {
  components: {},
  data() {
    return {
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        accountsReceivableReconciliationId: "",
        id: 0,
        invoiceCode: "",
        invoiceDate: "",
        invoiceNumber: "",
        invoicingAmount: 0,
        remark: "",
        reconciliationType: "payable",
        includingTaxAmount: "",
        deductionAmount: 0, // 抵扣金额
        duePayAmount: 0, // 待收付款金额
        dueAmount: 0,    //  待收票金额 
      },

      btntype: false,
      dataRule: {
        paymentMethod: [
          { required: true, message: "请选择付款方式", trigger: "change" },
        ],
        invoiceDate: [
          { required: true, message: "请选择开票日期", trigger: "change" },
        ],
        // invoiceCode:[{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        invoiceNumber: [
          { required: true, message: "请输入发票号码", trigger: "blur" },
        ],
        invoicingAmount: [
          { required: true, message: "请输入收票金额", trigger: "blur" },
          {
            validator: this.formValidate({
              type: "decimal2",
              params: [10, 2, ""],
            }),
            trigger: "blur",
          },
          { validator: this.numCalcMethod(), trigger: "blur" },
          // { validator: this.formValidate('noZero', '收票金额不能为0', ), trigger: 'blur' }
        ],
      },
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
        reconciliationType: "payable",
        startTime: "",
        paymentDateArr: [],
        createTimeArr: [],
        sourcePaymentRecordsId: '',
        remainLtZero: 1,     // "剩余预收付款>0 0否 1是"
        prePayFlag: 1,       // 预收付款列表标识 0否 1是"
      },
      totalList: [],
      total: 0,
      showTab: false,
      selectData: [],
      deductionAmount: 0,
      prePayIdList:[],
      orgainDataForm:{},
    };
  },
  created() { },
  methods: {
    goBack() {
      this.$emit("close",true);
    },
    numCalcMethod() {
      return (rule, value, callback) => {
        let msg = "收票金额不能超过待收金额";
        if (!value) {
          callback();
        } else {
          if (value > 0) {
            if (value > this.dataForm.dueAmount) {
              callback(msg);
            } else {
              callback();
            }
          } else {
            if (Math.abs(value) > Math.abs(this.dataForm.dueAmount)) {
              callback(msg);
            } else {
              callback();
            }
          }
        }
      };
    },
    checkSelectable(row) {
      return !row.disabled
    },
    init(id, type) {
      // this.visible = true 
      this.dataForm.accountsReceivableReconciliationId = id;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.loading = true;
        getfinAccountDetail(this.dataForm.accountsReceivableReconciliationId).then((res) => { 
          this.dataForm = {
            id: "",
            orderNo: res.data.orderNo,
            includingTaxAmount: res.data.includingTaxAmount,
            totalInvoicingAmount: res.data.totalInvoicingAmount ? res.data.totalInvoicingAmount : 0,
            totalReconciliationAmount: res.data.totalReconciliationAmount ? res.data.totalReconciliationAmount : 0,
            dueAmount: res.data.totalReconciliationAmount < 0 ? -(Math.abs(res.data.totalReconciliationAmount) - Math.abs(res.data.totalInvoicingAmount ? res.data.totalInvoicingAmount : 0)) : Math.abs(res.data.totalReconciliationAmount) - Math.abs(res.data.totalInvoicingAmount ? res.data.totalInvoicingAmount : 0),
            accountsReceivableReconciliationId: this.dataForm.accountsReceivableReconciliationId,
            invoiceCode: "",
            invoiceDate: this.jnpf.getToday(),
            invoiceNumber: "",
            invoicingAmount: 0,
            remark: "",
            reconciliationType: "payable",
            duePayAmount: res.data.totalReconciliationAmount - (res.data.totalPaymentAmount ? res.data.totalPaymentAmount : 0),
            deductionAmount: 0,
          };
          this.dataForm.invoicingAmount = this.dataForm.dueAmount;
          this.payForm.partnerId = res.data.cooperativePartnerId
          this.orgainDataForm = JSON.parse(JSON.stringify(this.dataForm))
          getfinPaymentRecords(this.payForm).then(res => {
            if (this.dataForm.dueAmount < 0){
              this.payData = res.data.records.map(item=>{
                return {
                  ...item,
                  disabled:true
                }
              })
            }else{
              this.payData = res.data.records
            }
            this.formLoading = false
          })
        });
      });
    },
    // 处理与抵扣金额方法
    handleAmount(arr) {
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
    dataFormSubmit() {
      this.btnLoading = true;
      let queryData = {
        invoiceRecords: {
          ...this.dataForm,
          prePayIdList:this.prePayIdList,
        },
      };
      let msg = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (msg) {
            let formMethod = addfinInvoiceRecords;

            formMethod(queryData).then((res) => { 
              let msg = "收票成功";
              this.$message({
                message: msg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.btnLoading = false;
                  this.$emit("close", true);
                },
              });
            })
              .catch(() => {
                this.btnLoading = false;
              });
          }
        } else {
          this.btnLoading = false;
        }
      });
    },
    // 选中列表的数据 将其带到进行抵抗计算 传值等
    handeleProductInfoData(val) {
      this.selectData = val
      this.dataForm.deductionAmount = 0
      this.dataForm.dueAmount = this.orgainDataForm.dueAmount
      //  勾选id数组
      if (this.selectData.length) {
        const numArr = this.handleAmount(this.selectData) 
        this.prePayIdList = numArr.map(item => item.id)
        this.dataForm.deductionAmount = numArr.reduce((acc, item) => {
          return acc * 1 + item.deductionAmount * 1
        }, 0)
      }else{
        this.prePayIdList = []
        this.dataForm.deductionAmount = 0
      }
    },
  },
};
</script>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.main {
  padding: 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: calc(100% - 47px) !important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep #pane-receiverInfo {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}
</style>
