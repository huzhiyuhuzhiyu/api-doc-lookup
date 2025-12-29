<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenKnowledgeCaseCount } from '@/api/smartBoard'
import Bus from '@/views/smartBoard/util/Bus.js'
import ScreenTable from "@/views/smartBoard/scaleBoardLayout/component/ScreenTable.vue";

export default {
  components: { ScreenTable, FrameLayout },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      viewData: [],
      tableColumns: []
    }
  },
  mounted() {
    this.getData(true)
// eventBus.on('refreshViewData', getData)
  },
  methods: {
    async getData(loadingFlag = false) {
      if (loadingFlag) Bus.$emit('addLoading')
      getScreenKnowledgeCaseCount({
        tenantId: 'zsk',
        _title: this.title,
        productionLineName: '大线装配车间',
      }).then(res => {
        this.viewData = res.data || []
      }).finally(err => {
        if (loadingFlag) Bus.$emit('subLoading')
      })
    },
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <div class="container"></div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  //background-image: url("~@/assets/images/board/two_circle.svg");
  background-repeat: no-repeat;
  background-size: cover; /* 或者使用contain */
}
</style>
