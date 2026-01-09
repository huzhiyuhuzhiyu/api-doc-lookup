<script>
import CommonReport from '@/views/smartReport/components/CommonReport.vue'
import { prodOrderRecheckReport } from "@/api/smartReport";

export default {
  name: "reInspectionReport",
  components: { CommonReport },
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
          showSummary: false, // 控制是否显示汇总行
          summaryMapping: {}, // 字段映射 （接口返回汇总字段）
        },
        columnsConfig: [
          { prop: "orderNo", label: '生产单号', minWidth: 180, },
          { prop: "sourceOrderNo", label: '来源单号', minWidth: 180, },
          { prop: "orderDate", label: '重检日期', minWidth: 180 },
          { prop: "productionQuantity", label: '重检数量', minWidth: 140 },
          { prop: "productsDrawingNo", label: '型号', minWidth: 160 },
          { prop: "productsCode", label: '产品编码', minWidth: 140 },
          { prop: "productsName", label: '产品名称', minWidth: 160, show: () => this.$store.getters.configData.product.enable_productName },
          { prop: "qualifiedQuantity", label: '合格数量', minWidth: 140 },
          { prop: "unqualifiedQuantity", label: '不合格数量', minWidth: 140 },
          { prop: "inspectionResults", label: "检验结果", minWidth: 120, slot: true, dictType: "inspectionResultsType", },
          { prop: "treatmentResults", label: "处理方式", minWidth: 120, slot: true, dictType: "treatmentResults", },
          { prop: "returnReason", label: '不良原因', minWidth: 140 },
          { prop: "orderType", label: '类型', minWidth: 140, slot: true, dictType: "orderType", },
        ],
        superQueryConfig: {
          superQueryJson: [],
          systemSearchView: [{
            matchLogic: "AND",
            fullName: "默认视图",
            conditionJson: {
              condition: [
                { prop: 'orderNo', symbol: 'like', fixed: true },
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
        initQuery: {},
        exportConfig: {
          enable: true,
          exportType: '1270',
          exportName: '重检报表',
          exportHidden: false,
          fetchApi: null,
        },
        fetchApi: prodOrderRecheckReport,
      },
    }
  }
}
</script>

<template>
  <CommonReport :config="config"/>
</template>
