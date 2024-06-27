<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    let fontSizeValue = localStorage.getItem('fontSizeValue') ? localStorage.getItem('fontSizeValue') : 16
    document.getElementsByTagName('body')[0].style.setProperty('--fSize', fontSizeValue + 'px');

    // if (process.env.NODE_ENV === 'development') return
    // this.$nextTick(() => {
    //   window.addEventListener('beforeunload', this.beforeUnload)
    // })
  },
  beforeDestroy() {
    // if (process.env.NODE_ENV === 'development') return
    // window.removeEventListener('beforeunload', this.beforeUnload)
  },
  created() {
    // let imgURL = localStorage.getItem('aaa') === 'zgt' ? location.origin + '/favicon1.ico' : location.origin + '/favicon1.ico'
    // var head = document.getElementsByTagName('head')[0];
    // var linkTag = document.createElement('link');
    // linkTag.type = "image/x-icon";
    // linkTag.rel = "shortcut icon";
    // linkTag.setAttribute('href', imgURL)
    // head.appendChild(linkTag);
  },
  methods: {
    beforeUnload(e) {
      if (!this.$store.state.user.isLeaveToast) {
        this.$store.commit('user/SET_TOAST', false)
        return false
      }
      e = e || window.event
      if (e || window.event) e.returnValue = 1;
      return 1;
    }
  }
}
</script>
