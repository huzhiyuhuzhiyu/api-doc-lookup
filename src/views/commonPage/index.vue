<template>
  <div class="JNPF-common-layout commonIng_box">
    <!-- <img src="@/assets/images/commonImg.png" alt="" srcset="" class="commonImg"> -->
    <img src="@/assets/images/welcomePage.jpg" alt="" srcset="" class="commonImg" />
    <!-- <div class="commonImg">欢迎使用数字化生产平台</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>
.commonIng_box {
  position: relative;
  background: #fff;
}

.commonImg {
  /* object-fit: fill; */

  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  /* color: #17abe3;
    font-size: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    letter-spacing: 4px; */
}
</style>
