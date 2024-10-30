<template>
  <Balances :showLabel="showLabel" :showLabel2="showLabel2" :showLabel3="showLabel3" :reconciliationType="listRequestObj.reconciliationType" :listMethod="paymentBalanceReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :searchListMore="searchListMore" />
</template>
  
<script>
import { paymentBalanceReport } from '@/api/balances/index'
import Balances from '@/views/financialManagement/components/balances/index.vue'
export default {
  name: 'outPaymentBalance',
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
        reconciliationType:'outside_processing',
      },
      tableItems: [
        { prop: 'accountPeriod', label: '账期', minWidth: '180' },
        { prop: 'balanceState', label: '结存状态', minWidth: '120' },
        { prop: 'partnerCode', label: '外协供应商编码', minWidth: '140' },
        { prop: 'partnerName', label: '外协供应商名称', minWidth: '260' },
        { prop: 'paymentCycle', label: '付款周期' },
        { prop: 'initPaymentAmount', label: '期初应付金额' },
        { prop: 'currentBillingAmount', label: '本期收票金额' },
        { prop: 'currentInboundOutboundAmount', label: '本期入库金额' },
        { prop: 'duePaymentAmount', label: '到期应付金额' },
        { prop: 'currentActualAmount', label: '本期实付金额' },
        { prop: 'overduePaymentAmount', label: '逾期付款金额' },
        { prop: 'endPaymentAmount', label: '期末应付金额' },
      ],
      searchList: [
        { prop: 'accountPeriod', label: '账期', type: 'date' },
        { prop: 'partnerCode', label: '外协供应商编码', type: 'input' },
        { prop: 'partnerName', label: '外协供应商名称', type: 'input' },
      ],
      searchListMore: [
        { prop: 'accountPeriod', label: '账期', type: 'date' },
        { prop: 'balanceState', label: '结存状态', type: 'select', options: [{ label: '未结存 ', value: 'not_finished', }, { label: '已结存 ', value: 'finished', }] },
        { prop: 'partnerCode', label: '外协供应商编码', type: 'input' },
        { prop: 'partnerName', label: '外协供应商名称', type: 'input' },
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

  