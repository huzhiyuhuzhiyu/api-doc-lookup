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
    subTitle: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      viewData: {},
      days: [
        null, null, 1, 2, 3, null, null,
        null, null, 4, 5, 6, null, null,
        7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27,
        null, null, 28, 29, 30, null, null,
        null, null, 31, 32, '', null, null,
      ],
      // days: []
    }
  },
  mounted() {
    this.getData(true)
    this.generateCalendarDays()
// eventBus.on('refreshViewData', getData)
  },
  methods: {
    generateCalendarDays() {
      const maxDay = Number(getDaysInCurrentMonth())
      const target = this.days.findIndex(item => item === maxDay)
      for (let i = target + 1; i < this.days.length; i++) {
        if (isNumeric(this.days[i])) this.days[i] = ''
      }

      function getDaysInCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 注意：getMonth() 返回 0-11（0 表示一月）

        // 创建下个月的第 0 天，即当前月的最后一天
        const lastDay = new Date(year, month + 1, 0);
        return lastDay.getDate();
      }
      function isNumeric(value) {
        return typeof value === 'number' && isFinite(value);
      }
    },
    async getData(loadingFlag = false) {
      if (loadingFlag) Bus.$emit('addLoading')
      // let date = await dateFormat.getDateRang(this.dateRang) // 获取本月的时间区间
      getScreenSafeData({
        tenantId: 'zsk',
        _title: this.title,
        productionLineName: '大线装配车间',
        month: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
        // startDate: date[0],
        // endDate: date[1]
      }).then(res => {
        this.viewData = {
          ...res.data,
          safeCalenderList: res.data.safeCalenderList.map(dayInfo => ({
            ...dayInfo,
            accidentGrade: dayInfo.accidentGrade,
            day: Number(dayInfo.day.split('-')[2])
          }))
        }
      }).finally(err => {
        if (loadingFlag) Bus.$emit('subLoading')
      })
    },
    getDayClass(i) {
      const result = { 'cell': i !== null }
      const target = this.viewData.safeCalenderList.find(item => item.day === i)
      if (!target && !!i && i <= new Date().getDate()) result['bg-success'] = true
      if (target && target.accidentGrade === 'minor_injury') result['bg-warning'] = true
      if (target && target.accidentGrade === 'major_accident') result['bg-danger'] = true
      return result
    }
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <div class="contain">
      <div class="left">
        <div
          v-for="i in days" :key="i" :class="getDayClass(i)">
          {{ i }}
        </div>
      </div>
      <div class="right">
        <div class="item text-success">
          <span class="title">● 无事故</span>
          <span class="number">{{ viewData.safeCount || 0 }}</span>
        </div>
        <div class="item text-warning">
          <span class="title">● 轻微事故</span>
          <span class="number">{{ viewData.minorInjuryCount || 0 }}</span>
        </div>
        <div class="item text-danger">
          <span class="title">● 重大事故</span>
          <span class="number">{{ viewData.majorInjuryCount || 0 }}</span>
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
    //width: 160px;
    //height: 160px;

    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #fff;
      color: #fff;
      width: 22px;
      height: 22px;
      box-sizing: border-box;
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
