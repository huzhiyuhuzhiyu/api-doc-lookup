<template>
  <paymentIndex :reconciliationType="listRequestObj.reconciliationType" :listMethod="getfinAccountsReport"
    :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList" :searchListMore="searchListMore" />
</template>
  
<script>
import { getfinAccountList, getfinAccountDetail, getfinAccountsReport } from '@/api/ReconciliaRePayments/index'
import paymentIndex from '@/views/financialManagement/components/pay/index.vue'
export default {
  name: 'outPayment',
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
        reconciliationType: "outside_processing",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        reconciliationDateArr: [],
      },
      tableItems: [
        { prop: 'orderNo', label: '对账流水号', minWidth: '180', sortable: 'custom'  },
        { prop: 'reconciliationDate', label: '对账日期', minWidth: '180', sortable: 'custom'  },
        { prop: 'cooperativePartnerCode', label: '外协供应商编码', minWidth: '160', sortable: 'custom'  },
        { prop: 'cooperativePartnerName', label: '外协供应商名称', minWidth: '160' , sortable: 'custom' },
        { prop: 'includingTaxAmount', label: '订单金额', sortable: 'custom'  },
        { prop: 'totalReconciliationAmount', label: '应付金额' , sortable: 'custom' },
        { prop: 'totalPaymentAmount', label: '已付款金额', minWidth: '160',sortable: 'custom'  },
        { prop: 'totalUnpaidAmount', label: '未付款金额', minWidth: '160',sortable: 'custom'  },
        { prop: 'totalInvoicingAmount', label: '已收票金额',minWidth: '160', sortable: 'custom'  },
        { prop: 'totalNotInvoicedAmount', label: '未收票金额',minWidth: '160', sortable: 'custom' },
        { prop: 'remark', label: '备注' },
        { prop: 'createTime', label: '创建时间', minWidth: '180' },
        { prop: 'createByName', label: '创建人' },
      ],
      searchList: [
        { prop: 'paymentStatus', label: '付款状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date' },
        { prop: 'cooperativePartnerName', label: '外协供应商名称', type: 'input' },
      ],
      searchListMore: [
        { prop: 'orderNo', label: '对账流水号', type: 'input' },
        { prop: 'reconciliationDateArr', label: '对账日期', type: 'date', },
        { prop: 'cooperativePartnerCode', label: '外协供应商编码', type: 'input' },
        { prop: 'cooperativePartnerName', label: '外协供应商名称', type: 'input' },
        { prop: 'paymentStatus', label: '付款状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
        { prop: 'invoiceStatus', label: '收票状态', type: 'select', options: [{ label: '未完成 ', value: 'not_finished', }, { label: '已完成 ', value: 'finished', }] },
      ],
    }
  },
  created() {
  },

}
</script>

  