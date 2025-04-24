<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <iframe src="http://jlw.zhouguantong.com/board/bn/index.html" frameborder="0" ref="iframeRef"></iframe>
    </div>

  
  </div>
</template>

<script>


export default {
  name: 'intelligentIargeScreen',

  data() {
    return {

    }
  },
  mounted () {
    this.$refs.iframeRef.requestFullscreen()
    
  }
  
}
</script>
