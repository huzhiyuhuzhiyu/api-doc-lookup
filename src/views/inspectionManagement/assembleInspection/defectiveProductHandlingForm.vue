<template>
  <DefectiveProductHandlingPage :pageData="pageData" :processingresults="processingresults"/>
</template>

<script>
import DefectiveProductHandlingPage from '../components/defectiveProductHandlingPage.vue' // 不良品处理单列表页
export default {
  components: { DefectiveProductHandlingPage },
  data() {
    return {
      pageData: {
        type: 'finished', // 通知单类型
        businessCode: 'assemble', // 业务编码
        showRouting: true, // 是否显示工艺路线
        showProcess: true, // 是否显示工序
      },
      processingresults:[
        { label: '合格', value: 'qualified' },
        { label: '报废', value: 'discard' },
        { label: '返工返修', value: 'repair' },
        { label: '报废和返修', value: 'discard_repair' }
      ]
    }
  }
}
</script>