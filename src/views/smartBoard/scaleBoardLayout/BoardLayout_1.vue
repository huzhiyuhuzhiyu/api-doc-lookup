<script>
import { addComma, getLineIfEmpty, getZeroIfEmpty } from '@/utils'
import BoardWrapper from '@/views/smartBoard/component/BoardWrapper.vue'
import LoadingMixin from '@/views/smartBoard/util/LoadingMixin'
import TopLeft1 from '@/views/smartBoard/scaleBoardLayout/component/TopLeft1.vue'
import Bus from '@/views/smartBoard/util/Bus.js'

export default {
  components: { BoardWrapper, TopLeft1 },
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
    <TopLeft1 title="安全" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 32px;" />
<!--    <TopLeft1 title="安全2" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 32px;" />-->
<!--    <TopLeft1 title="安全3" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 32px;" />-->
<!--    <TopLeft1 title="安全4" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 32px;" />-->
<!--    <TopLeft1 title="安全5" style="width: 1024px; height: 566px; position: fixed; top: 131px; left: 448px;" />-->
<!--    <TopLeft1 title="安全6" style="width: 1024px; height: 326px; position: fixed; top: 713px; left: 448px;" />-->
<!--    <TopLeft1 title="安全1" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 1488px;" />-->
<!--    <TopLeft1 title="安全2" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 1488px;" />-->
<!--    <TopLeft1 title="安全3" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 1488px;" />-->
<!--    <TopLeft1 title="安全4" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 1488px;" />-->
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;
</style>
