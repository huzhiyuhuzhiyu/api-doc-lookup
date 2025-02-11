<template>
  <ReportTypeTable :need-super-query="false" :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag"
    :list-request-obj="listRequestObj" :list-method="getInventorySummaryData" :tableItems="tableItems"
    :searchList="searchList" :exportType="exportType" :export-name="exportName" :renderSummary="false" />
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue'
import { getInventorySummaryData } from '@/api/warehouseManagement/inventory'
import { getcategoryTree, getCooperativeData } from '@/api/basicData/index'
export default {
  name: 'rawMaterialsReceivingReport',
  components: { ReportTypeTable },
  mixins: [],
  data() {
    return {
      getInventorySummaryData,
      getCooperativeData,
      treeData: [],
      listRequestObj: {
        businessType: 'inbound_purchase', // 采购收货
        accountPeriod: '',
        classAttribute: 'finish_product', // 成品
        createByName: '',
        drawingNo: '',
        endTime: '',
        endUpdateTime: '',
        keyword: '',
        orderEndDate: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: ''
          }
        ],
        orderStartDate: '',
        pageNum: 1,
        pageSize: 20,
        productCategoryId: '',
        productsCode: '',
        productsName: '',
        projectId: '',
        startTime: '',
        startUpdateTime: '',
        superQuery: {},
        totalRowFlag: false,
        warehouseCode: '',
        warehouseName: ''
      },
      tableItems: [],
      columnList: ['productsCode', 'warehouseCode'],
      searchList: [],
      superQueryJson: [],
      exportType: '1013',
      exportName: '成品收货报表',
      isProductNameSwitch: '',
      accountPeriod: '',
      indexFlag: false
    }
  },
  async created() {
    await this.getcategoryTree()
    await this.getProductNameSwitch('product', 'enable_productName')
    this.setTableItems()
    this.setSuperQueryJson()
    this.setSearchList()
    // this.searchList[1].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
    this.indexFlag = true
  },
  methods: {
    async getcategoryTree() {
      let listQuery = {
        keyword: '',
        type: 'supplier'
      }
      const res = await getcategoryTree(listQuery)
      this.treeData = res.data

    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    setTableItems() {
      this.tableItems = [
        { prop: 'partnerName', label: '成品供应商名称', minWidth: 160 },
        { prop: 'salePurchaseOrderNo', label: '采购订单号', minWidth: 180, sortable: 'custom' },
        { prop: 'drawingNo', label: '产品品名规格', minWidth: 160, sortable: 'custom' },
        { prop: 'orderNum', label: '订单数量', minWidth: 140, sortable: 'custom' },
        { prop: 'num', label: '发货数量', minWidth: 140, sortable: 'custom' },
        { prop: 'remainingQuantity', label: '未发货数量', minWidth: 140, sortable: 'custom' },
        { prop: 'costPrice', label: '产品价格', minWidth: 140, sortable: 'custom' },
        { prop: 'salePurchaseDate', label: '订单日期', minWidth: 120, sortable: 'custom' },
        { prop: 'orderDate', label: '发货日期', minWidth: 120, sortable: 'custom' }
      ]
    },
    setSuperQueryJson() {
      this.superQueryJson = [
        {
          prop: 'partnerName',
          label: '成品供应商名称',
          type: 'input'
        },
        {
          prop: 'salePurchaseOrderNo',
          label: '采购订单号',
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: '产品品名规格',
          type: 'input'
        },
        {
          prop: 'orderNum',
          label: '订单数量',
          type: 'input'
        },
        {
          prop: 'num',
          label: '发货数量',
          type: 'input'
        },
        {
          prop: 'remainingQuantity',
          label: '未发货数量',
          type: 'input'
        },
        {
          prop: 'costPrice',
          label: '产品价格',
          type: 'input'
        },
        {
          prop: 'salePurchaseDate',
          label: '订单日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'orderDate',
          label: '发货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }
      ]
    },
    setSearchList() {
      console.log(this.treeData, 'treeData')
      this.searchList = [
        {
          fieldValue: '',
          field: 'orderDate',
          label: '发货日期',
          prop: 'orderDate',
          symbol: 'like',
          searchType: 5,
          noNeedSuper: true
        },
        {
          fieldValue: '',
          field: 'partnerName',
          label: '成品供应商名称',
          prop: 'partnerName',
          symbol: 'like',
          searchType: 6,
          searchName: 'name',
          queryRequestObj: {
            code: '',
            taxId: '',
            name: '',
            customerRecognitionTime: [],
            customerRecognitionStartTime: '',
            customerRecognitionEndTime: '',
            personResponsible: '',
            contacts: '',
            phone: '',
            mobilePhone: '',
            email: '',
            grade: '',
            type: 'supplier',
            saleFlag: 1,
            partnerCategoryId: this.treeData[1].id,
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                asc: false,
                column: ''
              },
              {
                asc: false,
                column: 'createTime'
              }
            ],
            superQuery: {}
          },
          fn: this.getCooperativeData
        },
        {
          fieldValue: '',
          field: 'drawingNo',
          label: '产品品名规格',
          prop: 'drawingNo',
          symbol: 'like',
          searchType: 1
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss"></style>
