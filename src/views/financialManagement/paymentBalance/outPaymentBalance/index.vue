<template>
  <Balances :showLabel="showLabel" :showLabel2="showLabel2" :showLabel3="showLabel3"
    :reconciliationType="listRequestObj.reconciliationType" :listMethod="paymentBalanceReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :searchListMore="searchListMore"
    :superQueryJson="superQueryJson" :columnList="columnList" />
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
        reconciliationType: 'outside_processing',
      },
      tableItems: [
        { prop: 'accountPeriod', label: '账期', minWidth: '100' },
        { prop: 'balanceState', label: '结存状态', minWidth: '120' },
        { prop: 'partnerName', label: '外协供应商名称', minWidth: '180', sortable: true },
        { prop: 'partnerCode', label: '外协供应商编码', minWidth: '160', sortable: true },
        { prop: 'paymentCycle', label: '付款周期',minWidth: '110', sortable: true },
        { prop: 'initPaymentAmount', label: '期初应付金额', minWidth: '142', sortable: true },
        { prop: 'currentBillingAmount', label: '本期收票金额', minWidth: '142', sortable: true },
        { prop: 'currentInboundOutboundAmount', label: '本期入库金额', minWidth: '142', sortable: true },
        { prop: 'duePaymentAmount', label: '到期应付金额', minWidth: '142', sortable: true },
        { prop: 'currentActualAmount', label: '本期实付金额', minWidth: '142', sortable: true },
        { prop: 'overduePaymentAmount', label: '逾期付款金额', minWidth: '142', sortable: true },
        { prop: 'endPaymentAmount', label: '期末应付金额', minWidth: '142', sortable: true },
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
      superQueryJson: [
        {
          prop: 'accountPeriod',
          label: '账期',
          type: 'input'
        },
        {
          prop: 'balanceState',
          label: '结存状态',
          type: 'select',
          options: [{ label: '未结存 ', value: 'not_finished' }, { label: '已结存 ', value: 'finished' }]
        },
        {
          prop: 'partnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'paymentCycle',
          label: '收款周期',
          type: 'input'
        }
      ],
      columnList: ['cooperativePartnerCode']
    }
  },
  created() {
  },
  computed: {
    showLabel() {
      let label = this.listRequestObj.reconciliationType !== 'receivable' ? '付' : '收'
      return label
    },
    showLabel2() {
      let label = this.listRequestObj.reconciliationType !== 'receivable' ? '入' : '出'
      return label
    },
    showLabel3() {
      let label = this.listRequestObj.reconciliationType !== 'receivable' ? '收' : '开'
      console.log(label);
      return label
    },
  },
}
</script>