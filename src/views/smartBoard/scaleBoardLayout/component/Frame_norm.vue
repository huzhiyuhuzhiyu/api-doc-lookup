<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getMockScreenSafeData } from '@/api/smartBoard'
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
    this.generateTableColumns()
    this.getData(true)
// eventBus.on('refreshViewData', getData)
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
        if (this.title === '产量') {
          this.viewData = [
            {
              norm: '产量达成率',
              target: '98%',
              monday: '98%',
              tuesday: '98%',
              wednesday: '98%',
              thursday: '98%',
              friday: '98%',
              saturday: '98%',
              sunday: '98%'
            },
          ]
        } else if (this.title === '质量') {
          this.viewData = [
            {
              norm: '产量合格率',
              target: '98%',
              column_1: '98%',
              column_2: '98%',
              column_3: '98%',
              column_4: '98%',
            },
          ]
        } else if (this.title === '成本') {
          this.viewData = [
            {
              norm: '责废率',
              target: '1.5%',
              monday: '2.5%',
              tuesday: '0.5%',
              wednesday: '0.5%',
              thursday: '0.5%',
              friday: '0.5%',
              saturday: '0.5%',
              sunday: '0.5%'
            },
            {
              norm: '粗磨报废率',
              target: '0%',
              monday: '0%',
              tuesday: '0%',
              wednesday: '0%',
              thursday: '0.2%',
              friday: '0.1%',
              saturday: '0%',
              sunday: '1%'
            },
          ]
        }
      }).finally(err => {
        if (loadingFlag) Bus.$emit('subLoading')
      })
    },
    generateTableColumns() {
      if (this.title === '产量') {
        this.tableColumns = [
          {
            prop: 'norm',
            label: '指标',
            width: '180px'
          },
          {
            prop: 'target',
            label: '目标',
          },
          {
            prop: 'monday',
            label: '周一',
          },
          {
            prop: 'tuesday',
            label: '周二',
          },
          {
            prop: 'wednesday',
            label: '周三',
          },
          {
            prop: 'thursday',
            label: '周四',
          },
          {
            prop: 'friday',
            label: '周五',
          },
          {
            prop: 'saturday',
            label: '周六',
          },
          {
            prop: 'sunday',
            label: '周日',
          }
        ]
      } else if (this.title === '质量') {
        this.tableColumns = [
          {
            prop: 'norm',
            label: '指标',
            width: '180px'
          },
          {
            prop: 'target',
            label: '目标',
          },
          {
            prop: 'column_1',
            label: '12.08~12.14',
          },
          {
            prop: 'column_2',
            label: '12.15~12.21',
          },
          {
            prop: 'column_3',
            label: '12.22~12.28',
          },
          {
            prop: 'column_4',
            label: '12.29~01.04',
          },
        ]
      } else if (this.title === '成本') {
        this.tableColumns = [
          {
            prop: 'norm',
            label: '指标',
            width: '180px'
          },
          {
            prop: 'target',
            label: '目标',
          },
          {
            prop: 'monday',
            label: '周一',
          },
          {
            prop: 'tuesday',
            label: '周二',
          },
          {
            prop: 'wednesday',
            label: '周三',
          },
          {
            prop: 'thursday',
            label: '周四',
          },
          {
            prop: 'friday',
            label: '周五',
          },
          {
            prop: 'saturday',
            label: '周六',
          },
          {
            prop: 'sunday',
            label: '周日',
          }
        ]
      }
    }
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <ScreenTable :data="viewData" :columns="tableColumns" />
  </FrameLayout>
</template>

<style lang="scss" scoped>
</style>
