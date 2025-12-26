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
    <TopLeft1 title="安全" style="width: 300px; height: 200px; position: absolute; top: 10px; left: 10px;" />
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;
</style>
