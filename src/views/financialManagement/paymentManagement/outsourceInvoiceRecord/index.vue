<template>
  <paymentIndex :reconciliationType="listRequestObj.reconciliationType" :listMethod="getfinInvoiceReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :superQueryJson="superQueryJson"
    :columnList="columnList" />
</template>

<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import { getfinInvoiceReport } from '@/api/financialManagement/index'
import paymentIndex from '@/views/financialManagement/components/collect/invoiceRecord.vue'
export default {
  name: 'outPayment',
  components: { paymentIndex },
  data() {
    return {
      getfinInvoiceReport,
      listRequestObj: {
        approvalStatus: 'ok',
        billingStatus: '',
        cooperativePartnerCode: '',
        cooperativePartnerId: '',
        cooperativePartnerName: '',
        createByName: '',
        createEndTime: '',
        createStartTime: '',
        documentStatus: '',
        endTime: '',
        endUpdateTime: '',
        invoiceStatus: '',
        keyword: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        paymentStatus: 'not_finished',
        reconciliationEndDate: '',
        reconciliationStartDate: '',
        reconciliationType: 'outside_processing',
        startTime: '',
        startUpdateTime: '',
        totalRowFlag: false,
        reconciliationDateArr: []
      },
      tableItems: [
        { prop: 'orderNo', label: '对账单号', minWidth: '180', sortable: true },
        { prop: 'cooperativePartnerName', label: '客户名称', minWidth: '160', sortable: true },
        { prop: 'cooperativePartnerCode', label: '客户编码', minWidth: '160', sortable: true },
        { prop: 'invoicingAmount', label: '收票金额', sortable: true },
        { prop: 'invoiceDate', label: '开票日期', minWidth: '160', sortable: true },
        { prop: 'invoiceCode', label: '发票代码', minWidth: '160', sortable: true },
        { prop: 'invoiceNumber', label: '发票号码', minWidth: '160', sortable: true },
        {
          prop: 'inventoryStatus',
          label: '入账状态',
          minWidth: '160',
          type: 'select',
          sortable: true,
          options: [{ label: '已入账', value: 'already_credited' }, { label: '未入账', value: 'not_credited' }]
        },
        { prop: 'remark', label: '备注' },
        { prop: 'createTime', label: '创建时间', minWidth: '180', sortable: true },
        { prop: 'createByName', label: '创建人', sortable: true }
      ],
      searchList: [
        { prop: 'orderNo', label: '对账单号', type: 'input' },
        { prop: 'cooperativePartnerName', label: '客户名称', type: 'input' },
        { prop: 'reconciliationDateArr', label: '开票日期', type: 'date' }
      ],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '对账单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'invoiceDate',
          label: '收票日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'invoiceCode',
          label: '发票代码',
          type: 'input'
        },
        {
          prop: 'invoiceNumber',
          label: '发票号码',
          type: 'input'
        },
        {
          prop: 'inventoryStatus',
          label: '入账状态',
          type: 'select',
          options: [{ label: '已入账', value: 'already_credited' }, { label: '未入账', value: 'not_credited' }]
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
        }
      ],
      columnList: ['cooperativePartnerCode', 'createByName']
    }
  },
  created() { }
}
</script>
