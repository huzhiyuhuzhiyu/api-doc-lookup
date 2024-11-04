<template>
  <paymentIndex :reconciliationType="listRequestObj.reconciliationType" :listMethod="getfinAccountsReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :searchListMore="searchListMore"
    :superQueryJson="superQueryJson" :columnList="columnList" />
</template>

<script>
import { getfinAccountList, getfinAccountDetail, getfinAccountsReport } from '@/api/ReconciliaRePayments/index'
import paymentIndex from '@/views/financialManagement/components/collect/index.vue'
export default {
  name: 'purchasePayment',
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
        invoiceStatus: "not_finished",
        reconciliationEndDate: "",
        reconciliationStartDate: "",
        reconciliationType: "payable",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
      },
      tableItems: [
        { prop: 'orderNo', label: '对账流水号', minWidth: '180' },
        { prop: 'reconciliationDate', label: '对账日期', minWidth: '180' },
        { prop: 'cooperativePartnerCode', label: '供应商编码' },
        { prop: 'cooperativePartnerName', label: '供应商名称' },
        { prop: 'includingTaxAmount', label: '订单金额' },
        { prop: 'totalReconciliationAmount', label: '应付金额' },
        { prop: 'totalPaymentAmount', label: '已付款金额' },
        { prop: 'totalUnpaidAmount', label: '未付款金额' },
        { prop: 'totalInvoicingAmount', label: '已收票金额' },
        { prop: 'totalNotInvoicedAmount', label: '未收票金额' },
        { prop: 'remark', label: '备注' },
        { prop: 'createTime', label: '创建时间', minWidth: '180' },
        { prop: 'createByName', label: '创建人' },
      ],
      searchList: [
        { prop: 'invoiceStatus', label: '付款状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date' },
        { prop: 'cooperativePartnerName', label: '供应商名称', type: 'input' },
      ],
      searchListMore: [
        { prop: 'orderNo', label: '对账流水号', type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date', },
        { prop: 'cooperativePartnerCode', label: '供应商编码', type: 'input' },
        { prop: 'cooperativePartnerName', label: '供应商名称', type: 'input' },
        { prop: 'paymentStatus', label: '付款状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'invoiceStatus', label: '收票状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
      ],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '对账流水号',
          type: 'input'
        },

        {
          prop: 'reconciliationDate',
          label: '对账日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },

      ],
      columnList: ['cooperativePartnerCode'],
    }
  },
  created() {
  },

}
</script>