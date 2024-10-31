<template>
  <Balances :showLabel="showLabel" :showLabel2="showLabel2" :showLabel3="showLabel3" :reconciliationType="listRequestObj.reconciliationType" :listMethod="paymentBalanceReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :searchListMore="searchListMore" />
</template>
  
<script>
import { paymentBalanceReport } from '@/api/balances/index'
import Balances from '@/views/financialManagement/components/balances/index.vue'
export default {
  name: 'salePayment',
  components: { Balances },
  data() {
    return {
      paymentBalanceReport,
      listRequestObj: {
        accountPeriod: this.jnpf.getToday('YYYY-MM'),
        balanceState: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        partnerCode: "",
        partnerName: "",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationType:'receivable',
      },
      tableItems: [
        { prop: 'accountPeriod', label: '账期', minWidth: '120' },
        { prop: 'balanceState', label: '结存状态', minWidth: '120' },
        { prop: 'partnerName', label: '客户名称',minWidth: '160' },
        { prop: 'partnerCode', label: '客户编码',minWidth: '160' },
        { prop: 'paymentCycle', label: '收款周期' },
        { prop: 'initPaymentAmount', label: '期初应收金额' },
        { prop: 'currentBillingAmount', label: '本期开票金额' },
        { prop: 'currentInboundOutboundAmount', label: '本期出库金额' },
        { prop: 'duePaymentAmount', label: '到期应收金额' },
        { prop: 'currentActualAmount', label: '本期实收金额' },
        { prop: 'overduePaymentAmount', label: '逾期收款金额' },
        { prop: 'endPaymentAmount', label: '期末应收金额' },
      ],
      searchList: [
        { prop: 'accountPeriod', label: '账期', type: 'date' },
        { prop: 'partnerCode', label: '客户编码', type: 'input' },
        { prop: 'partnerName', label: '客户名称', type: 'input' },
      ],
      searchListMore: [
        { prop: 'accountPeriod', label: '账期', type: 'date' },
        { prop: 'balanceState', label: '结存状态', type: 'select', options: [{ label: '未结存 ', value: 'not_finished', }, { label: '已结存 ', value: 'finished', }] },
        { prop: 'partnerCode', label: '客户编码', type: 'input' },
        { prop: 'partnerName', label: '客户名称', type: 'input' },
      ],
    }
  },
  created() {
  },
  computed:{
    showLabel(){
      let label = this.listRequestObj.reconciliationType !== 'receivable' ? '付' : '收'
      return label
    },
    showLabel2(){
      let label = this.listRequestObj.reconciliationType !== 'receivable' ? '入' : '出'
      return label
    },
    showLabel3(){
      let label = this.listRequestObj.reconciliationType !== 'receivable' ? '收' : '开'
      console.log(label);
      return label
    },
  },
}
</script>

  