<template>
    <advancePayIndex :reconciliationType="listRequestObj.reconciliationType" :listMethod="getfinPaymentReport"
        :listRequestObj="listRequestObj" :tableItems="tableItems" :searchList="searchList"
        :searchListMore="searchListMore" :delMethod="delfinPayment" :PartnerMethodArr="PartnerMethodArr"
        :PartnerTableItems="PartnerTableItems" :PartnerTableSearchList="PartnerTableSearchList"
        :PartnerListRequestObj="PartnerListRequestObj" />
</template>

<script>
import { getfinPaymentReport, delfinPayment } from '@/api/financialManagement/index'
import advancePayIndex from '@/views/financialManagement/components/payAndcollect/advancePay.vue'
import { getcategoryTree } from "@/api/basicData/index"; //供应商数据
export default {
    name: 'saleAdvancePayment',
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
                reconciliationType: "receivable",
                startTime: "",
                paymentDateArr: [],
                createTimeArr: [],
                prePayFlag: 1,           //预收付款标识
            },
            tableItems: [
                { prop: 'partnerName', label: '客户名称', sortable: 'custom' },
                { prop: 'partnerCode', label: '客户编码', sortable: 'custom' },
                { prop: 'paymentAmount', label: '收款金额' },
                { prop: 'remainingAmount', label: '剩余金额' },
                { prop: 'paymentMethod', label: '收款方式' },
                { prop: 'paymentDate', label: '收款日期', minWidth: '180', sortable: 'custom' },
                { prop: 'remark', label: '备注' },
                { prop: 'createTime', label: '创建时间', minWidth: '180', sortable: 'custom' },
                { prop: 'createByName', label: '创建人' },
            ],
            searchList: [
                { prop: 'partnerName', label: '客户名称', type: 'input' },
                { prop: 'partnerCode', label: '客户编码', type: 'input' },

                { prop: 'paymentDateArr', label: '收款', type: 'date' },
            ],
            searchListMore: [
                { prop: 'partnerCode', label: '客户编码', type: 'input' },
                { prop: 'partnerName', label: '客户名称', type: 'input' },
                { prop: 'paymentMethod', label: '收款方式', type: 'select', options: [{ label: '转账', value: 'transfer_accounts', }, { label: '汇票', value: 'draft', }] },
                { prop: 'paymentDateArr', label: '收款日期', type: 'date', showLabel: '收款' },
                { prop: 'createTimeArr', label: '创建时间', type: 'dateTime' },
            ],

            PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'customer', } },
            // 供应商 列表
            PartnerTableItems: [
                { prop: 'code', label: '客户编码', fixed: 'left' },
                { prop: 'name', label: '客户名称', fixed: 'left' },
                { prop: 'nameEn', label: '英文名称' },
                { prop: 'taxId', label: '税号' },
            ],
            // 供应商搜索条件
            PartnerTableSearchList: [
                { prop: "code", label: "客户编码", type: 'input' },
                { prop: "name", label: "客户名称", type: 'input' }
            ],
            // 供应商请求参数
            PartnerListRequestObj: {
                code: "",
                name: "",
                taxId: "",
                pageNum: 1,
                pageSize: 20,
                partnerCategoryId: "",
                type: 'customer',
            },
        }
    },

}
</script>