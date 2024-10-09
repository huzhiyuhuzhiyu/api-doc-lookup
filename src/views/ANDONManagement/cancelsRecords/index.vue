<template>
  <Records :tableItems="tableItems" :listMethod="listMethod" :listRequestObj="listQuery" :searchList="searchList" />
</template>

<script>
import Records from '../components/Records.vue'
import { getAbnoramlData } from '@/api/abnormalManagement/index.js'
export default {
  components: { Records },
  data() {
    return {
      tableItems: [
        { prop: 'orderNo', label: '申请单号', minWidth: '200', sortable: 'custom' },
        { prop: 'type', label: '申请类型', minWidth: '120', sortable: 'custom' },
        { prop: 'abnormalType', label: '异常类型', minWidth: '120', sortable: 'custom' },
        { prop: 'abnormalContent', label: '异常内容', minWidth: '120', sortable: 'custom' },
        { prop: 'equipmentName', label: '关联设备', minWidth: '120', sortable: 'custom' },
        { prop: 'productDrawingNo', label: '关联产品', minWidth: '160', sortable: 'custom' },
        { prop: 'createByName', label: '发起人', minWidth: '120', sortable: 'custom' },
        { prop: 'createTime', label: '发起时间', minWidth: '180', sortable: 'custom' },
        { prop: 'personName', label: '响应人', minWidth: '120', sortable: 'custom' },
        { prop: 'processDate', label: '响应时间', minWidth: '180', sortable: 'custom' }
      ],
      listMethod: getAbnoramlData,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        abnormalContent: "",
        abnormalContentId: '',
        abnormalType: "",
        abnormalTypeId: '',
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        equipmentName: "",
        keyword: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        processEndTime: "",
        processStartTime: "",
        processStatus: "cancelled",
        productionOrderNo: "",
        startTime: "",
        startUpdateTime: "",
        superQuery: {},
        totalRowFlag: false,
        type: ""
      },
      searchList: [
        { fieldValue: '', field: 'orderNo', label: '申请单号', prop: 'orderNo', symbol: 'like', searchType: 1 },
        { fieldValue: '', field: 'type', label: '申请类型', prop: 'type', symbol: 'like', searchType: 4, options: [{ label: '自定义异常', value: 'custom' }, { label: '系统异常', value: 'system' }] },
        { fieldValue: '', field: 'abnormalType', label: '异常类型', prop: 'abnormalType', symbol: 'like', searchType: 1 },
        { fieldValue: '', field: 'abnormalContent', label: '异常内容', prop: 'abnormalContent', symbol: 'like', searchType: 1 },
      ],
    }
  },
}
</script>