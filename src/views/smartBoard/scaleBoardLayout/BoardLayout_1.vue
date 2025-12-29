<script>
import { addComma, getLineIfEmpty, getZeroIfEmpty } from '@/utils'
import BoardWrapper from '@/views/smartBoard/component/BoardWrapper.vue'
import LoadingMixin from '@/views/smartBoard/util/LoadingMixin'
import Frame_safe from '@/views/smartBoard/scaleBoardLayout/component/Frame_safe.vue'
import Frame_norm from '@/views/smartBoard/scaleBoardLayout/component/Frame_norm.vue'
import Bus from '@/views/smartBoard/util/Bus.js'
import Frame_middle from "@/views/smartBoard/scaleBoardLayout/component/Frame_middle.vue";
import Frame_5s from "@/views/smartBoard/scaleBoardLayout/component/Frame_5s.vue";
import Frame_attendance from "@/views/smartBoard/scaleBoardLayout/component/Frame_attendance.vue";
import Frame_two_circle from "@/views/smartBoard/scaleBoardLayout/component/Frame_two_circle.vue";

export default {
  components: { Frame_two_circle, Frame_attendance, Frame_5s, Frame_middle, BoardWrapper, Frame_safe, Frame_norm },
  mixins: [LoadingMixin],
  props: {
    boardTitle: {
      type: String,
      required: true
    }
  },
  created() {
    Bus.$on('addLoading', this.addLoading)
    Bus.$on('subLoading', this.subLoading)
  },
  watch: {
    loading(newVal, oldVal) {
      console.log('loading', newVal)
    }
  }
}
</script>

<template>
  <BoardWrapper
    :board-title="boardTitle"
    :scale-board="true"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="加载中..."
  >
    <Frame_safe title="安全" subTitle="Safety" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 32px;" />
    <Frame_norm title="产量" subTitle="Production" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 32px;" />
    <Frame_norm title="质量" subTitle="Quality" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 32px;" />
    <Frame_norm title="成本" subTitle="Cost" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 32px;" />
    <Frame_middle title="及时跟踪" subTitle="Tracking" style="width: 1024px; height: 566px; position: fixed; top: 131px; left: 448px;" />
    <Frame_middle title="项目执行" subTitle="Project Execution" style="width: 1024px; height: 326px; position: fixed; top: 713px; left: 448px;" />
    <Frame_5s title="现场管理" subTitle="5S Management" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 1488px;" />
    <Frame_attendance title="今日签到" subTitle="Attendance" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 1488px;" />
    <Frame_two_circle title="士气" subTitle="Morale" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 1488px;" />
    <Frame_two_circle title="交期" subTitle="Lead Time" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 1488px;" />
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;
</style>
