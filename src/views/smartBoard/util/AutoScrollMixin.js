import { getTenantId } from '@/utils'

const isWin= true//navigator.platform.toLowerCase().includes('win')
console.log('isWin',isWin)
export default {
  data(){
    return {
      gapEl:1,
      gapTime:isWin ? 20 : 50,
      pageTime: 15000,
      contentDom:null,
      total:0,
      endFlag:false,
      isFail: false,
      tenantId:getTenantId() || 'qihe',
      innerIsPlay:true,
      scrollTimer:null,
      rafId:null,
      blockHeight:0,
      loading:false,
      sameTimes:0,
      maxSameTimes:3,
      preScrollHeight:0,
    }
  },
  computed:{
    isPlay:{
      get(){
        return this.innerIsPlay
      },
      set(value){
        this.innerIsPlay = value
        this.scrollChange(value)
      }

    },
    isPage() {
      return /\/page$/.test(this.$route.path)
    },
    isFull(){
      return /.+full.?/.test(this.$route.path)
    }
  },
  methods:{
    async getDataWrapper(noLoop){
      if(this.loading){
        return
      }
      this.loading = true
      try {
        if( !this.contentDom){
          return this.$message.error('未找到滚动容器，请检查contentDom是否正确')
        }
        this.contentDom.scrollTop -= 5
        await this.getData?.(noLoop)
      } finally {
        this.loading = false
      }
    },
    reset(){},
    scrollToTop(){
      const container = this.contentDom
      if (!container) {
        return
      }
      container.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    },
    // endAutoScroll () {
    //   if (this.endFlag) {
    //     cancelAnimationFrame(this.endFlag)
    //     this.endFlag = null
    //   }
    //   this.animationList.forEach(item=>cancelAnimationFrame(item))
    //   this.animationList = []
    // },
    startAutoScrollWin() {
      if(!this.isPlay){
        return;
      }
      this.endFlag = false
      const gapEl = this.gapEl
      const gapTime = this.gapTime
      const container = this.contentDom

      if (!container || this.total === 0) {
        return
      }

      let lastTime = performance.now()
      const animate = (currentTime) => {
        const deltaTime = currentTime - lastTime
        if (this.endFlag) {return}
        if (deltaTime < gapTime) {
          return this.rafId = requestAnimationFrame(animate)
        }
        lastTime = currentTime
        const currentScrollTop = container.scrollTop
        const scrollHeight = container.scrollHeight
        const maxScrollTop = scrollHeight - container.clientHeight


        if (Math.ceil(currentScrollTop + gapEl + this.blockHeight) >= maxScrollTop) {
          console.log('滚动到底部，调用getData')
          if(scrollHeight !== this.preScrollHeight){
            this.preScrollHeight = scrollHeight
            this.sameTimes = 0
          }else{
            this.sameTimes++
            if(this.sameTimes >= this.maxSameTimes){
              console.log('多次滚动到底部但未获取到新数据，停止滚动')
              this.isFail = true
              return this.endAutoScroll()
            }
          }
          return this.getDataWrapper()
        } else {
          if(this.endFlag){
            return;
          }
          this.elScrollChange(container,gapEl)
          this.rafId = requestAnimationFrame(animate)
        }
      }
      this.rafId = requestAnimationFrame(animate)
      this.toggleScrollEventListener(false)
    },
    elScrollChange(el,gap){
      // el.scrollTop += gap
      el.scrollBy({
        top:  gap,
        behavior: 'smooth'
      })
    },
    endAutoScrollWin () {
      this.endFlag = true
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
      // 停止自动滚动后，监听滚动事件，增加支持手动滚动加载分页
      this.toggleScrollEventListener(true)
    },
    toggleScrollEventListener(state) {
      if (state) {
        this.contentDom.addEventListener('scroll', this.containerScrollChanged)
      } else {
        this.contentDom.removeEventListener('scroll', this.containerScrollChanged)
      }
    },
    // 监听滚动事件
    containerScrollChanged(e) {
      const container = this.contentDom
      const currentScrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const maxScrollTop = scrollHeight - container.clientHeight
      const gapEl = this.gapEl

      if (Math.ceil(currentScrollTop + gapEl + this.blockHeight) >= maxScrollTop) {
        console.log('滚动到底部，调用getData')
        this.getDataWrapper(true)
      }
    },
    startAutoScrollLinux() {
      if (!this.isPlay) {
        return this.endAutoScroll()
      }

      this.endAutoScroll()
      const gapEl = this.gapEl
      const container = this.contentDom
      if (!container || this.total === 0) {
        return this.endAutoScroll()
      }


      this.scrollTimer = setInterval(() => {
        if (!this.isPlay) {
          return this.endAutoScroll()
        }

        const currentScrollTop = container.scrollTop
        const maxScrollTop = container.scrollHeight - container.clientHeight

        // 检查滚动是否已到底部
        if (Math.ceil(currentScrollTop + gapEl + this.blockHeight) >= maxScrollTop) {
          return this.getDataWrapper()
        }

        this.elScrollChange(container,gapEl)
      }, this.gapTime)
    },
    startAutoScroll(){
      if(this.isPage){
        this.endAutoScroll()
        this.scrollTimer = setInterval(() => {
          this.getDataWrapper()
        },this.pageTime);
        return
      }
      return isWin? this.startAutoScrollWin() : this.startAutoScrollLinux()
    },
    endAutoScroll(){
      if(this.isPage){
        clearInterval(this.scrollTimer)
        return;
      }
      return isWin? this.endAutoScrollWin() : this.endAutoScrollLinux()
    },
    endAutoScrollLinux() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer)
        this.scrollTimer = null
      }
    },
    scrollChange(isPlay){
      if (isPlay) {
        this.startAutoScroll()
      } else {
        this.endAutoScroll && this.endAutoScroll()
      }
    },
  },
  watch:{
    contentDom(newVal,val){
      if(newVal){
        const targetWidth = 1920;
        if (this.isFull) {
          const deviceWidth = document.documentElement.clientWidth;
          if(deviceWidth < targetWidth){
            document.body.style.zoom = deviceWidth / targetWidth;
          }
        } else {
          this.$nextTick(() => {
            const deviceWidth = document.querySelector('#wrapper').clientWidth;
            if(deviceWidth < targetWidth){
              document.querySelector('#wrapper').style.zoom = deviceWidth / targetWidth;
            } else {
              document.querySelector('#wrapper').style.zoom = targetWidth / deviceWidth;
            }
          })
        }
      }
    },
  },
  activated() {
    console.log('组件激活，开始自动滚动')
    this.startAutoScroll()
  },
  // 组件失活时（离开页面但保持在缓存中）
  deactivated() {
    console.log('组件失活，停止自动滚动')
    this.endAutoScroll && this.endAutoScroll()
  },
  beforeDestroy() {
    console.log('组件销毁，停止自动滚动')
    this.endAutoScroll && this.endAutoScroll()
  }
}
