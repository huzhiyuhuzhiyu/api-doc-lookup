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
      viewData: 0,
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
        this.viewData = Number(res.data)
      }).finally(err => {
        if (loadingFlag) Bus.$emit('subLoading')
      })
    },
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <div class="container" v-if="title === '士气'">
      <el-progress type="circle" text-color="#fff" :percentage="100" :show-text="true" :format="(percentage) => `目标10个`"></el-progress>
      <div>本月提案</div>
      <el-progress type="circle" text-color="#fff" :percentage="100 / 10 * viewData" :show-text="true" :format="(percentage) => `实际${viewData}个`"></el-progress>
    </div>
    <div class="container" v-else-if="title === '交期'">
      <el-progress type="circle" text-color="#fff" :percentage="99" :show-text="true" :format="(percentage) => `目标99%`"></el-progress>
      <div>计划完成率</div>
      <el-progress type="circle" text-color="#fff" :percentage="100 / 10 * viewData" :show-text="true" :format="(percentage) => `实际${96}%`"></el-progress>
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  margin: auto;
  height: 100%;
  //background-image: url("~@/assets/images/board/two_circle.svg");
  background-repeat: no-repeat;
  background-size: cover; /* 或者使用contain */
}
</style>
