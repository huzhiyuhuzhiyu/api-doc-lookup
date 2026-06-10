<script>
export default {
  name: 'BoardTitle',
  props: {
    name: {
      type: String,
      default: '智能线车间智能化看板'
    },
    subName: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <div class="boardTitle">
    {{ name }}
    <span v-if="subName" class="boardSubTitle">{{ subName }}</span>
  </div>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util";

.boardTitle {
  font-family: "YouSheBiaoTiHei", serif !important;
  top: 40px;
  font-size: 40px;
  color: #fff;

  @include util.gradient-text(50%);
  //font-size: 30px;
  position: absolute;
  width: 450px;
  height: 44px;
  //top: 3.5%;
  left: calc(50% - 225px);
  //font-weight: 700;
  text-align: center;

  .boardSubTitle {
    font-size: 28px;
    font-weight: normal;
    font-family: "微软雅黑", serif !important;
  }
}
</style>
