<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenDayQualifiedData, getScreenProdAchievementData, getScreenReworkData } from '@/api/smartBoard'
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
      viewData: [],
      tableColumns: []
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
      if (this.title === '产量') {
        getScreenProdAchievementData({
          tenantId: 'nm',
          _title: this.title,
          startDate: this.jnpf.getToday('YYYY-MM-DD', 'today-7'),
          endDate: this.jnpf.getToday('YYYY-MM-DD', 'today-1'),
          // productionLineName: '大线装配车间',
          ...this.query,
        }).then(res => {
          this.viewData = res.data || []
          this.tableColumns = res.data.map(item => ({
            prop: item.name,
            label: item.name,
            color: (row) => {
              const value = Number(row[item.name].replace('%', ''))
              const targetValue = Number(row.target.replace('%', ''))
              if (targetValue * 0.9 > value) return '#dc3545'
              if (targetValue * 0.95 > value) return '#FCAA47'
              return '#fff'
            },
          }))
          this.viewData = [
            res.data.reduce((prev, cur) => ({
              ...prev,
              [cur.name]: this.jnpf.numberFormat(cur.targetValue, 2) + '%',
            }), {
              norm: '产量达成率',
              target: '98%',
            })
          ]

          this.tableColumns.unshift(
            {
              prop: 'norm',
              label: '指标',
              width: '70px',
            },
            {
              prop: 'target',
              label: '目标',
              width: '35px',
              color: '#8FA1FF',
            })

        }).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      } if (this.title === '质量' && this.query.productionLineName === '成品仓库日常管理看板') {
        getScreenDayQualifiedData({
          tenantId: 'nm',
          _title: this.title,
          startDate: this.jnpf.getToday('YYYY-MM-DD', 'today-7'),
          endDate: this.jnpf.getToday('YYYY-MM-DD', 'today-1'),
          // productionLineName: '大线装配车间',
          ...this.query,
        }).then(res => {
          this.viewData = res.data || []
          this.tableColumns = res.data.map(item => ({
            prop: item.name,
            label: item.name,
            color: (row) => {
              const value = Number(row[item.name].replace('%', ''))
              const targetValue = Number(row.target.replace('%', ''))
              if (targetValue * 0.9 > value) return '#dc3545'
              if (targetValue * 0.95 > value) return '#FCAA47'
              return '#fff'
            },
          }))
          this.viewData = [
            res.data.reduce((prev, cur) => ({
              ...prev,
              [cur.name]: this.jnpf.numberFormat(cur.targetValue, 2) + '%',
            }), {
              norm: '日质量合格率',
              target: '95%',
            })
          ]

          this.tableColumns.unshift(
            {
              prop: 'norm',
              label: '指标',
              width: '70px',
            },
            {
              prop: 'target',
              label: '目标',
              width: '35px',
              color: '#8FA1FF',
            })

        }).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      } else if (this.title === '质量' || this.title === '成本') {
        getScreenReworkData({
          tenantId: 'nm',
          _title: this.title,
          startDate: this.jnpf.getToday('YYYY-MM-DD', 'today-7'),
          endDate: this.jnpf.getToday('YYYY-MM-DD', 'today-1'),
          // productionLineName: '大线装配车间',
          ...this.query,
        }).then(res => {
          this.viewData = res.data || []
          this.tableColumns = res.data.map(item => ({
            prop: item.name,
            label: item.name,
            color: (row) => {
              const value = Number(row[item.name].replace('%', ''))
              const targetValue = Number(row.target.replace('%', ''))
              if (targetValue * 0.9 < value) return '#dc3545'
              if (targetValue * 0.95 < value) return '#FCAA47'
              return '#fff'
            },
          }))
          this.viewData = [
            res.data.reduce((prev, cur) => ({
              ...prev,
              [cur.name]: this.jnpf.numberFormat(cur.targetValue, 2) + '%',
            }), {
              norm: '返工率',
              target: '2%',
            })
          ]

          this.tableColumns.unshift(
            {
              prop: 'norm',
              label: '指标',
              width: '70px',
            },
            {
              prop: 'target',
              label: '目标',
              width: '35px',
              color: '#8FA1FF',
            })
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
    <div class="container">
      <ScreenTable :data="viewData" :columns="tableColumns" />
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px;
  background-color: transparent;
}
</style>
