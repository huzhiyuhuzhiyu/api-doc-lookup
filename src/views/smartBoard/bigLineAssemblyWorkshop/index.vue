<script>
import { addComma, getLineIfEmpty, getZeroIfEmpty } from '@/utils'
import BoardWrapper from '@/views/smartBoard/component/BoardWrapper.vue'
import store from '@/store'
import AutoScrollMixin from '@/views/smartBoard/util/AutoScrollMixin'
import TopLeft1 from './components/TopLeft1.vue'
import {} from '@/api/smartBoard'

export default {
  components: { BoardWrapper, TopLeft1 },
  mixins: [AutoScrollMixin],
  methods: {
    async getData() {
    },
  },
  data() {
    return {}
  },
  mounted() {
    this.getData()
  }
}
</script>

<template>
  <BoardWrapper
    board-title="大线装配车间"
    :scale-board="true"
  >
    <TopLeft1 title="安全1" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 32px;" />
    <TopLeft1 title="安全2" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 32px;" />
    <TopLeft1 title="安全3" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 32px;" />
    <TopLeft1 title="安全4" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 32px;" />
    <TopLeft1 title="安全5" style="width: 1024px; height: 566px; position: fixed; top: 131px; left: 448px;" />
    <TopLeft1 title="安全6" style="width: 1024px; height: 326px; position: fixed; top: 713px; left: 448px;" />
    <TopLeft1 title="安全1" style="width: 400px; height: 215px; position: fixed; top: 131px; left: 1488px;" />
    <TopLeft1 title="安全2" style="width: 400px; height: 215px; position: fixed; top: 362px; left: 1488px;" />
    <TopLeft1 title="安全3" style="width: 400px; height: 215px; position: fixed; top: 593px; left: 1488px;" />
    <TopLeft1 title="安全4" style="width: 400px; height: 215px; position: fixed; top: 824px; left: 1488px;" />
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;
</style>
