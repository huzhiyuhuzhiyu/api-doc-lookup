<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getMockScreenSafeData } from '@/api/smartBoard'
import Bus from '@/views/smartBoard/util/Bus.js'

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
  methods: {
    async getData(loadingFlag = false) {
      if (loadingFlag) Bus.$emit('addLoading')
      // let date = await dateFormat.getDateRang(this.dateRang) // 获取本月的时间区间
      getMockScreenSafeData({
        // tenantId: dateFormat.tenantId,
        _title: this.title,
        // startDate: date[0],
        // endDate: date[1]
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
    <div class="contain">
      <div class="left">
        <el-progress type="circle" :percentage="100" :stroke-width="14" text-color="#fff"></el-progress>
      </div>
      <div class="right">
        <div class="item text-primary">
          <span class="title">● 到岗</span>
          <span class="number">{{ 20 }}</span>
        </div>
        <div class="item text-warning">
          <span class="title">● 迟到</span>
          <span class="number">0</span>
        </div>
        <div class="item text-danger">
          <span class="title">● 旷工</span>
          <span class="number">0</span>
        </div>
        <div class="item text-success">
          <span class="title">● 请假</span>
          <span class="number">{{ 0 }}</span>
        </div>
      </div>
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
$success: #00CB62;

.contain {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 160px;
    height: 160px;

    .item {
      font-size: 18px;
      font-weight: bold;
      width: 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 5px 0;
    }
  }
}
</style>
