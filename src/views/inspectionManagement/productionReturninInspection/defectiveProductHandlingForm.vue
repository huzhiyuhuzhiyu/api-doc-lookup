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
        type: 'produce', // 通知单类型
        showRouting: true, // 是否显示工艺路线
        showProcess: true, // 是否显示工序
      },
      processingresults:[
        { label: '合格', value: 'qualified' },
        { label: '不合格', value: 'unqualified' },
        { label: '让步接收', value: 'concessive_acceptance' },
        { label: '挑选', value: 'select' }
      ]
    }
  }
}
</script>