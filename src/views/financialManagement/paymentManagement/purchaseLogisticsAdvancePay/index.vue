<template>
  <advancePayIndex
    :reconciliationType="listRequestObj.reconciliationType"
    :listMethod="getfinPaymentReport"
    :listRequestObj="listRequestObj"
    :tableItems="tableItems"
    :searchList="searchList"
    :searchListMore="searchListMore"
    :delMethod="delfinPayment"
    :PartnerMethodArr="PartnerMethodArr"
    :PartnerTableItems="PartnerTableItems"
    :PartnerTableSearchList="PartnerTableSearchList"
    :PartnerListRequestObj="PartnerListRequestObj"
  />
</template>

<script>
import { delfinPayment, getfinPaymentReport } from '@/api/financialManagement'
import advancePayIndex from '@/views/financialManagement/components/payAndcollect/advancePay.vue'
import { getcategoryTree } from "@/api/basicData"; //供应商数据
export default {
  name: 'prepaymentManagement',
  components: { advancePayIndex },
  data() {
    return {
      delfinPayment,
      getfinPaymentReport,
      listRequestObj: {
        cooperativePartnerId: '',
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
        pageSize: 20,
        reconciliationDate: '',
        paymentEndDate: "",
        paymentStartDate: "",
        reconciliationType: "payable_logistics",
        startTime: "",
        paymentDateArr: [],
        createTimeArr: [],
        prePayFlag: 1,           //预收付款标识
        // sourceList: ['factory', 'mrp', 'sale'],
      },
      tableItems: [
        { prop: 'partnerCode', label: '供应商编码', minWidth: '180', sortable: 'custom' },
        { prop: 'partnerName', label: '供应商名称', minWidth: '180', sortable: 'custom' },
        { prop: 'paymentAmount', label: '付款金额' },
        { prop: 'remainingAmount', label: '剩余金额' },
        { prop: 'paymentMethod', label: '付款方式' },
        { prop: 'paymentDate', label: '付款日期', minWidth: '180', sortable: 'custom' },
        { prop: 'remark', label: '备注' },
        { prop: 'createTime', label: '创建时间', minWidth: '180', sortable: 'custom' },
        { prop: 'createByName', label: '创建人' },
      ],
      searchList: [
        { prop: 'partnerCode', label: '供应商编码', type: 'input' },
        { prop: 'partnerName', label: '供应商名称', type: 'input' },
        { prop: 'paymentDateArr', label: '付款', type: 'date' },
      ],
      searchListMore: [
        { prop: 'partnerCode', label: '供应商编码', type: 'input' },
        { prop: 'partnerName', label: '供应商名称', type: 'input' },
        { prop: 'paymentMethod', label: '付款方式', type: 'select', options: [{ label: '转账', value: 'transfer_accounts', }, { label: '汇票', value: 'draft', }] },
        { prop: 'paymentDateArr', label: '付款日期', type: 'date', showLabel: '付款' },
        { prop: 'createTimeArr', label: '创建时间', type: 'dateTime' },
      ],

      //  供应商 树请求
      PartnerMethodArr: {
        method: getcategoryTree,
        requestObj: {
          type: "supplier"
        }
      },
      // 供应商 列表
      PartnerTableItems: [
        { prop: "code", label: "供应商编码", fixed: "left" },
        { prop: "name", label: "供应商名称", fixed: "left" },
        { prop: "nameEn", label: "英文名称" },
        { prop: "taxId", label: "税号" }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: "code", label: "供应商编码", type: "input" },
        { prop: "name", label: "供应商名称", type: "input" }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "supplier"
      },
    }
  },

}
</script>
