<template>
  <Index :priceType="listRequestObj.priceType" :listRequestObj="listRequestObj" :listMethod="getBimProductProcessPrice"
    :batchMethod="batchAddBimProductProcessPrice" :uploadMethod="uploadBimProductProcessPrice"
    :delMethod="deleteBimProductProcessPrice" :tableItems="tableItems" :searchList="searchList"
    :superQueryJson="superQueryJson" :columnList="columnList" />
</template>

<script>
import {
  getBimProductProcessPrice,
  batchAddBimProductProcessPrice,
  uploadBimProductProcessPrice,
  deleteBimProductProcessPrice
} from '@/api/bimProcess/index'
import Index from '../components/process/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'productProcessPrice',
  components: { Index },
  mixins: [getProjectList],
  data() {
    return {
      getBimProductProcessPrice,
      batchAddBimProductProcessPrice,
      uploadBimProductProcessPrice,
      deleteBimProductProcessPrice,
      isProjectSwitch: '',
      listRequestObj: {
        pricingFlag: 1,
        drawingNo: '',
        processName: '',
        priceType: 'process',
        effectFlag: 1,
        orderItems: [
          {
            asc: false,
            column: 'processName'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      tableItems: [
        { prop: 'productsCode', label: '产品编码', minWidth: '160', sortable: 'custom' },
        { prop: 'drawingNo', label: '型号', minWidth: '160', sortable: 'custom' },

        { prop: 'processName', label: '工序名称', minWidth: '140', sortable: 'custom' },
        { prop: 'processCode', label: '工序编码', minWidth: '140', sortable: 'custom' },
        { prop: 'effectiveDate', label: '生效日期', minWidth: '130' },
        { prop: 'pricingType', label: '计价类型', minWidth: '120', sortable: 'custom' },
        { prop: 'price', label: '单价(元)', minWidth: '100' }
      ],
      searchList: [
        {
          prop: 'pricingFlag',
          label: '计价类型',
          type: 'select',
          options: [{ label: '无单价', value: 0 }, { label: '有单价', value: 1 }, { label: '所有', value: '' }]
        },
        { prop: 'drawingNo', label: '型号', type: 'input' },
        { prop: 'processName', label: '工序名称', type: 'input' }
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
      columnList: ['productsCode', 'processCode']
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    let index = this.tableItems.findIndex((obj) => obj.prop === 'productsCode')
    this.tableItems.splice(index + 1, 0, {
      prop: 'productsName',
      label: '产品名称',
      minWidth: '150',
      sortable: 'custom'
    })
    if (this.isProjectSwitch === '1') {
      this.tableItems.unshift({ prop: 'projectName', label: '所属项目', minWidth: '120' })
    }

  }
}
</script>
