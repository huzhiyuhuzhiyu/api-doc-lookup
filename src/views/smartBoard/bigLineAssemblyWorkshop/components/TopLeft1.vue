<script>
import FrameLayout from '@/views/smartBoard/component/FrameLayout.vue'
export default {
  components: {
    FrameLayout
  },
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
    // this.getViewData(true)
  },
  methods: {
    async getViewData(loadingFlag = false) {
      if (loadingFlag) addLoading()
      let date = await dateFormat.getDateRang(this.dateRang) // 获取本月的时间区间
      getprodQcTotal({
        tenantId: dateFormat.tenantId,
        _title: this.title,
        startDate: date[0],
        endDate: date[1]
      }).then(res => {
        this.viewData = res.data || []
      }).finally(err => {
        if (loadingFlag) subLoading()
      })
    },
    targetValueFormat(item) {
      if (item.name.endsWith('率')) return item.targetValue + '%'
      return item.targetValue
    }
  }
}

// eventBus.on('refreshViewData', getViewData)
</script>

<template>
  <FrameLayout :title="title">
    <div class="grid-content">
      <div class="item" v-for="item in viewData" :key="item.label">
        <div class="label">{{ item.name }}</div>
        <div class="value gradient-text">{{ targetValueFormat(item) }}</div>
      </div>
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.grid-content {
  height: 100%;
  padding: 14px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

  &.four-column {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .item {
    .label {
      color: #999;
    }

    .value {
      font-size: 25px;
      font-weight: bold;
    }
  }
}

.flex-content {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 10px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);
  }

  .item {
    display: grid;
    grid-template-columns: 22.5px 28px 1fr;
    position: relative;
    width: 100%;
    height: 30.5px;
    margin-bottom: 12px;

    > * {
      position: absolute;
      vertical-align: top;
    }

    .medal {
      width: 22.5px;
      height: 100%;
      left: 21.5px;
      top: 0;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar {
      //width: 28px;
      height: 28px;
      left: 52px;
      top: 1.5px;
      border-radius: 50%;
    }

    .schedule {
      //position: relative;
      width: 120px;
      height: 100%;
      left: 89.5px;
      top: 0;
      margin: 0;
      //background-color: #0e5fff;
      display: flex;
      align-items: center;
      justify-content: center;

      .progress {
        width: 70px;
        height: 8px;
        position: absolute;
        left: 0;
        margin: 0;
        border-radius: 10px;

        .bar {
          background-color: #00FFF2;
          z-index: 10;
        }
      }

      .percentage {
        position: absolute;
        left: 75px;
      }
    }
  }
}

.list-content {
  height: 100%;
  padding: 7px;
  box-sizing: border-box;
  overflow: hidden;

  .table-title {
    height: 20px;
    background-color: #24689588;
    width: 100%;
    overflow: hidden;

    & > * {
      font-size: 12px;
      line-height: 20px;
      margin: 0 3px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .table-content {
    height: calc(100% - 20px);
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;

    .scroll_item {
      //height: 20px;
      //width: 100%;
      height: 16px;

      //font-family: Source Han Sans;
      font-size: 12px;
      line-height: 12px;
      letter-spacing: 0em;
      color: #FFFFFF;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      & > * {
        margin: 0 3px;
        //background-color: orange;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
      }
    }
  }
}

</style>
