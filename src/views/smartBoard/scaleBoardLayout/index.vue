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
  data() {
    return {
      interval: null
    }
  },
  created() {
    Bus.$on('addLoading', this.addLoading)
    Bus.$on('subLoading', this.subLoading)
    this.initInterval()
  },
  beforeDestroy() {
    Bus.$off('addLoading', this.addLoading)
    Bus.$off('subLoading', this.subLoading)
    clearInterval(this.interval)
  },
  methods: {
    refresh() {
      this.initInterval()
      Bus.$emit('refreshViewData')
    },
    initInterval() {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.$message.success('定时刷新')
        this.refresh()
      }, 1000 * 60)
    }
  }
}
</script>

<template>
  <BoardWrapper
    :board-title="boardTitle"
    :scale-board="true"
    v-loading="loading"
    @refresh="refresh"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="加载中..."
  >
    <slot />
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;
</style>
