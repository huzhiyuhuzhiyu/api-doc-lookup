<template>
  <paymentIndex :reconciliationType="listRequestObj.reconciliationType" :listMethod="getfinAccountsReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :superQueryJson="superQueryJson"
    :columnList="columnList" />
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
        reconciliationType: "receivable",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
      },
      tableItems: [
        { prop: 'orderNo', label: '对账流水号', minWidth: '180' },
        { prop: 'cooperativePartnerCode', label: '客户编码', minWidth: '160' },
        { prop: 'cooperativePartnerName', label: '客户名称', minWidth: '160' },
        { prop: 'reconciliationDate', label: '对账日期', minWidth: '180' },
        { prop: 'includingTaxAmount', label: '出入库金额', minWidth: '160' },
        { prop: 'totalReconciliationAmount', label: '应付金额', minWidth: '160' },
        { prop: 'totalPaymentAmount', label: '已收款金额', minWidth: '160' },
        { prop: 'totalUnpaidAmount', label: '未收款金额', minWidth: '160' },
        // { prop: 'totalInvoicingAmount', label: '已开票金额' },
        // { prop: 'totalNotInvoicedAmount', label: '未开票金额' },
        { prop: 'remark', label: '备注' },
        // { prop: 'createTime', label: '创建时间' , minWidth: '180'},
        // { prop: 'createByName', label: '创建人' },
      ],
      searchList: [
        { prop: 'invoiceStatus', label: '开票状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'cooperativePartnerName', label: '客户名称', type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date' },
      ],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '对账流水号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '客户编码',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '客户名称',
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