<template>
  <Index :priceType="listRequestObj.attributeType" :listRequestObj="listRequestObj"
    :listMethod="getBimProductAttributePrice" :batchMethod="batchAddBimProductAttributePrice"
    :uploadMethod="uploadBimProductAttributePrice" :delMethod="deleteBimProductAttributePrice" :tableItems="tableItems"
    :searchList="searchList" :superQueryJson="superQueryJson" :columnList="columnList" />
</template>

<script>
import {
  getBimProductAttributePrice,
  batchAddBimProductAttributePrice,
  uploadBimProductAttributePrice,
  deleteBimProductAttributePrice
} from '@/api/bimProcess/index'
import {
  getbimProductAttributesList,
  getbimProductAttributes,
  getbimProductAttributesListMap
} from '@/api/masterDataManagement/index'
import Index from '../components/process/index.vue'
export default {
  name: 'productPackagingPrice',
  components: { Index },
  data() {
    return {
      getBimProductAttributePrice,
      batchAddBimProductAttributePrice,
      uploadBimProductAttributePrice,
      deleteBimProductAttributePrice,
      listRequestObj: {
        pricingFlag: 1,
        drawingNo: '',
        processName: '',
        attributeType: 'packaging',
        effectFlag: 1,
        orderItems: [
          {
            asc: false,
            column: 'attribute_method'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      tableItems: [
        { prop: 'productsCode', label: '产品编码', minWidth: '160', sortable: 'custom' },
        { prop: 'drawingNo', label: '品名规格', minWidth: '160', sortable: 'custom' },

        { prop: 'effectiveDate', label: '生效日期', minWidth: '140' },
        { prop: 'attributeMethod', label: '属性名称', minWidth: '140', sortable: 'custom' },
        { prop: 'unitPrice', label: '计价单价(元)', minWidth: '130' }
      ],
      searchList: [
        {
          prop: 'pricingFlag',
          label: '计价类型',
          type: 'select',
          options: [{ label: '无单价', value: 0 }, { label: '有单价', value: 1 }, { label: '所有', value: '' }]
        },
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        { prop: 'attributeMethod', label: '包装方式', type: 'select', options: [] }
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
      columnList: ['productsCode', 'processCode'],
      bimProductAttributesObj: {}
    }
  },
  async created() {
    await this.getProductClassFun()
    let index = this.tableItems.findIndex((obj) => obj.prop === 'code')
    this.tableItems.splice(index + 1, 0, {
      prop: 'productsName',
      label: '产品名称',
      minWidth: '180',
      sortable: 'custom'
    })
    this.tableItems.unshift({ prop: 'projectName', label: '所属项目', minWidth: '120' })
    this.searchList.forEach((item) => {
      if (item.prop === 'attributeMethod') {
        item.options = this.bimProductAttributesObj.pa015.map((it) => {
          return {
            label: it.name,
            value: it.name
          }
        })
      }
    })
  },
  methods: {
    // 获取产品属性
    async getProductClassFun() {
      // 产品属性
      const res = await getbimProductAttributesListMap()
      this.bimProductAttributesObj = res.data
    }
  }
}
</script>
