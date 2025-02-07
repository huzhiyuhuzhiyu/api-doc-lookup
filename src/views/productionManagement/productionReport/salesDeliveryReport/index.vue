<template>
  <ReportTypeTable :need-super-query="false" :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag"
    :list-request-obj="listRequestObj" :list-method="getInventorySummaryData" :tableItems="tableItems"
    :searchList="searchList" :exportType="exportType" :export-name="exportName" :renderSummary="false"
    />
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import { getInventorySummaryData } from '@/api/warehouseManagement/inventory'
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
export default {
  name: 'salesDeliveryReport',
  components: { ReportTypeTable },
  mixins: [],
  data() {
    return {
      getInventorySummaryData,
      getProducts,
      listRequestObj: {
        businessType: 'outbound_sale_send', // 销售发货
        accountPeriod: '',
        classAttribute: "",
        createByName: "",
        drawingNo: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        orderEndDate: "",
        orderItems: [{
          asc: false,
          column: ''
        }, {
          asc: false,
          column: 'drawingNo',
        }],
        orderStartDate: "",
        pageNum: 1,
        pageSize: 20,
        productCategoryId: '',
        productsCode: "",
        productsName: "",
        projectId: '',
        startTime: "",
        startUpdateTime: "",
        superQuery: {},
        totalRowFlag: false,
        warehouseCode: "",
        warehouseName: ""
      },
      tableItems: [],
      columnList: ['productsCode', 'warehouseCode'],
      searchList: [],
      superQueryJson: [],
      exportType: '1013',
      exportName: '销售发货报表',
      isProductNameSwitch: '',
      accountPeriod: '',
      indexFlag: false,

    }
  },
  async created() {

    await this.getProductNameSwitch('product', 'enable_productName')
    this.setTableItems()
    this.setSuperQueryJson()
    this.setSearchList()
    // this.searchList[1].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
    this.indexFlag = true
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    setTableItems() {
      this.tableItems = [
        { prop: "partnerName", label: "客户名称", minWidth: 160 },
        { prop: "orderNo", label: '销售订单号', minWidth: 180, sortable: 'custom' },
        { prop: "orderNo", label: '客户单号', minWidth: 180, sortable: 'custom' },
        { prop: "drawingNo", label: '产品品名规格', minWidth: 160, sortable: 'custom' },
        { prop: "productName", label: '客户料号', minWidth: 140, sortable: 'custom' },
        { prop: "productCode", label: '订单数量', minWidth: 140, sortable: 'custom' },
        { prop: "processName", label: '发货数量', minWidth: 140, sortable: 'custom' },
        { prop: "warehouseName", label: '未发货数量', minWidth: 140, sortable: 'custom' },
        { prop: "warehouseCode", label: '产品价格', minWidth: 140, sortable: 'custom' },
        { prop: "mainUnit", label: '订单日期', minWidth: 120, sortable: 'custom' },
        { prop: "orderNum", label: '发货日期', minWidth: 120, sortable: 'custom' },
      ]
    },
    setSuperQueryJson() {
      this.superQueryJson = [
        {
          prop: 'accountPeriod',
          label: '账期',
          type: 'month',
          valueFormat: 'yyyy-MM',
        },
        {
          prop: 'balanceState',
          label: '结存状态',
          type: 'select',
          options: [
            { label: '未结存', value: 'not_finished' },
            { label: '已结存', value: 'finished' }
          ]
        },
        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input',
        },
        {
          prop: 'productsName',
          label: '产品名称',
          type: 'input',
          render: this.isProductNameSwitch === '1'
        },
        {
          prop: 'productsCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: '仓库名称',
          type: 'input'
        },
        {
          prop: 'warehouseCode',
          label: '仓库编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        }
      ]
    },
    setSearchList() {
      this.searchList = [
        {
          fieldValue: '',
          field: 'accountPeriod',
          label: '账期',
          prop: 'accountPeriod',
          symbol: 'like',
          searchType: 5
        }, {
          fieldValue: '',
          field: 'drawingNo',
          label: '品名规格',
          prop: 'drawingNo',
          symbol: 'like',
          searchType: 6,
          queryRequestObj: {
            classAttributeList: [],
            classAttribute: "",
            productDrawingNo: '',
            productCategoryId: "",
            queryType: 2,
            productStatus: 'enable',
            code: "",
            name: "",
            orderItems: [{
              "asc": false,
              "column": ""
            }, {
              "asc": false,
              "column": "create_time"
            }],
            pageNum: 1,
            pageSize: 20,
          },
          fn:this.getProducts,
        }, {
          fieldValue: '',
          field: 'productsName',
          label: '产品名称',
          prop: 'productsName',
          symbol: 'like',
          searchType: 1,
        },
      ]
      
    },
  }

};
</script>

<style scoped lang="scss"></style>
