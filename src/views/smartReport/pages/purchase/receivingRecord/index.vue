<script>
import CommonReport from '@/views/smartReport/components/CommonReport.vue'
import { purchaseReceiveReport } from "@/api/smartReport";

export default {
  name: "reInspectionReport",
  components: { CommonReport },
  props: {
    classAttributeList: {
      type: Array,
      default: () => ["finish_product", "raw_material", "semi_finished"],
    },
  },
  data() {
    return {
      config: {
        dynamicHeaders: {
          enable: false,
          config: {
            leftFields: [],
            // 工序动态列配置
            // processColumns: ['processWipCirculationList'], // 指定要平铺的工序字段 暂无用处
            dynamicColumns: null,
            // 动态日期列配置
            dateColumns: null,
          }
        }, // 启用动态表头
        summaryConfig: {
          showSummary: true, // 控制是否显示汇总行
          summaryMapping: {}, // 字段映射 （接口返回汇总字段）
        },
        columnsConfig: [
          { prop: "receiveDate", label: '收货日期', minWidth: 180 },
          { prop: "partnerCode", label: '供应商编码', minWidth: 180 },
          { prop: "partnerName", label: '供应商名称', minWidth: 180 },
          { prop: "productsDrawingNo", label: '型号', minWidth: 160 },
          { prop: "productsCode", label: '产品编码', minWidth: 140 },
          { prop: "productsName", label: '产品名称', minWidth: 160, show: () => this.$store.getters.configData.product.enable_productName },
          { prop: "mainUnit", label: '单位', minWidth: 90 },
          { prop: "price", label: '单价', minWidth: 140 },
          { prop: "purchaseQuantity", label: '数量', minWidth: 140 },
          { prop: "remark", label: '备注', minWidth: 180 },
        ],
        superQueryConfig: {
          superQueryJson: [],
          systemSearchView: [{
            matchLogic: "AND",
            fullName: "默认视图",
            conditionJson: {
              condition: [
                { prop: 'partnerName', symbol: 'like', fixed: true },
                {
                  prop: 'receiveDate', // 属性*
                  // value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')],
                  symbol: 'between', // 比较符*
                  timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
                  fixed: true // 是否在搜索栏显示
                },
              ],
              keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
              pageSize: 20,
              orderItems: [{
                asc: false,
                column: ""
              }]
            },
          }],
        },
        rowKey: 'id',
        initQuery: {
          classAttributeList: this.classAttributeList,
          totalRowFlag: true,
        },
        exportConfig: {
          enable: true,
          exportType: '1266',
          exportName: '采购收货记录',
          exportHidden: false,
          fetchApi: null,
        },
        fetchApi: purchaseReceiveReport,
      },
    }
  }
}
</script>

<template>
  <CommonReport :config="config"/>
</template>
