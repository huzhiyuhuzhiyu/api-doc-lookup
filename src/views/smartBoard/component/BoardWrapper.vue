<script>
import BoardTitle from '@/views/smartBoard/component/BoardTitle.vue'
import { exitFullScreen, fullScreen } from '@/utils'
import BoardDateTime from '@/views/smartBoard/component/BoardDateTime.vue'
import BoardLegend from '@/views/smartBoard/component/BoardLegend.vue'

export default {
  name: 'BoardWrapper',
  components: { BoardLegend, BoardDateTime, BoardTitle },
  props: {
    boardTitle: {
      type: String,
      default: ''
    },
    needDateTime: {
      type: Boolean,
      default: true
    },
    legendList: {
      type: Array,
      default: () => []
    },
    isPlay:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      isFullScreen: false,
      dialogVisible:false,
    }
  },
  computed:{
    fullPath(){
      return `${location.href}/full`
    }
  },
  methods: {
    async selectText(){
      if(!window.getSelection){
        return
      }
      await this.$nextTick()
      const selection = window.getSelection();
      selection.removeAllRanges();
      const range = document.createRange();
      const node = this.$refs.fullPath;
      range.selectNodeContents(node);
      selection.addRange(range);
    },
    async iconClick() {
      if (document.fullscreenElement) {
        this.isFullScreen = false
        return exitFullScreen()
      }
      this.isFullScreen = true

      fullScreen(this.$refs.wrapperCover)
      await this.$nextTick()
    },
    async copyLink() {
      const path = `${location.href}/full`

      try {
        if (!('clipboard' in navigator)) {
            throw new Error('Clipboard API not supported')
        }
        await navigator.clipboard.writeText(path)
        console.log('复制链接成功:', path)
        this.$message.success('复制链接成功，请粘贴到浏览器地址栏访问')
      } catch (e) {
        console.error('复制链接失败:', e)
         this.dialogVisible = true
         this.selectText()
      }

    },

  },
  mounted() {
    // const resizeApp=()=> {
    //   console.log(window.innerWidth,window.innerHeight)
    //   const scaleX = window.innerWidth / 1920;
    //   const scaleY = window.innerHeight / 1080;
    //   // 按比例缩放，保证不裁切
    //   const scale = Math.min(scaleX, scaleY);
    //   this.$refs.board.style.transform = `scale(${scale})`;
    // }
    // resizeApp()
    // window.addEventListener('resize', resizeApp);
  }
}
</script>

<template>
  <div :class="['layout']" ref="layout">
    <div class="wrapper-cover" ref="wrapperCover" :style="!isFull ? 'width: 100%;height:100%;' : ''">
      <div class="wrapper" ref="board" id="wrapper">
        <div class="right-button">
          <i :title="isPlay ?'点击暂停滚动':'点击开启滚动'" @click="$emit('scroll-change', $emit('update:isPlay',!isPlay))" :class="[isPlay?'el-icon-video-pause' :'el-icon-video-play' ,'icon']"/>
          <i title="点击以复制全屏链接" v-if="!$route.path.endsWith('/full')" @click="copyLink" class="el-icon-s-promotion icon"/>
          <el-dialog
            v-if="!$route.path.endsWith('/full')"
            title="请复制以下链接"
            :visible.sync="dialogVisible"
            width="30%">
            <div ref="fullPath">
              {{fullPath}}
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
          <i title="点击以刷新" @click="$emit('refresh')" class="el-icon-refresh icon"/>
          <i v-if="!isFullScreen" title="点击以进入全屏" @click="iconClick" class="el-icon-full-screen icon"/>
          <i v-else  @click="iconClick" title="点击以退出全屏">
            <svg  t="1755758181696" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2310" width="24" height="24">
              <path d="M697.6 361.6256a35.1744 35.1744 0 0 1-35.2256-35.2256V140.8a35.1744 35.1744 0 1 1 70.4512 0v150.4256h150.3744c17.664 0 32.256 13.0048 34.816 29.952l0.4096 5.2224c0 19.456-15.7696 35.2256-35.2256 35.2256h-185.6z m0 556.8a35.1744 35.1744 0 0 1-35.2256-35.2256v-185.6c0-19.456 15.7696-35.2256 35.2256-35.2256h185.6a35.1744 35.1744 0 1 1 0 70.4512h-150.3744v150.3744c0 17.664-13.056 32.256-30.0032 34.816l-5.2224 0.4096z m-371.2 0a35.1744 35.1744 0 0 1-35.2256-35.2256l0.0512-150.3744H140.8a35.2256 35.2256 0 0 1-34.816-30.0032l-0.3584-5.2224c0-19.456 15.7184-35.2256 35.1744-35.2256h185.6c19.456 0 35.2256 15.7696 35.2256 35.2256v185.6c0 19.456-15.7696 35.2256-35.2256 35.2256zM140.8 361.6256a35.1744 35.1744 0 1 1 0-70.4h150.4256V140.8c0-17.664 13.0048-32.256 29.952-34.816l5.2224-0.3584c19.456 0 35.2256 15.7184 35.2256 35.1744v185.6c0 19.456-15.7696 35.2256-35.2256 35.2256H140.8z" p-id="2311" fill="#ffffff"></path>
            </svg>
          </i>
        </div>

        <BoardTitle :name="boardTitle"/>
        <div class="center-wrapper">

          <slot/>
          <BoardDateTime v-if="needDateTime"/>
          <div class="legend">
            <slot name="legend">
              <BoardLegend v-if="legendList.length" :list="legendList"/>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.right-button{
  .icon{
    font-size: 24px;
    color: #fff;
    cursor: pointer;
    margin-left: 10px;
  }
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
}

.layout {
  width: 100%;
  height: 100%;
  overflow: auto;

  .wrapper-cover {
    --wrapperBgWidth: 100%;
    --wrapperBgHeight: 100%;
    width: 100vw;
    height: 100vh;
    min-width: var(--wrapperBgWidth);
    min-height: var(--wrapperBgHeight);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("~@/assets/images/board/bgd@2x.png");
    background-repeat: no-repeat;
    background-size: cover;

    .wrapper {
      background-image: url("~@/assets/images/board/bgd.png");
      background-repeat: no-repeat;
      background-size: var(--wrapperBgWidth) var(--wrapperBgHeight);
      width: var(--wrapperBgWidth);
      height: var(--wrapperBgHeight);
      min-width: var(--wrapperBgWidth);
      max-width: var(--wrapperBgWidth);
      //
      min-height: var(--wrapperBgHeight);
      max-height: var(--wrapperBgHeight);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 75px 23px 0;

      .center-wrapper {
        --center-wrapper-height:calc(100% - 44px );
        --tip-top: 74px;
        --tip-left: 25px;
        --tip-font-size: 19px;
        --tip-height: 22px;
        width: 100%;
        height: var(--center-wrapper-height);
        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 5px;
        .legend {
          position: absolute;
          left: var(--tip-left);
          top: var(--tip-top);
        }

        ::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        scrollbar-width: none; /* Firefox */
      }

    }
  }
}


</style>
