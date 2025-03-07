<template>
  <Index :listRequestObj="listRequestObj" :listMethod="getProductList"
    :batchMethod="batchAddBimProductProcessPrice" :tableItems="tableItems" :searchList="searchList"
    :superQueryJson="superQueryJson" :columnList="columnList" />
</template>

<script>

import {
  getProductList,
} from '@/api/masterDataManagement/productManage'
import Index from '../components/inspectionPersonnelSettings.vue'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'productProcessPrice',
  components: { Index },
  mixins: [getProjectList],
  data() {
    return {
      getProductList,
      // batchAddBimProductProcessPrice,

      isProjectSwitch: '',
      listRequestObj: {
        code: '',
        name: '',
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
        pageNum: 1,
        pageSize: 20,
        drawingNo: '', // 图号
        productSource: 'purchase', // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: '', // 类型id
        productStatus: '', // 产品状态
        customerQueryFields: [],
        createTimeArr: [],
        classAttribute: ''
      },
      tableItems: [
        { prop: 'productCode', label: '产品编码', minWidth: '160', sortable: 'custom' },
        { prop: 'drawingNo', label: '品名规格', minWidth: '160', sortable: 'custom' },
        { prop: 'productCategoryName', label: '产品分类', minWidth: '140', sortable: 'custom' },
        { prop: 'productSource', label: '产品来源', minWidth: '140', sortable: 'custom' },
        { prop: 'processCode', label: '配置检验人员', minWidth: '140', sortable: 'custom' },
        { prop: 'processCode', label: '最近更新时间', minWidth: '140', sortable: 'custom' },
      ],
      searchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        { prop: '配置人员', label: '配置人员', type: 'input' }
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
    await this.getProjectSwitch('system', 'project')
    console.log(this.$store.getters.configData.product.enable_productName, 'sss')
    if (this.$store.getters.configData.product.enable_productName) {
      let tableIndex = this.tableItems.findIndex((obj) => obj.prop === 'productCode')
      this.tableItems.splice(tableIndex + 1, 0, {
        prop: 'name',
        label: '产品名称',
        minWidth: '150',
        sortable: 'custom'
      })
      let searchIndex = this.searchList.findIndex((obj) => obj.prop === 'productCode')
      this.searchList.splice(searchIndex + 1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
    }
    if (this.isProjectSwitch === '1') {
      this.tableItems.unshift({ prop: 'projectName', label: '所属项目', minWidth: '120' })
    }

  }
}
</script>
