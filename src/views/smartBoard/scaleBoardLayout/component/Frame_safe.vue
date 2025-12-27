<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenSafeData } from '@/api/smartBoard'
import Bus from '@/views/smartBoard/util/Bus.js'

export default {
  components: { FrameLayout },
  props: {
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      viewData: [],
      days: [
        null, null, 1, 2, 3, null, null,
        null, null, 4, 5, 6, null, null,
        7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27,
        null, null, 28, 29, 30, null, null,
        null, null, 31, '', '', null, null,
      ]
    }
  },
  mounted() {
    this.getData(true)
// eventBus.on('refreshViewData', getData)
  },
  methods: {
    async getData(loadingFlag = false) {
      if (loadingFlag) Bus.$emit('addLoading')
      // let date = await dateFormat.getDateRang(this.dateRang) // 获取本月的时间区间
      getScreenSafeData({
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
  <FrameLayout :title="title">
    <div class="contain">
      <div class="left">
        <div
          v-for="i in days" :key="i" :class="{'cell': i!==null, 'bg-success': !!i && i<=new Date().getDate() }">
          {{ i }}
        </div>
      </div>
      <div class="right">
        <div class="item text-success">
          <span class="title">● 无事故</span>
          <span class="number">{{ new Date().getDate() }}</span>
        </div>
        <div class="item text-warning">
          <span class="title">● 轻微事故</span>
          <span class="number">0</span>
        </div>
        <div class="item text-danger">
          <span class="title">● 重大事故</span>
          <span class="number">0</span>
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
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 每列等宽 */
    grid-template-rows: repeat(6, auto); /* 行高根据内容自动调整 */
    gap: 0; /* 单元格间距 */
    width: 160px;
    height: 160px;

    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #fff;
      color: #fff;
      //width: 20px;
      //height: 20px;
      font-size: 14px;
      font-weight: bold;
    }
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
      margin: 10px 0;
    }
  }
}
</style>
