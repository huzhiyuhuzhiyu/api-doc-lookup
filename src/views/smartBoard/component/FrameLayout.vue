<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <div class="frame-layout">
    <div class="frame-title">
      <div class="left">
        <span class="title-text">{{ title }}</span>
      </div>
      <div class="right"></div>
    </div>
    <div class="frame-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.frame-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("~@/assets/images/board/frame_layout.png");
  border-image: url("~@/assets/images/board/frame_border.png") 30 / 19px round;
  background-repeat: no-repeat;
  background-size: cover; /* 或者使用contain */
}

.frame-title {
  font-weight: bold;
  display: flex;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  text-indent: 14px;

  .left {
    width: 230px;
    background-image: url("~@/assets/images/board/frame_title_left.png");
    background-repeat: round;
  }

  .right {
    flex: 1;
    background-image: url("~@/assets/images/board/frame_title_right.png");
    background-repeat: round;
  }
}

.frame-content {
  position: absolute;
  top: 18px;
  width: 100%;
  height: calc(100% - 18px);
  font-size: 12px;
  //padding: 5px 10px;
  box-sizing: border-box;
}
</style>
