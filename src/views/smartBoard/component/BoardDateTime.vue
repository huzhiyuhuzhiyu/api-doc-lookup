<script>
import jnpf from '@/utils/jnpf'

export default {
  name: 'BoardDateTime',
  data() {
    return {
      timer: null,
      now: this.getNow()
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.now = this.getNow()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getNow() {
      return jnpf.dateFormat(new Date(), 'YYYY年MM月DD日 HH:mm:ss')
    }
  }
}
</script>

<template>
  <div class="datetime">{{ now }}</div>
</template>

<style scoped lang="scss">
.datetime {
  position: absolute;
  right: var(--tip-left);
  top: var(--tip-top);
  height: var(--tip-height);
  display: flex;
  justify-content: center;
  align-items: center;
  //文字发光效果
  color: #fff;
  font-size: var(--tip-font-size);
  text-shadow: 0 0 10px rgb(0 255 242 / 80%), 0 0 20px rgba(165, 243, 239, .6)
}
</style>
