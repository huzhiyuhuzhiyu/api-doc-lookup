<template>
  <inspectionNoticePage :pageData="pageData" />
</template>

<script>
import inspectionNoticePage from '../components/inspectionNoticePage.vue' // 不良品处理单列表页
export default {
  components: { inspectionNoticePage },
  data() {
    return {
      pageData: {
        type: 'finished', // 通知单类型
        businessCode: 'metalworking', // 业务编码
        showRouting: true, // 是否显示工艺路线
        showProcess: true, // 是否显示工序
      }
    }
  }
}
</script>