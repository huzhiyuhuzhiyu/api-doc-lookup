<script>
export default {
  name: 'RollingLoading',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 7
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      observer: null,
      internalCurrentPage: 1,
      isLoading: false,
      hasInitialized: false // 添加初始化标记
    }
  },
  computed: {
    loading() {
      if (!this.hasInitialized) {
        return true
      }
      return this.total > 0 && this.internalCurrentPage * this.pageSize < this.total
    }
  },
  watch:{
    currentPage(val){
      this.internalCurrentPage = val
    }
  },
  methods: {
    // 处理加载逻辑
    handleLoad() {
      if (this.isLoading ) return // 如果正在加载，直接返回
      this.isLoading = true
      this.internalCurrentPage = this.currentPage + 1
      this.$emit('update:currentPage', this.internalCurrentPage)
      this.$emit('current-change', {
        pageSize: this.pageSize,
        currentPage: this.internalCurrentPage
      })
    },
    async resetLoadingState() {
      this.isLoading = false
      await this.$nextTick()
      if (this.loading) {
        // 检查加载元素是否还在视口内
        const loadingElement = this.$refs.loading
        if (loadingElement) {
          const rect = loadingElement.getBoundingClientRect()
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
          if (isInViewport) {
            setTimeout(() => {
              if (!this.isLoading) {
                this.handleLoad()
              }
            }, 100)
          }
        }
      }

    }
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      if (!this.hasInitialized) {
        this.hasInitialized = true
        this.handleLoad()
      }
      if (entries[0].isIntersecting && !this.isLoading && this.loading) {
        this.handleLoad()

      }
    }, { threshold: 0.1 })
    this.observer.observe(this.$refs.loading)
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
</script>

<template>
  <div>
    <div ref="loading" class="loading" v-loading="loading">

    </div>
    <div v-if="total === 0 && !loading" class="nomore">
      <svg t="1754373709546" class="icon" viewBox="0 0 1137 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5083" width="200" height="200">
        <path
          d="M989.531022 364.259556c12.117333 22.755556-15.132444-41.813333-60.529778-41.813334H208.787911a66.104889 66.104889 0 0 0-60.529778 38.627556C133.125689 386.787556 0.005689 602.396444 0.005689 647.452444v292.864A82.773333 82.773333 0 0 0 78.683022 1024h980.423111A80.668444 80.668444 0 0 0 1137.783467 940.316444v-292.864c0-41.813333-148.252444-283.192889-148.252445-283.192888z m-257.194666 263.907555a34.133333 34.133333 0 0 0-36.295112 28.956445v6.599111A132.096 132.096 0 0 1 568.894578 798.72a132.096 132.096 0 0 1-127.089778-134.997333v-9.671111a39.822222 39.822222 0 0 0-36.295111-25.770667h-335.644445l114.972445-221.866667s21.162667-38.627556 51.2-38.627555h677.831111c24.234667 0 27.249778 9.671111 45.511111 38.627555l114.972445 221.866667h-342.072889zM323.817244 206.563556L236.037689 116.451556a22.357333 22.357333 0 0 1 0-32.199112 22.755556 22.755556 0 0 1 33.28 0l87.779555 86.926223a26.396444 26.396444 0 0 1 0 35.384889 25.998222 25.998222 0 0 1-33.28 0z m238.933334-38.627556a25.486222 25.486222 0 0 1-5.973334-16.213333l-3.015111-125.155556a24.405333 24.405333 0 0 1 21.162667-25.770667 19.683556 19.683556 0 0 1 24.234667 19.285334l3.015111 125.496889a24.177778 24.177778 0 0 1-15.132445 22.755555 17.521778 17.521778 0 0 1-24.234666 0z m223.914666 32.199111a24.405333 24.405333 0 0 1 0-32.199111l81.692445-93.354667a22.755556 22.755556 0 0 1 33.28 0 26.396444 26.396444 0 0 1 0 35.384889l-81.578667 93.354667a22.414222 22.414222 0 0 1-15.132444 6.428444c-9.102222-3.185778-15.132444-3.185778-18.147556-9.671111z"
          fill="#3072d7" p-id="5084"
        ></path>
      </svg>
      <div class="text">暂无数据</div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.loading {
  // 加载小圈动画
  width: 100%;
  height: 50px;

  ::v-deep .el-loading-mask {
    background: transparent !important;
  }

  ::v-deep .el-loading-spinner .path {
    stroke: rgb(13, 118, 206);
  }

}

.nomore {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .text {
    font-size: 20px;
    color: #999;
    margin-top: 20px;
  }
}
</style>
