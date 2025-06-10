<!-- 装配生产进度 -->
<template>
  <div class="JNPF-common-layout" :loading="loading" style="position: relative;">
      <el-button icon="el-icon-full-screen" type="text" style="position: absolute; right: 18px;top: -3px;" @click="goFullScreen"></el-button>
      <iframe style="width: 100%;height: 100%" src="http://screen.dasunyun.com/v/1925474815021518850" frameborder="0" ref="iframeRef"></iframe>
  </div>
</template>

<script>
import {elFullScreen} from '@/utils';

export default {
  name: 'assemblyProductionProgress',
  data() {
    return {
        fullScreenFn: null,
        loading:false,
    }
  },
  created () {
          this.loading=true
    
  },
  mounted() {
    this.fullScreenFn = ({data,origin}) => {
        if (data.type === 'fullscreen') {
            elFullScreen(this.$refs.iframeRef)
        }else if(data.type === 'exit_fullscreen') {
            document.exitFullscreen()
        }
       
    };
    window.addEventListener('message', this.fullScreenFn);
    window.addEventListener('message', this.loading=false);
  },
  methods: {
    goFullScreen() {
      const iframe = this.$refs.iframeRef;
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.fullScreenFn);
  },
}

</script>
<style scoped>
::v-deep .el-icon-full-screen{
  font-size: 38px!important;
}
</style>