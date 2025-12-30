<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getMockScreenSafeData, getScreenSiteManageData } from '@/api/smartBoard'
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
      getScreenSiteManageData({
        tenantId: 'zsk',
        _title: this.title,
        productionLineName: '大线装配车间',
        month: this.jnpf.getToday('YYYY-MM'),
      }).then(res => {
        this.viewData = res.data || []
        const option = {
          series: [
            {
              type: 'pie',
              radius: '50%',
              center: ['50%', '40%'], // 默认是 50%，改为 45% 上移一点
              label: {
                // 普通状态下的标签样式
                color: '#ffffff', // 白色字体
                fontSize: 14,
              },
              data: res.data.map(item=>({
                value: Number(item.targetValue),
                name: `${item.name}\n得分${item.targetValue}${item.targetValue !== item.value ? ` 扣分${item.value - item.targetValue}` : ''}`,
              }))
            }
          ],
          graphic: {
            elements: [
              {
                type: 'text',
                left: 'center',      // 水平居中
                bottom: 10,          // 距离容器底部 20px
                style: {
                  text: `累计扣分：${res.data.reduce((acc, cur) => acc + (cur.targetValue !== cur.value ? cur.value - cur.targetValue : 0), 0)}分`,
                  fill: '#fff',
                  fontSize: 14,
                  textAlign: 'center'
                }
              }
            ]
          }
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
