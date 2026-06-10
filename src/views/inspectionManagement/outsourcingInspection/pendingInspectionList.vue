<template>
  <inspectionNoticePage :pageData="pageData" />
</template>

<script>
import inspectionNoticePage from '../components/pendingInspectionNoticePage.vue' // 不良品处理单列表页
export default {
  components: { inspectionNoticePage },
  data() {
    return {
      pageData: {
        type: 'external', // 通知单类型
        showRouting: true, // 是否显示工艺路线
        showProcess: true, // 是否显示工序
      }
    }
  }
}
</script>