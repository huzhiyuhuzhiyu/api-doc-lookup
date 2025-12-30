<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenKnowledgeCaseCount, getScreenDeliverData } from '@/api/smartBoard'
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
    query: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      viewData: 0,
      tableColumns: [],
      progressProps: {
        width: 88,
        strokeWidth: 8,
        type: "circle",
        textColor: "#fff",
        color: [
          // {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#1989fa', percentage: 80},
          {color: '#5cb87a', percentage: 100}
        ]
      },
    }
  },
  mounted() {
    this.getData(true)
    Bus.$on('refreshViewData', this.getData)
  },
  beforeDestroy() {
    Bus.$off('refreshViewData', this.getData)
  },
  methods: {
    async getData(loadingFlag = false) {
      if (loadingFlag) Bus.$emit('addLoading')
      if (this.title === '交期') {
        getScreenDeliverData({
          tenantId: 'nm',
          _title: this.title,
          month: this.jnpf.getToday('YYYY-MM'),
          // productionLineName: '大线装配车间',
          ...this.query,
        }).then(res => {
          this.viewData = this.jnpf.numberFormat(res.data)
        }).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      } else if (this.title === '士气') {
        getScreenKnowledgeCaseCount({
          tenantId: 'zsk',
          _title: this.title,
          productionLineName: '大线装配车间',
        }).then(res => {
          this.viewData = Number(res.data)
        }).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      }
    },
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <div class="container" v-if="title === '士气'">
      <el-progress :percentage="100" :format="(percentage) => `目标10个`" v-bind="progressProps"></el-progress>
      <div class="title">本月提案</div>
      <el-progress :percentage="100 / 10 * viewData" :format="(percentage) => `实际${viewData}个`" v-bind="progressProps"></el-progress>
    </div>
    <div class="container" v-else-if="title === '交期'">
      <el-progress :percentage="98" :format="(percentage) => `目标98%`" v-bind="progressProps"></el-progress>
      <div class="title">计划完成率</div>
      <el-progress :percentage="Number(viewData)" :format="(percentage) => `实际${this.viewData}%`" v-bind="progressProps"></el-progress>
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100px;
  margin: 40px auto;
  padding: 6px;
  box-sizing: border-box;
  background-image: url("~@/assets/images/board/two_circle.svg");
  background-repeat: no-repeat;
  background-size: contain; /* 或者使用contain */
  background-color: transparent;

  .title {
    width: 100%;
    text-align: center;
    position: relative;
    top: 15px;
    font-size: 18px;
  }
}
</style>
