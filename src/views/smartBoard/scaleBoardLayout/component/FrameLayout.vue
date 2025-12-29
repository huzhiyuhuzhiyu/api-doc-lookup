<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
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
        <span class="sub-title-text" v-if="subTitle">&nbsp;{{ subTitle }}</span>
      </div>
      <div class="right">
        <slot name="title-right" />
      </div>
    </div>
    <div class="frame-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util";

.frame-layout {
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  background-image: url("~@/assets/images/board/frame_layout.png");
  border-image: url("~@/assets/images/board/frame_border.png") 30 / 19px round;
  background-repeat: no-repeat;
  background-size: cover; /* 或者使用contain */
}

.frame-title {
  //font-weight: bold;
  display: flex;
  height: 36px;
  font-size: 22px;
  line-height: 36px;
  text-indent: 24px;
  color: #fff;

  .left {
    width: 230px;
    background-image: url("~@/assets/images/board/frame_title_left.png");
    background-repeat: round;
    font-family: "YouSheBiaoTiHei", serif;
    text-wrap: nowrap;

    .title-text {
      background-image: linear-gradient(#fff 30%, #30e4d9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .sub-title-text {
      font-family: "微软雅黑", serif;
      font-size: 14px;
      //font-weight: bold;
      color: #29FBD888;
    }
  }

  .right {
    flex: 1;
    background-image: url("~@/assets/images/board/frame_title_right.png");
    background-repeat: round;
  }
}

.frame-content {
  position: absolute;
  top: 36px;
  width: 100%;
  height: calc(100% - 36px);
  font-size: 22px;
  //padding: 5px 10px;
  box-sizing: border-box;
}

$primary-color: #0b80e0;
.text-primary {
  color: $primary-color;
}

.bg-primary {
  background-color: $primary-color;
}

$success: #00CB62;
.text-success {
  color: $success;
}

.bg-success {
  background-color: $success;
}

$warning: #FCAA47;
.text-warning {
  color: $warning;
}

.bg-warning {
  background-color: $warning;
}

$danger: #dc3545;
.text-danger {
  color: $danger;
}

.bg-danger {
  background-color: $danger;
}
</style>
