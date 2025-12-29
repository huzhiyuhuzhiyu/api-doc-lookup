<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenSafeData } from '@/api/smartBoard'
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
// eventBus.on('refreshViewData', getData)
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
      getScreenSafeData({
        // tenantId: dateFormat.tenantId,
        _title: this.title,
        // startDate: date[0],
        // endDate: date[1]
      }).then(res => {
        this.viewData = res.data || []
        const option = {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
