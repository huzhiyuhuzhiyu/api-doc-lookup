<template>
  <div class="JNPF-common-layout">
      <iframe style="width: 100%;height: 100%" src="http://jlw.zhouguantong.com/board/bn/index.html" frameborder="0" ref="iframeRef"></iframe>
  </div>
</template>

<script>
import {elFullScreen} from '@/utils';

export default {
  name: 'intelligentIargeScreen',
  data() {
    return {
        fullScreenFn: null,
    }
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
  },
  beforeDestroy() {
    window.removeEventListener('message', this.fullScreenFn);
  },
}
</script>
