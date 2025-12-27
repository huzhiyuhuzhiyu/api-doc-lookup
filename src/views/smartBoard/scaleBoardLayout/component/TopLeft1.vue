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
      viewData: []
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
    <div></div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
</style>
