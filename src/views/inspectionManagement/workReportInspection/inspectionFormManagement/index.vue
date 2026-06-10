<template>
  <inspectionNoticePage :pageData="pageData" />
</template>

<script>
import inspectionNoticePage from '@/views/inspectionManagement/components/inspectionNoticePage.vue' // 不良品处理单列表页
export default {
  components: { inspectionNoticePage },
  data() {
    return {
      pageData: {
        type: 'work_report', // 类型
        showRouting: false, // 是否显示工艺路线
        showProcess: false, // 是否显示工序
      }
    }
  }
}
</script>
