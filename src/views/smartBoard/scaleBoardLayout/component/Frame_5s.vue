<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getMockScreenSafeData } from '@/api/smartBoard'
import Bus from '@/views/smartBoard/util/Bus.js'
import echarts from 'echarts'

export default {
  components: { FrameLayout },
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
      myChart: null, // 保存 echarts 实例，便于后续操作（如 resize、dispose 等）
      viewData: [],
    }
  },
  mounted() {
    this.getData(true)
    Bus.$on('refreshViewData', this.getData)
  },
  beforeDestroy() {
    Bus.$off('refreshViewData', this.getData)
  },
  beforeDestroy() {
    // 组件销毁前释放 echarts 实例，避免内存泄漏
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
  },
  methods: {
    async getData(loadingFlag = false) {
      if (loadingFlag) Bus.$emit('addLoading')

      const chartDom = this.$refs.chartContainer;
      if (!chartDom) return;

      // 初始化 echarts 实例
      this.myChart = echarts.init(chartDom);

      // let date = await dateFormat.getDateRang(this.dateRang) // 获取本月的时间区间
      getMockScreenSafeData({
        // tenantId: dateFormat.tenantId,
        _title: this.title,
        // startDate: date[0],
        // endDate: date[1]
      }).then(res => {
        this.viewData = res.data || []
        const option = {
          title: {
            text: '总得分90',
            left: 'center',
            top: 10,
            textStyle: {
              color: '#fff',
              fontSize: 18,
            }
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              label: {
                // 普通状态下的标签样式
                color: '#ffffff', // 白色字体
                fontSize: 14,
              },
              data: [
                { value: 40, name: '生产车间 得分40' },
                { value: 50, name: '人身安全 得分50' },
              ],
            }
          ]
        };

        this.myChart.setOption(option);
      }).finally(err => {
        if (loadingFlag) Bus.$emit('subLoading')
      })
    },
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
</style>
