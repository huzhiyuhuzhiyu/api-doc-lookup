<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenCostData, getScreenDayQualifiedData, getScreenProdAchievementData, getScreenQualifiedData, getScreenReworkData } from '@/api/smartBoard'
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
      reworkData: null,
      tableColumns: [],
      staticColumns: [
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
        },
      ],
      targetComparatorList: [
        { label: "大于", value: "gt", type: "primary", symbol: '>' },
        { label: "小于", value: "lt", type: "warning", symbol: '<' },
        { label: "小于等于", value: "le", type: "warning", symbol: '<=' },
        { label: "大于等于", value: "ge", type: "primary", symbol: '>=' }
      ],
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
      const query = {
        tenantId: 'nm',
        _title: this.title,
        startDate: this.jnpf.getToday('YYYY-MM-DD', 'today-7'),
        endDate: this.jnpf.getToday('YYYY-MM-DD', 'today-1'),
        ...this.query,
      }
      if (this.title === '产量') {
        getScreenProdAchievementData(query).then(this.successCallback).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      }
      if (this.title === '质量' && this.query.productionLineName === '成品仓库') {
        getScreenDayQualifiedData(query).then(this.successCallback).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      } else if (this.title === '质量') {
        getScreenQualifiedData(query).then(this.successCallback).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })

        Bus.$emit('addLoading')
        this.reworkData = {
          jnpf: this.jnpf,
          targetComparatorList: this.targetComparatorList,
          tableColumns: [],
          viewData: []
        }
        getScreenReworkData(query).then(res => this.successCallback(res, this.reworkData)).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      } else if (this.title === '成本') {
        getScreenCostData(query).then(this.successCallback).finally(err => {
          if (loadingFlag) Bus.$emit('subLoading')
        })
      }
    },
    successCallback(res, target) {
      const _this = target || this
      if(!Array.isArray(res.data)) {
        res.data = [res.data]
      }
      _this.tableColumns = res.data[0].list.map(item => ({
        prop: item.name,
        label: item.name,
        color: (row) => {
          const value = Number(row[item.name].toString().replace('%', ''))
          const targetValue = Number(row.target.toString().replace('%', ''))
          if (eval(`${value}
          ${row.symbol}
          ${targetValue}`)) return row.meetTargetColor
          else return row.notMeetTargetColor
        },
      }))

      _this.viewData = res.data.map(item => ({
        norm: item.name,
        target: (item.indicatorRules.targetValue || 0) + (item.name.endsWith('率') ? '%' : ''),
        symbol: this.targetComparatorList.find(item2 => item2.value === item.indicatorRules.targetComparator)?.symbol,
        meetTargetColor: item.indicatorRules.meetTargetColor,
        notMeetTargetColor: item.indicatorRules.notMeetTargetColor,
        ...item.list.reduce((prev, cur) => ({
          ...prev,
          [cur.name]: this.jnpf.numberFormat(cur.targetValue, 2) + (item.name.endsWith('率') ? '%' : ''),
        }), {}),
      }))
    }
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <div class="container">
      <ScreenTable :data="viewData" :columns="staticColumns.concat(tableColumns)" />
      <ScreenTable v-if="reworkData" :data="reworkData.viewData" :columns="staticColumns.concat(reworkData.tableColumns)" />
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px;
  background-color: transparent;
}
</style>
