<template>
  <Index :listRequestObj="listRequestObj" :listMethod="getProductList" :batchMethod="batchProductPerson"
    :tableItems="tableItems" :searchList="searchList" :superQueryJson="superQueryJson" :columnList="columnList" />
</template>

<script>
import { getProductList, batchProductPerson } from '@/api/masterDataManagement/productManage'
import Index from '../components/inspectionPersonnelSettings.vue'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
export default {
  name: 'inspectionPersonnelSettings',
  components: { Index },
  mixins: [AbProjectMixin],
  data() {
    return {
      getProductList,
      batchProductPerson,
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
        productSource: 'out', // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: '', // 类型id
        productStatus: '', // 产品状态
        customerQueryFields: [],
        createTimeArr: [],
        classAttribute: ''
      },
      tableItems: [
        { prop: 'code', label: '产品编码', minWidth: '160', sortable: 'custom' },
        { prop: 'drawingNo', label: '品名规格', minWidth: '160', sortable: 'custom' },
        { prop: 'productCategoryName', label: '产品分类', minWidth: '120', sortable: 'custom' },
        { prop: 'productSource', label: '产品来源', },
        { prop: 'staffingName', label: '检验人员', minWidth: '140', sortable: 'custom' }
      ],
      searchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
        // { prop: 'staffingName', label: '配置人员', type: 'input' }
      ],
      superQueryJson: [
        {
          prop: 'code',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'input'
        },
        {
          prop: 'staffingName',
          label: '配置检验人员',
          type: 'input'
        }
      ],
      columnList: []
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
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
    if (this.abProjectId) {
      this.tableItems.unshift({ prop: 'projectName', label: '所属项目' })
    }
  }
}
</script>
