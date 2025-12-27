<script>
export default {
  name: 'BoardLegend',
  props:{
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template>
  <div class="legend-wrapper">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div :class="['item-circle']" :style="{backgroundColor:item.color}"></div>
      <div class="item-text">{{ item.text }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.legend-wrapper {
  display: flex;
  height: var(--tip-height);
  justify-content: center;
  align-items: center;
  .item {
    --item-font-size: calc(var(--tip-font-size) * 0.7);
    margin-left: 30px;
    position: relative;
    color: #fff;
    font-size: var(--item-font-size);
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      margin-left: 0;
    }

    .item-circle {
      width: var(--item-font-size);
      height: var(--item-font-size);
      border-radius: 50%;
    }
    .item-text{
      margin-left: 5px;
    }
    .green{
      background-color: #05a58e;
    }
    .blue{
      background-color: #3386ef;
    }
    .orange{
      background-color: #f7712d;
    }
    .red{
      background-color: #dd002c;
    }
    .yellow{
      background-color: #f5a201;
    }

    //&.green::before {
    //  background-color: #67c23a;
    //  width: var(--item-font-size);
    //  height:  var(--item-font-size);
    //  display: inline-block;
    //  content: '';
    //  position: absolute;
    //  border-radius: 50%;
    //}
  }
}

</style>
