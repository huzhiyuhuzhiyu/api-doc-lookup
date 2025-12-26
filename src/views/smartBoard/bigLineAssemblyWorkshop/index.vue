<script>
import { addComma, getLineIfEmpty, getZeroIfEmpty } from '@/utils'
import BoardWrapper from '@/views/smartBoard/component/BoardWrapper.vue'
import store from '@/store'
import AutoScrollMixin from '@/views/smartBoard/util/AutoScrollMixin'
import {} from '@/api/smartBoard'

export default {
  components: { BoardWrapper },
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
    <div style="width: 100px; height: 100px; background: #000; position: absolute; top: 50px; left: 50px;"></div>
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;
</style>
