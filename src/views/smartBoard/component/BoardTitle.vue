<script>
export default {
  name: 'BoardTitle',
  props: {
    name: {
      type: String,
      default: '智能线车间智能化看板'
    }
  }
}
</script>

<template>
  <div class="boardTitle">
    {{ name }}
  </div>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util";

.boardTitle {
  @include util.gradient-text(50%);
  font-size: 30px;
  position: absolute;
  width: 450px;
  height: 44px;
  top: 3.5%;
  left: calc(50% - 225px);
  font-weight: 700;
  text-align: center;
}
</style>
