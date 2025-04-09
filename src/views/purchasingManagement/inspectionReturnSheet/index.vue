<template>
  <Index :priceType="listRequestObj.priceType" :listRequestObj="listRequestObj" :listMethod="purPurchaseReceiptReturnGoodsDetailList"
    :batchMethod="batchReturnLine" :tableItems="tableItems" :searchList="searchList"
    :superQueryJson="superQueryJson" :columnList="columnList" />
</template>

<script>
import { purPurchaseReceiptReturnGoodsDetailList,batchReturnLine } from '@/api/purchasingManagement/purchaseInquirySheet'
import Index from './components/inspectionReturn/index.vue'
export default {
  name: 'inspectionReturnSheet',
  components: { Index },
  data() {
    return {
      purPurchaseReceiptReturnGoodsDetailList,
      batchReturnLine,
      isProjectSwitch: '',
      listRequestObj: {
        approvalStatus: '',
        createByName: '',
        deliverDate: '',
        deliverDateEnd: '',
        deliverDateStart: '',
        documentStatus: '',
        endTime: '',
        endUpdateTime: '',
        inspectionStatus: '',
        keyword: '',
        classAttribute: '',
        notificationType: 'procure',
        notificationTypeList: [],
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        orderNo: '',
        packingStatus: '',
        pageNum: 1,
        pageSize: 20,
        partnerCode: '',
        partnerName: '',
        productCode: '',
        productDrawingNo: '',
        productName: '',
        receiptReturnType: 'back', 
        receivingStatus: '',
        salesman: '',
        startTime: '',
        inspectionFlag:true,
        startUpdateTime: '',
        superQuery: {
          condition: [
            {
              field: '',
              fieldValue: '',
              symbol: ''
            }
          ],
          matchLogic: ''
        },
        totalRowFlag: false
      },
      tableItems: [
        { prop: 'orderNo', label: '退货单号', minWidth: '160' },
        { prop: 'productCode', label: '产品编码', minWidth: '160', sortable: 'custom' },
        { prop: 'productDrawingNo', label: '品名规格', minWidth: '160', sortable: 'custom' },

        { prop: 'productCategoryName', label: '产品分类', minWidth: '140', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位', minWidth: '140', sortable: 'custom' },
        { prop: 'receivedQuantity', label: '不合格数量', minWidth: '130' },
        { prop: 'price', label: '单价(含税)', minWidth: '100' },
        { prop: 'taxRate', label: '税率', minWidth: '100' },
        { prop: 'totalAmount', label: '总金额', minWidth: '100' },
        { prop: 'partnerName', label: '供应商名称', minWidth: '180', sortable: 'custom' },
        { prop: 'ordersNo', label: '采购单号', minWidth: '100' },
        { prop: 'receivingStatus', label: '是否处理', minWidth: '100' },
      ],
      searchList: [
        {
          prop: 'receivingStatus',
          label: '处理结果',
          type: 'select',
          clearable:false,
          options: [{ label: '未处理', value: 'not_finished' }, { label: '已处理', value: 'finished' }]
        },
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        { prop: 'processName', label: '供应商名称', type: 'input' },
      ],
      superQueryJson: [
        {
          prop: 'code',
          label: '工序编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'pricingType',
          label: '计价类型',
          type: 'select',
          options: [{ label: '计时', value: 'by_time' }, { label: '计件', value: 'by_piece' }]
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
      columnList: ['productCode', 'processCode']
    }
  },
  async created() {
    if (this.$store.getters.configData.product.enable_productName) {
      let index = this.tableItems.findIndex((obj) => obj.prop === 'productCode')
      this.tableItems.splice(index + 1, 0, {
        prop: 'productName',
        label: '产品名称',
        minWidth: '150',
        sortable: 'custom'
      })
      let flagIndex = this.searchList.findIndex((obj) => obj.prop === 'receivingStatus')
      this.searchList.splice(flagIndex + 1, 0,{
        prop: 'productName',
        label: '产品名称',
        type: 'input',
      })
    }



  }
}
</script>
