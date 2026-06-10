<script>
import ScaleBoardLayout from '@/views/smartBoard/scaleBoardLayout/index.vue'
import Frame_middle from "@/views/smartBoard/scaleBoardLayout/component/Frame_middle.vue";
import Frame_attendance from "@/views/smartBoard/scaleBoardLayout/component/Frame_attendance.vue";
import Frame_two_circle from "@/views/smartBoard/scaleBoardLayout/component/Frame_two_circle.vue";
import Frame_safe from "@/views/smartBoard/scaleBoardLayout/component/Frame_safe.vue";
import BoardWrapper from "@/views/smartBoard/component/BoardWrapper.vue";
import Frame_5s from "@/views/smartBoard/scaleBoardLayout/component/Frame_5s.vue";
import Frame_norm from "@/views/smartBoard/scaleBoardLayout/component/Frame_norm.vue";

export default {
  components: { Frame_norm, Frame_5s, BoardWrapper, Frame_safe, Frame_two_circle, Frame_attendance, Frame_middle, ScaleBoardLayout },
  data() {
    return {
      query: {
        productionLineName: '小线车间'
      }
    }
  }
}
</script>

<template>
  <ScaleBoardLayout board-title="小线车间" board-sub-title="SIM1">
    <Frame_safe title="安全" subTitle="Safety" :query="query" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 32px;" />
    <Frame_norm title="产量" subTitle="Production" :query="query" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 32px;" />
    <Frame_norm title="质量" subTitle="Quality" :query="query" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 32px;" />
    <Frame_norm title="成本" subTitle="Cost" :query="query" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 32px;" />
    <Frame_middle title="及时跟踪" subTitle="Tracking" :query="query" style="width: 1024px; height: 566px; position: fixed; top: 131px; left: 448px;" />
    <Frame_middle title="项目执行" subTitle="Project Execution" :query="query" style="width: 1024px; height: 326px; position: fixed; top: 713px; left: 448px;" />
    <Frame_5s title="现场管理" subTitle="5S Management" :query="query" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 1488px;" />
    <Frame_attendance title="今日签到" subTitle="Attendance" :query="query" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 1488px;" />
    <Frame_two_circle title="士气" subTitle="Morale" :query="query" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 1488px;" />
    <Frame_two_circle title="交期" subTitle="Lead Time" :query="query" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 1488px;" />
  </ScaleBoardLayout>
</template>
