<template>
  <paymentIndex
    :reconciliationType="listRequestObj.reconciliationType"
    :listMethod="getfinAccountsReport"
    :listRequestObj="listRequestObj"
    :tableItems="tableItems"
    :searchList="searchList"
    :searchListMore="searchListMore"
  />
</template>

<script>
import { getfinAccountsReport } from '@/api/ReconciliaRePayments'
import paymentIndex from '@/views/financialManagement/components/pay/index.vue'

export default {
  name: 'factoryPayment',
  components: { paymentIndex },
  data() {
    return {
      getfinAccountsReport,
      listRequestObj: {
        approvalStatus: "ok",
        billingStatus: "",
        cooperativePartnerCode: "",
        cooperativePartnerId: '',
        cooperativePartnerName: "",
        createByName: "",
        createEndTime: "",
        createStartTime: "",
        documentStatus: "",
        endTime: "",
        endUpdateTime: "",
        invoiceStatus: "",
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
        pageSize: 20,
        paymentStatus: "not_finished",
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: "payable_logistics",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
        // sourceList: ['factory', 'mrp', 'sale'],
      },
      tableItems: [
        { prop: 'orderNo', label: '对账流水号', minWidth: '180', sortable: 'custom' },
        { prop: 'cooperativePartnerName', label: '供应商名称', minWidth: '160', sortable: 'custom' },
        { prop: 'cooperativePartnerCode', label: '供应商编码', minWidth: '160', sortable: 'custom' },
        { prop: 'reconciliationDate', label: '对账日期', minWidth: '180', sortable: 'custom' },
        { prop: 'includingTaxAmount', label: '出入库金额', minWidth: '160', sortable: 'custom' },
        { prop: 'totalReconciliationAmount', label: '应付金额', sortable: 'custom' },
        { prop: 'totalPaymentAmount', label: '已付款金额', minWidth: '160', sortable: 'custom' },
        { prop: 'totalUnpaidAmount', label: '未付款金额', minWidth: '160', sortable: 'custom' },
        { prop: 'remark', label: '备注' },
      ],
      searchList: [
        { prop: 'paymentStatus', label: '付款状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'cooperativePartnerName', label: '供应商名称', type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date' },
      ],
      searchListMore: [
        { prop: 'orderNo', label: '对账流水号', type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date', },
        { prop: 'cooperativePartnerCode', label: '供应商编码', type: 'input' },
        { prop: 'cooperativePartnerName', label: '供应商名称', type: 'input' },
        { prop: 'paymentStatus', label: '付款状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'invoiceStatus', label: '收票状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
      ],
    }
  },
}
</script>

